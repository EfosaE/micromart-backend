import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseModule } from 'src/database/database.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports:[DatabaseModule, LoggerModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
