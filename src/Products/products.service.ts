import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { ProductsDtos, PutProductDto } from '../dtos/product.dtos';
import { Category } from '../entities/categories.entity';
import { products } from '../helpers/data.seed';
import { Order } from '../entities/order.entity';
import { OrderDetails } from 'src/entities/orderDetails.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderDetails)
        private orderDetailsRepository: Repository<OrderDetails>,
    ) {}
    async findProducts(page: number, limit: number) {
        const products = (
            await this.productRepository.find({ relations: ['category'] })
        ).slice((page - 1) * limit, page * limit);
        if (!products.length)
            throw new NotFoundException(
                'No se encuentran productos registrados en la base de datos',
            );

        return products;
    }

    async getOneProduct(id: string) {
        const duplicate = await this.productRepository.findOneBy({
            id,
        });
        if (!duplicate)
            throw new NotFoundException(
                `El producto con el id ${id} no existe`,
            );
        const product = await this.productRepository.findOne({
            where: { id: id },
        });
        if (!product.id)
            throw new NotFoundException(
                `Producto con el id ${id} no encontrado`,
            );
        return product;
    }

    async createProduct() {
        return Promise.allSettled(
            products.map(async (product) => {
                const { category, ...rest } = product;
                const duplicate = await this.productRepository.findOneBy({
                    name: rest.name,
                });
                if (!duplicate) {
                    const findCategory =
                        await this.categoryRepository.findOneBy({
                            name: category,
                        });
                    if (findCategory) {
                        await this.productRepository.save({
                            ...rest,
                            category: findCategory,
                        });
                    } else {
                        await this.categoryRepository
                            .createQueryBuilder()
                            .insert()
                            .into(Category)
                            .values({ name: category })
                            .orIgnore()
                            .execute();
                        const newCategory = await this.categoryRepository
                            .createQueryBuilder()
                            .setFindOptions({ where: { name: category } })
                            .getOne();
                        await this.productRepository
                            .createQueryBuilder()
                            .insert()
                            .into(Product)
                            .values({ ...rest, category: newCategory })
                            .orIgnore()
                            .execute();
                    }
                }
            }),
        ).then((values) => {
            if (values.some((value) => value.status === 'rejected'))
                throw new BadRequestException(
                    'Error al crear los productos, verificar en la base datos cuales fueron creadas y cuales no con sus respectivas categorias!! es recomendable tener las categorias en la base de datos previamente antes de ejecutar esta funcion!!!',
                );
            return 'Productos creados correctamente';
        });
    }
    async restartProducts() {
        const productsErrors = {};
        return Promise.allSettled(
            products.map(async (product) => {
                const products = await this.productRepository.findOneBy({
                    name: product.name,
                });
                if (products) {
                    const findOrder = await this.orderDetailsRepository.find({
                        relations: ['products'],
                    });
                    if (!findOrder) {
                        await this.productRepository.update(
                            { id: products.id },
                            { stock: products.stock },
                        );
                    }
                    findOrder.forEach(async (order) => {
                        if (!order.products.some((p) => p.id === products.id)) {
                            await this.productRepository.update(
                                { id: products.id },
                                { stock: products.stock },
                            );
                        } else
                            productsErrors[products.name] =
                                `El producto ${products.name} con el id ${products.id} no fue actualizado porque se encuentra en el pedido con el id ${order.id}`;
                    });
                }
            }),
        ).then((values) => {
            if (values.some((value) => value.status === 'rejected'))
                throw new BadRequestException(
                    'Algunos pedidos no fueron resetados correctamente',
                );
            if (Object.keys(productsErrors).length > 0)
                throw new BadRequestException({
                    message:
                        'Error al actualizar los productos, Los productos con ordenes activas no se pueden actualizar',
                    productsAffected: productsErrors,
                });
            return 'Productos reseteados correctamente';
        });
    }
    async postProduct(product: ProductsDtos) {
        const { category, ...rest } = product;
        const duplicate = await this.productRepository.findOneBy({
            name: rest.name,
        });
        const find = await this.categoryRepository.findOneBy({
            name: category,
        });
        if (duplicate)
            throw new BadRequestException(
                `El producto ${product.name} ya existe en la base de datos`,
            );
        else {
            if (!find) {
                const newCategory = this.categoryRepository.create({
                    name: category,
                });
                this.categoryRepository.save(newCategory);
                const newProduct = this.productRepository.create({ ...rest });
                newProduct.category = newCategory;
                await this.productRepository.save(newProduct);

                return newProduct;
            }
            const newProduct = this.productRepository.create({ ...rest });
            newProduct.category = find;
            await this.productRepository.save(newProduct);

            if (!newProduct)
                throw new BadRequestException(
                    `Error al crear el producto: ${newProduct}`,
                );
            return newProduct;
        }
    }

    async updateProduct(id: string, product: PutProductDto) {
        const duplicate = await this.productRepository.findOneBy({
            id,
        });
        if (!duplicate)
            throw new NotFoundException(
                `El producto con el id ${id} no existe en la base de datos`,
            );
        const { category, ...data } = product;
        const productUpdated = await this.productRepository.update(
            { id },
            { ...data },
        );
        if (productUpdated.affected === 0)
            throw new BadRequestException('No se pudo actualizar el producto');
        return { message: 'Producto actualizado con exito', productUpdated };
    }

    async deleteProduct(id: string) {
        const duplicate = await this.productRepository.findOneBy({
            id,
        });
        if (!duplicate)
            throw new NotFoundException(
                `El producto con el id ${id} no existe en la base de datos`,
            );
        const deleteProduct = await this.productRepository.delete({ id });
        if (deleteProduct.affected === 0)
            throw new BadRequestException('No se pudo borrar el producto');
        return { message: 'Producto eliminado con exito', deleteProduct };
    }

    async deleteAllProducts() {
        const findOrder = await this.orderRepository.find();
        console.log(findOrder);

        if (findOrder)
            throw new BadRequestException(
                'No se puede borrar los productos porque existen ordenes',
            );
        const deleteProdcts = await this.productRepository.delete({});
        if (deleteProdcts.affected === 0)
            throw new BadRequestException('No se pudo borrar los productos');
        return { message: 'Productos eliminados con exito', deleteProdcts };
    }
}
