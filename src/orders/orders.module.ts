import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrdersService } from './orders.service';
import { User } from '../entities/users.entity';
import { OrderDetails } from '../entities/orderDetails.entity';
import { Product } from '../entities/products.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, User, OrderDetails, Product])],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}
