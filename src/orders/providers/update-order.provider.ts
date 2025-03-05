import {
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class UpdateOrderProvider {
  constructor(private prisma: PrismaService) {}

  public async updateOrder(updateOrderDto: UpdateOrderDto) {
    let currentOrder = undefined;
    try {
      currentOrder = await this.prisma.order.findUnique({
        where: { id: updateOrderDto.id },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!currentOrder) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    switch (updateOrderDto.status) {
      case 'PROCESSING':
        try {
          await this.prisma.order.update({
            where: { id: currentOrder.id },
            data: { status: 'PROCESSING' },
          });
        } catch (e) {
          throw new RequestTimeoutException(
            'Unable to process your request at the moment please try later',
            {
              description: 'Error connecting to the database',
            },
          );
        }
        break;
      case 'PAID':
        try {
          await this.prisma.order.update({
            where: { id: currentOrder.id },
            data: { status: 'PAID' },
          });
        } catch (e) {
          throw new RequestTimeoutException(
            'Unable to process your request at the moment please try later',
            {
              description: 'Error connecting to the database',
            },
          );
        }
        break;
      case 'CANCELED':
        try {
          await this.prisma.$transaction(async (tx) => {
            // Retrieve the order items for the current order
            const orderItems = await tx.orderItem.findMany({
              where: { orderId: currentOrder.id },
              include: { product: true },
            });

            // Iterate through each order item and update the product stock
            for (const orderItem of orderItems) {
              await tx.product.update({
                where: { id: orderItem.productId },
                data: {
                  stock: (
                    parseInt(orderItem.product.stock, 10) + orderItem.quantity
                  ).toString(),
                },
              });
            }

            // Update the order status to CANCELED
            await tx.order.update({
              where: { id: currentOrder.id },
              data: { status: 'CANCELED' },
            });
          });
        } catch (e) {
          throw new RequestTimeoutException(
            'Unable to process your request at the moment please try later',
            {
              description: 'Error connecting to the database',
            },
          );
        }
        break;
      case 'DELIVERED':
        try {
          await this.prisma.order.update({
            where: { id: currentOrder.id },
            data: { status: 'DELIVERED' },
          });
        } catch (e) {
          throw new RequestTimeoutException(
            'Unable to process your request at the moment please try later',
            {
              description: 'Error connecting to the database',
            },
          );
        }
        break;
    }
  }
}
