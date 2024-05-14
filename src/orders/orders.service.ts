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
        const productsWhitOutStock = {};
        const date = new Date().toLocaleString();
        const order = this.orderRepository.create({ date: date });
        const user = await this.userRepository.findOneBy({
            id: productCart.userId,
        });
        let total = 0;
        if (!user) throw new NotFoundException('Usuario no encontrado');
        if (Object.keys(productCart.products).length === 0)
            throw new BadRequestException('No hay productos en el carrito');
        const products = await Promise.all(
            productCart.products.map(async (product) => {
                const product_ = await this.productRepository.findOneBy({
                    id: product.id,
                });
                if (product_.stock > 0) {
                    total += Number(product_.price);
                    await this.productRepository
                        .createQueryBuilder()
                        .update()
                        .set({ stock: product_.stock - 1 })
                        .where('id = :id', { id: product_.id })
                        .execute();

                    return product_;
                } else {
                    productsWhitOutStock[product_.name] =
                        `El producto ${product_.name} con el id ${product_.id} no tiene stock`;
                    return null;
                }
            }),
        );
        const orderDetails = this.orderDetailstRepository.create({
            price: Number(total.toFixed(2)),
        });
        if (products.includes(null) && products.length === 1)
            throw new BadRequestException(
                'El producto no tiene stock disponible',
            );
        order.user = user;
        order.orderDetails = orderDetails;
        orderDetails.products = products;
        await this.orderDetailstRepository.save(orderDetails);
        const newOrder = await this.orderRepository.save(order);
        const {} = newOrder;
        if (!newOrder)
            throw new BadRequestException(
                'Algo salio mal, la orden no fue creada',
            );
        const {
            user: user_,
            date: date_,
            id,
            orderDetails: orderDetails_,
        } = newOrder;
        const { password, role, ...rest } = user_;
        const newOrder_ = {
            user: rest,
            date: date_,
            id,
            orderDetails: orderDetails_,
        };

        if (Object.keys(productsWhitOutStock).length === 0) {
            return {
                message: 'Orden creada con exito',
                productStatus: 'Todos los porductos tienen stock disponible',
                newOrder_,
            };
        } else {
            return {
                message: 'Orden creada con exito',
                productsStatus: productsWhitOutStock,
                newOrder_,
            };
        }
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
