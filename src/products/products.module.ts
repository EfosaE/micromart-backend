import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports:[LoggerModule, AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
