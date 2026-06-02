import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoodsModule } from './foods/foods.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    PrismaModule,
    AuthModule,
    FoodsModule,
    CategoriesModule,
    UsersModule,
    OrdersModule,
    OrderDetailModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}