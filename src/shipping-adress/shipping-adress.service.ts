import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShippingAdressDto } from './dto/create-shipping-adress.dto';
import { UpdateShippingAdressDto } from './dto/update-shipping-adress.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ShippingAddress } from '@prisma/client';

@Injectable()
export class ShippingAdressService {
  constructor(private prisma: PrismaService) {}
  async create(createShippingAdressDto: CreateShippingAdressDto) {
    const shippingAddress = await this.prisma.shippingAddress.create({
      data: createShippingAdressDto,
    });
    if (!shippingAddress) {
      throw new HttpException(
        `Something went wrong during creating ${createShippingAdressDto.city}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return shippingAddress;
  }

  async findAll(userId: number): Promise<ShippingAddress[]> {
    const alladresses = await this.prisma.shippingAddress.findMany({
      where: { userId },
    });

    if (!alladresses) {
      throw new HttpException('Something went wrong', HttpStatus.NOT_FOUND);
    }
    return alladresses;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingAdress`;
  }

  update(id: number, updateShippingAdressDto: UpdateShippingAdressDto) {
    return `This action updates a #${id} shippingAdress`;
  }

  remove(id: number) {
    return `This action removes a #${id} shippingAdress`;
  }
}
