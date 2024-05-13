import { Module, OnModuleInit } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Category } from '../entities/categories.entity';
import { Order } from '../entities/order.entity';
import { OrderDetails } from 'src/entities/orderDetails.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Category, Order, OrderDetails]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule implements OnModuleInit {
    constructor(private productsService: ProductsService) {}
    async onModuleInit() {
        await this.productsService.createProduct();
    }
}
