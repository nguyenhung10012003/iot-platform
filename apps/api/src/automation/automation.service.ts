import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SensorData } from 'src/device/types/sensor-data';
import { MqttService } from 'src/mqtt/mqtt.service';
import { PrismaService } from 'src/prisma.service';
import { SchedulerService } from 'src/scheduler/scheduler.service';
import { evaluateCondition } from 'utils/condition';

@Injectable()
export class AutomationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerService: SchedulerService,
    private readonly mqttService: MqttService,
  ) {}

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
      this.mqttService.onMessage<SensorData>(
        automation.device.gatewayId,
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
                    console.log('Send email');
                    break;
                }
              });
            }
          }
        },
      );
    }

    return automation;
  }

  async deleteAutomation(id: string) {
    const automation = await this.prisma.automations.delete({
      where: { id },
    });
    this.schedulerService.removeCronJob(`automation-${id}`);
    return automation;
  }
}
