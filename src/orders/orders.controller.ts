import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-orders.dto'; 
import { UpdateOrdersDto } from './dto/update-orders.dto'; 
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; 
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';     

@ApiTags('Orders')
@ApiBearerAuth() 
@UseGuards(AuthGuard('jwt'), RolesGuard) 
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post() 
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Roles('ADMIN') 
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Roles('ADMIN') 
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrdersDto,
  ) {
    return this.ordersService.update(id, dto);
  }

  @Roles('ADMIN') 
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}