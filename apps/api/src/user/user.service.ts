import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { hashPassword } from 'utils/hashing';
import { CreateUserDto } from '../auth/dto/CreateUserDto';
import { Prisma } from '@prisma/client';

type FindOneOptions = {
  throwIfNotFound?: boolean;
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        username: data.username,
        password: await hashPassword(data.password),
        role: data.role || 'USER',
      },
    });
  }

  async search(query: string) {
    return this.prisma.user.findMany({
      where: {
        username: {
          contains: query,
        },
      },
    });
  }

  async findOne(username: string, options?: FindOneOptions) {
    if (options?.throwIfNotFound) {
      return this.prisma.user.findUniqueOrThrow({
        where: {
          username,
        },
      });
    } else {
      return this.prisma.user.findUnique({
        where: { username },
      });
    }
  }

  async findById(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  async find(args: Prisma.UserFindManyArgs) {
    return this.prisma.user.findMany();
  }
}
