import { Global, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Global()
@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
  onModuleInit() {
    this.$connect().then(() => {
      console.log('database connected');
    });
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
