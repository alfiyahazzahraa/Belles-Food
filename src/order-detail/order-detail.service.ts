import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';

@Injectable()
export class OrderDetailService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDetailDto) {
    const { orderId, foodId, qty } = dto;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan');

    const food = await this.prisma.food.findUnique({
      where: { id: foodId },
    });
    if (!food) throw new NotFoundException('Makanan tidak ditemukan');

    const subTotal = food.price * qty;

    return this.prisma.$transaction(async (tx) => {
      const detail = await tx.orderDetail.create({
        data: {
          orderId,
          foodId,
          qty,
          price: food.price,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          total: {
            increment: subTotal,
          },
        },
      });

      return detail;
    });
  }

  async findAll() {
    return this.prisma.orderDetail.findMany({
      include: { food: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const detail = await this.prisma.orderDetail.findUnique({
      where: { id },
      include: { food: true },
    });
    if (!detail) throw new NotFoundException('Order Detail tidak ditemukan');
    return detail;
  }

  async update(id: number, dto: UpdateOrderDetailDto) {
    const currentDetail = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      let priceToUse = currentDetail.price;
      let qtyToUse = currentDetail.qty;

      if (dto.foodId && dto.foodId !== currentDetail.foodId) {
        const food = await tx.food.findUnique({ where: { id: dto.foodId } });
        if (!food) throw new NotFoundException('Makanan baru tidak ditemukan');
        priceToUse = food.price;
      }

      if (dto.qty !== undefined) {
        qtyToUse = dto.qty;
      }

      const oldSubTotal = currentDetail.price * currentDetail.qty;
      const newSubTotal = priceToUse * qtyToUse;
      const priceDifference = newSubTotal - oldSubTotal;

      const updatedDetail = await tx.orderDetail.update({
        where: { id },
        data: {
          foodId: dto.foodId,
          qty: dto.qty,
          price: priceToUse,
        },
      });

      await tx.order.update({
        where: { id: currentDetail.orderId },
        data: {
          total: {
            increment: priceDifference,
          },
        },
      });

      return updatedDetail;
    });
  }

  async remove(id: number) {
    const currentDetail = await this.findOne(id);
    const subTotalToDecrement = currentDetail.price * currentDetail.qty;

    return this.prisma.$transaction(async (tx) => {
      await tx.orderDetail.delete({
        where: { id },
      });

      await tx.order.update({
        where: { id: currentDetail.orderId },
        data: {
          total: {
            decrement: subTotalToDecrement,
          },
        },
      });

      return { message: `Order Detail dengan id ${id} berhasil dihapus` };
    });
  }
}