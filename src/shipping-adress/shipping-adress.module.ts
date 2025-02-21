import { Module } from '@nestjs/common';
import { ShippingAdressService } from './shipping-adress.service';
import { ShippingAdressController } from './shipping-adress.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShippingAdressController],
  providers: [ShippingAdressService],
})
export class ShippingAdressModule {}
