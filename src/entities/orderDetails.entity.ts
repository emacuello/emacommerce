import {
    Column,
    Entity,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
    name: 'order_details',
})
export class OrderDetails {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 20.5, description: 'Precio del producto' })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @ManyToMany(() => Product, (product) => product.orderDetails)
    products: Product[];
}
