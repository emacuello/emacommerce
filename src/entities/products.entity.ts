import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './categories.entity';
import { OrderDetails } from './orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
    name: 'products',
})
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: 'Xbox', description: 'Nombre del producto' })
    @Column({ nullable: false, length: 50, unique: true })
    name: string;

    @ApiProperty({
        example: 'Consola de Microsoft',
        description: 'Descripción del producto',
    })
    @Column({ type: 'text', nullable: false })
    description: string;

    @ApiProperty({ example: '199.99', description: 'Precio del producto' })
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;
    @Column({ nullable: false })
    @ApiProperty({ example: '12', description: 'stock del producto' })
    stock: number;

    @ApiProperty({
        example: 'https://cdn-icons-png.flaticon.com/512/1822/1822045.png',
        description: 'url de la imagen del producto',
    })
    @Column({
        default: 'https://cdn-icons-png.flaticon.com/512/1822/1822045.png',
    })
    imgUrl: string;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
    @JoinTable()
    orderDetails: OrderDetails[];
}
