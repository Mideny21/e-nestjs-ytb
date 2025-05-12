import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { ShippingAdressModule } from './shipping-adress/shipping-adress.module';
import { TaskModule } from './task/task.module';

import appConfig from './config/app_config';
import { PaginationModule } from './common/pagination/pagination.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    MediaModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    OrdersModule,
    ShippingAdressModule,
    TaskModule,
    PaginationModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
