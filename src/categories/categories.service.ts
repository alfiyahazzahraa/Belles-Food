import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }
  
  async findAll() {
  const data = await this.prisma.category.findMany({
    include: {
      foods: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
  console.log('=== CATEGORY DATA ===');
  console.log(JSON.stringify(data, null, 2));
  return data;
}

  async findOne(id: number) {
    const category =
      await this.prisma.category.findUnique({
        where: { id },
        include: {
          foods: true,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return category;
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
  ) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: `Category with id ${id} deleted`,
    };
  }
}