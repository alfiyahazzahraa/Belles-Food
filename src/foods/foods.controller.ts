import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe,Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { GetFoodDto } from './dto/get-food.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Foods')
@ApiBearerAuth()
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'Filter berdasarkan kategori',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Harga minimum',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Harga maksimum',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Cari nama atau deskripsi makanan',
  })
  @Get()
  async findAll(@Query() filter: GetFoodDto) {
    return this.foodsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateFoodDto) {
    return this.foodsService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFoodDto,
  ) {
    return this.foodsService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.foodsService.remove(id);
  }
}