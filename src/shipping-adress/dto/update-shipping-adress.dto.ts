import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingAdressDto } from './create-shipping-adress.dto';

export class UpdateShippingAdressDto extends PartialType(CreateShippingAdressDto) {}
