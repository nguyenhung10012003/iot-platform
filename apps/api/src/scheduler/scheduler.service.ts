import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService {
  constructor(private scheduleRegistry: SchedulerRegistry) {}

  public async addCronJob(
    name: string,
    cron: string,
    callback: () => void | Promise<void>,
  ) {
    const job = new CronJob(cron, callback);
    this.scheduleRegistry.addCronJob(name, job);
    job.start();
    Logger.debug(`Cron job ${name} added`);
  }

  public async removeCronJob(name: string) {
    if (!this.scheduleRegistry.doesExist('cron', name)) {
      return;
    }
    this.scheduleRegistry.deleteCronJob(name);
  }
}
