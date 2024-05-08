import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDtos } from '../dtos/order.dtos';
import { Order } from '../entities/order.entity';
import { OrderDetails } from '../entities/orderDetails.entity';
import { Product } from '../entities/products.entity';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private orderRepository: Repository<Order>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(OrderDetails)
        private orderDetailstRepository: Repository<OrderDetails>,
    ) {}

    async addOrder(productCart: OrderDtos) {
        const date = new Date().toLocaleString();
        const order = this.orderRepository.create({ date: date });
        const user = await this.userRepository.findOneBy({
            id: productCart.userId,
        });
        let total = 0;
        if (!user) throw new NotFoundException('Usuario no encontrado');
        if (productCart.products.length === 0)
            throw new BadRequestException('No hay productos en el carrito');
        const products = await Promise.all(
            productCart.products.map(async (product) => {
                const product_ = await this.productRepository.findOneBy({
                    id: product.id,
                });
                console.log(product_, 'log 1');

                if (product_.stock !== 0) {
                    total += Number(product_.price);
                    await this.productRepository.update(product_.id, {
                        stock: product_.stock - 1,
                    });
                }
                return product_;
            }),
        );
        const orderDetails = this.orderDetailstRepository.create({
            price: Number(total.toFixed(2)),
        });
        order.user = user;
        order.orderDetails = orderDetails;
        orderDetails.products = products;
        await this.orderDetailstRepository.save(orderDetails);
        const newOrder = await this.orderRepository.save(order);
        if (!newOrder)
            throw new BadRequestException(
                'Algo salio mal, la orden no fue creada',
            );

        return newOrder;
    }

    async getOrders(id: string) {
        const order = await this.orderRepository.find({
            where: { id },
            relations: {
                orderDetails: { products: true },
            },
        });
        if (!order.length)
            throw new NotFoundException(`Orden con el id ${id} no existe`);
        return order;
    }
    async getAllOrder() {
        const order = await this.orderRepository.find({
            relations: {
                orderDetails: { products: true },
            },
        });
        if (!order) throw new NotFoundException('No existen ordenes creadas');
        return order;
    }
}
