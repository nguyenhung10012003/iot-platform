import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SensorData } from 'src/device/types/sensor-data';
import { IrrigationService } from 'src/irrigation/irrigation.service';
import { MailerService } from 'src/mailer.service';
import { MqttService } from 'src/mqtt/mqtt.service';
import { PrismaService } from 'src/prisma.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { evaluateCondition } from 'utils/condition';

@Injectable()
export class AutomationService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerService: SchedulerService,
    private readonly mqttService: MqttService,
    private readonly mailService: MailerService,
    private readonly irrigationService: IrrigationService,
  ) {}

  async onModuleInit() {
    const automations = await this.prisma.automations.findMany({
      include: { device: true },
    });

    automations.forEach(async (automation) => {
      if (automation.condition.type === 'Schedule') {
        this.schedulerService.addCronJob(
          `automation-${automation.id}`,
          automation.condition.cronCondition,
          async () => {
            console.log('Run automation');
            automation.actions.forEach(async (action) => {
              switch (action.type) {
                case 'TurnOff':
                  await this.prisma.device.update({
                    where: { id: automation.deviceId },
                    data: { online: false },
                  });
                  break;
                case 'TurnOn':
                  console.log('Turn on');
                  await this.prisma.device.update({
                    where: { id: automation.deviceId },
                    data: { online: true },
                  });
                  break;
                case 'Watering':
                  const location = await this.prisma.location.findFirst({
                    where: { id: automation.locationId },
                    include: {areas: true}
                  });
                  if (automation.useAI) {
                    const areas = location.areas;
                    this.irrigationService.watering(areas, location);
                    break;
                  }

                  const irrigationSpeed =
                    location?.setting?.dripRatePerHole *
                    location?.setting?.totalHole;
                  const time = automation.actions[0].time;

                  const amount = irrigationSpeed * time;

                  Logger.debug(
                    `Watering automation id: ${automation.id}, amount: ${amount}, time: ${time}, location: ${location?.name}`,
                  );

                  await this.prisma.irrigation.create({
                    data: {
                      amount: amount,
                      locationId: location.id,
                      time: time,
                    },
                  });
                  break;
              }
            });
          },
        );
      } else if (automation.condition.type === 'DeviceState') {
        this.mqttService.addCallback<SensorData>(
          automation.device.gatewayId,
          automation.id,
          async (topic, message) => {
            if (
              topic !== automation.device.topic ||
              message.type !==
                automation.condition.deviceStateCondition?.dataType
            )
              return;
            else {
              if (
                evaluateCondition(
                  message.data,
                  automation.condition.deviceStateCondition?.type,
                  automation.condition.deviceStateCondition?.value,
                )
              ) {
                automation.actions.forEach(async (action) => {
                  switch (action.type) {
                    case 'SendEmail':
                      // Gửi email
                      try {
                        const info = await this.mailService.sendMail({
                          from: process.env.SENDGRID_SENDER,
                          to: action.toEmail,
                          subject: action.title,
                          text: action.body,
                        });
                        Logger.log(
                          `Send email to ${action.toEmail} with info: ${info}`,
                        );
                      } catch (e) {
                        console.error(e);
                      }
                      break;
                    case 'TurnOff':
                      await this.prisma.device.update({
                        where: { id: action.deviceId },
                        data: { online: false },
                      });
                      break;
                    case 'TurnOn':
                      await this.prisma.device.update({
                        where: { id: action.deviceId },
                        data: { online: true },
                      });
                      break;
                  }
                });
              }
            }
          },
        );
      }
    });
  }

  async getAutomations({ locationId }: { locationId: string }) {
    return this.prisma.automations.findMany({
      where: { locationId },
      include: { device: true },
    });
  }

  async createAutomation(data: Prisma.AutomationsUncheckedCreateInput) {
    const automation = await this.prisma.automations.create({
      data,
      include: { device: true },
    });
    await this.handleAutomation(automation);

    return automation;
  }

  async activeAutomation(id: string) {
    const automation = await this.prisma.automations.findFirst({
      where: { id },
    });

    await Promise.all(
      automation.actions.map(async (action) => {
        switch (action.type) {
          case 'SendEmail':
            // Gửi email
            try {
              const info = await this.mailService.sendMail({
                from: process.env.SENDGRID_SENDER,
                to: action.toEmail,
                subject: action.title,
                text: action.body,
              });
              Logger.log(`Send email to ${action.toEmail} with info: ${info}`);
            } catch (e) {
              console.error(e);
            }
            break;
          case 'TurnOff':
            await this.prisma.device.update({
              where: { id: action.deviceId },
              data: { online: false },
            });
            break;
          case 'TurnOn':
            await this.prisma.device.update({
              where: { id: action.deviceId },
              data: { online: true },
            });
            break;
        }
      }),
    );
  }

  async updateAutomation(id: string, data: Prisma.AutomationsUncheckedUpdateInput) {
    const automation = await this.prisma.automations.update({
      where: { id },
      data,
      include: { device: true },
    });
    this.schedulerService.removeCronJob(`automation-${id}`);
    this.mqttService.removeCallback(automation.device.gatewayId, id);
    await this.handleAutomation(automation);
  }

  async handleAutomation(automation: Awaited<ReturnType<typeof this.createAutomation>>) {
    if (automation.condition.type === 'Schedule') {
      this.schedulerService.addCronJob(
        `automation-${automation.id}`,
        automation.condition.cronCondition,
        async () => {
          console.log('Run automation');
          automation.actions.forEach(async (action) => {
            switch (action.type) {
              case 'TurnOff':
                await this.prisma.device.update({
                  where: { id: automation.deviceId },
                  data: { online: false },
                });
                break;
              case 'TurnOn':
                console.log('Turn on');
                await this.prisma.device.update({
                  where: { id: automation.deviceId },
                  data: { online: true },
                });
                break;
            }
          });
        },
      );
    } else if (automation.condition.type === 'DeviceState') {
      this.mqttService.addCallback<SensorData>(
        automation.device.gatewayId,
        automation.id,
        async (topic, message) => {
          if (
            topic !== automation.device.topic ||
            message.type !== automation.condition.deviceStateCondition?.dataType
          )
            return;
          else {
            if (
              evaluateCondition(
                message.data,
                automation.condition.deviceStateCondition?.type,
                automation.condition.deviceStateCondition?.value,
              )
            ) {
              automation.actions.forEach(async (action) => {
                switch (action.type) {
                  case 'SendEmail':
                    // Gửi email
                    try {
                      const info = await this.mailService.sendMail({
                        from: process.env.SENDGRID_SENDER,
                        to: action.toEmail,
                        subject: action.title,
                        text: action.body,
                      });
                      Logger.log(
                        `Send email to ${action.toEmail} with info: ${info}`,
                      );
                    } catch (e) {
                      console.error(e);
                    }
                    break;
                  case 'TurnOff':
                    await this.prisma.device.update({
                      where: { id: action.deviceId },
                      data: { online: false },
                    });
                    break;
                  case 'TurnOn':
                    await this.prisma.device.update({
                      where: { id: action.deviceId },
                      data: { online: true },
                    });
                    break;
                }
              });
            }
          }
        },
      );
    }
  }

  async deleteAutomation(id: string) {
    const automation = await this.prisma.automations.delete({
      where: { id },
      include: { device: true },
    });
    this.schedulerService.removeCronJob(`automation-${id}`);
    this.mqttService.removeCallback(automation.device.gatewayId, id);
    return automation;
  }
}
