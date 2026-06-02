import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { GetFoodDto } from './dto/get-food.dto';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFoodDto) {
    const data: any = {
      name: dto.name,
      price: dto.price,
      description: dto.description,
      categoryId: dto.categoryId,
    };
    
    if (dto.imageUrl && dto.imageUrl.trim() !== '') {
      data.imageUrl = dto.imageUrl;
    }

    return this.prisma.food.create({
      data,
      include: { category: true },
    });
  }

  async findAll(filter: GetFoodDto ) {
    const where: any = {};
    
    if (filter.categoryId) {
      where.categoryId = filter.categoryId;
    }
    
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) {
        where.price.gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        where.price.lte = filter.maxPrice;
      }
    }
    
    if (filter.search && filter.search.trim() !== '') {
      where.OR = [
        { name: { contains: filter.search } },
        { description: { contains: filter.search } },
      ];
    }
    
    return this.prisma.food.findMany({
      where,
      include: { category: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const food = await this.prisma.food.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!food) {
      throw new NotFoundException('Food not found');
    }

    return food;
  }

  async update(id: number, dto: UpdateFoodDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (dto.imageUrl !== undefined && dto.imageUrl.trim() !== '') {
      data.imageUrl = dto.imageUrl;
    }

    return this.prisma.food.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.food.delete({ where: { id } });
    return { message: `Food with id ${id} deleted` };
  }
}