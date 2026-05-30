import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateOrderDetailDto {
  @IsInt()
  @IsOptional()
  orderId?: number;

  @IsInt()
  @IsOptional()
  foodId?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  qty?: number;
}