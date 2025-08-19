import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ORDER_STATUS } from '@prisma/client';
import { OrderItemDto } from './order-item-dto';

export class CreateOrderDto {
  @IsInt()
  @IsOptional()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  shippingAdressId: number;

  @IsEnum(ORDER_STATUS)
  @IsNotEmpty()
  status: ORDER_STATUS;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];


  @IsString()
  @IsNotEmpty()
  deviceToken: string;
}
