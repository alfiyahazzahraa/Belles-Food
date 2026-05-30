import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateOrderDetailDto {
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @IsInt()
  @IsNotEmpty()
  foodId: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  qty: number;
}