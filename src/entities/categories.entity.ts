import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './products.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
    name: 'category',
})
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Electronics',
        description: 'Nombre de la categoria',
    })
    @Column({ length: 50, nullable: false, unique: true })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
