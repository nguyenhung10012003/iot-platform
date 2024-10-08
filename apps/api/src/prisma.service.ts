import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from 'utils/hashing';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    await this.createAdmin();
  }
  onModuleDestroy() {
    this.$disconnect();
  }

  private async createAdmin() {
    const username = process.env.ADMIN_USERNAME;
    const password = await hashPassword(process.env.ADMIN_PASSWORD);
    if (!username || !password) {
      throw new Error('Can not find admin username or password in env file');
    }
    return this.user.upsert({
      where: { username },
      update: {
        password,
      },
      create: {
        username,
        password,
        role: 'ADMIN',
      },
    });
  }
}
