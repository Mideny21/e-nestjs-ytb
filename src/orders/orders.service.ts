import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from '@prisma/client';
import { UpdateOrderProvider } from './providers/update-order.provider';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly updateorder: UpdateOrderProvider,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = await this.prisma.$transaction(async (tx) => {
      //initialize an array to store order items with sufficient stock
      const validOrderItems = [];

      //looping through each order item in the createOrderDto
      for (const orderItem of createOrderDto.orderItems) {
        //find the product by ID
        const product = await tx.product.findUnique({
          where: { id: orderItem.productId },
        });

        //checking if product exist and if quantity is available
        if (product && parseInt(product.stock) >= orderItem.quantity) {
          await tx.product.update({
            where: { id: orderItem.productId },
            data: {
              stock: (
                parseInt(product.stock, 10) - orderItem.quantity
              ).toString(),
            },
          });

          // Add this order item to validOrderItems array
          validOrderItems.push(orderItem);
        } else {
          throw new HttpException(
            `Product ${orderItem.name} is out of stock`,
            HttpStatus.NOT_ACCEPTABLE,
          );
          // throw new Error(`Product ${orderItem.name} is out of stock`);
        }
      }

      const createdOrder = await tx.order.create({
        data: {
          userId: createOrderDto.userId,
          status: createOrderDto.status,
          totalPrice: createOrderDto.totalPrice,
          orderItems: {
            create: validOrderItems,
          },
        },
      });
      return createdOrder;
    });

    return order;
  }

  async findAll(id: number): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId: id },
      include: {
        orderItems: true,
      },
    });

    if (!orders) {
      throw new HttpException('something went wrong', HttpStatus.NOT_FOUND);
    }
    return orders;
  }

  public async updateOrder(updateOrderDto: UpdateOrderDto) {
    return await this.updateorder.updateOrder(updateOrderDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
