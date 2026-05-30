import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrdersDto } from './dto/update-orders.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    const { userId, items } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan');

    if (!items || items.length === 0) {
      throw new BadRequestException('Minimal 1 item harus diorder');
    }

    return this.prisma.$transaction(async (tx) => {
      const foodIds = items.map((i) => i.foodId);

      const foods = await tx.food.findMany({
        where: { id: { in: foodIds } },
      });

      const foodMap = new Map(foods.map((f) => [f.id, f]));

      const missing = items.filter((i) => !foodMap.get(i.foodId));
      if (missing.length > 0) {
        throw new NotFoundException('Food tidak ditemukan');
      }

      const total = items.reduce((sum, item) => {
        const food = foodMap.get(item.foodId)!;
        return sum + food.price * item.qty;
      }, 0);

      const order = await tx.order.create({
        data: {
          userId,
          total,
        },
      });

      await tx.orderDetail.createMany({
        data: items.map((item) => {
          const food = foodMap.get(item.foodId)!;

          return {
            orderId: order.id,
            foodId: item.foodId,
            qty: item.qty,
            price: food.price,
          };
        }),
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          details: {
            include: {
              food: true,
            },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        details: {
          include: {
            food: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        details: {
          include: { food: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Order tidak ditemukan');

    return order;
  }

  async update(id: number, dto: UpdateOrdersDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) throw new NotFoundException('Order tidak ditemukan');

    return this.prisma.order.update({
      where: { id },
      data: {
        total: dto.total,
      },
    });
  }

  async remove(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) throw new NotFoundException('Order tidak ditemukan');

    await this.prisma.orderDetail.deleteMany({
      where: { orderId: id },
    });

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
