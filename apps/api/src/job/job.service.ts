import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateJobDto } from './types/create-job.dto';
import { UpdateJobDto } from './types/update-job.dto';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(data: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        ...data,
      },
    });
  }

  async getJobs(data: { locationId?: string; asigneeId?: string }) {
    return this.prisma.job.findMany({
      where: {
        ...data,
      },
      include: {
        asignee: true,
      }
    });
  }

  async updateJob(id: string, data: UpdateJobDto) {
    return this.prisma.job.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async deleteJob(id: string) {
    return this.prisma.job.delete({
      where: {
        id,
      },
    });
  }
}
