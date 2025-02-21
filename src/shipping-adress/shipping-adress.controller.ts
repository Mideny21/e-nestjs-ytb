import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShippingAdressService } from './shipping-adress.service';
import { CreateShippingAdressDto } from './dto/create-shipping-adress.dto';
import { UpdateShippingAdressDto } from './dto/update-shipping-adress.dto';
import { JwtAuthGuard } from '../auth/jwt_guard';
import { ActiveUser } from '../auth/decorators/user.decorators';

@Controller('shipping-adress')
export class ShippingAdressController {
  constructor(private readonly shippingAdressService: ShippingAdressService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createShippingAdressDto: CreateShippingAdressDto,
    @ActiveUser('userId') user,
  ) {
    createShippingAdressDto.userId = user;
    return this.shippingAdressService.create(createShippingAdressDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@ActiveUser('userId') user) {
    return this.shippingAdressService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingAdressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShippingAdressDto: UpdateShippingAdressDto) {
    return this.shippingAdressService.update(+id, updateShippingAdressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingAdressService.remove(+id);
  }
}
