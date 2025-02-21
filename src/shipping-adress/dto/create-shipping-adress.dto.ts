import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingAdressDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @IsInt()
  @IsOptional()
  userId: number;
}
