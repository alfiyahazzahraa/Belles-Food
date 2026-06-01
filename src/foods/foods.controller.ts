import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';    

@UseGuards(AuthGuard('jwt'), RolesGuard) 
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Roles('ADMIN') 
  @Post()
  create(@Body() dto: CreateFoodDto) { return this.foodsService.create(dto); }

  @Get() 
  findAll() { return this.foodsService.findAll(); }

  @Get(':id') 
  findOne(@Param('id', ParseIntPipe) id: number) { return this.foodsService.findOne(id); }

  @Roles('ADMIN') 
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFoodDto) { return this.foodsService.update(id, dto); }

  @Roles('ADMIN') 
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.foodsService.remove(id); }
}