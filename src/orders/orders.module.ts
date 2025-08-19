import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UpdateOrderProvider } from './providers/update-order.provider';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [OrdersController],
  providers: [OrdersService, UpdateOrderProvider],
})
export class OrdersModule { }
