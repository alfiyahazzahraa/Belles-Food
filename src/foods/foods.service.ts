import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';

@Injectable()
export class FoodsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateFoodDto) {
    return this.prisma.food.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.food.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const food = await this.prisma.food.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!food) {
      throw new NotFoundException(
        'Food not found',
      );
    }

    return food;
  }

  async update(
    id: number,
    dto: UpdateFoodDto,
  ) {
    await this.findOne(id);

    return this.prisma.food.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.food.delete({
      where: { id },
    });

    return {
      message: `Food with id ${id} deleted`,
    };
  }
}
