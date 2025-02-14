import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsInt()
  @IsNotEmpty()
  id: number;
}
