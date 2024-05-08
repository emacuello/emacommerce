import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
    name: 'users',
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @ApiProperty({ example: 'Pepito', description: 'Nombre del usuario' })
    @Column({ length: 50, nullable: false })
    name: string;

    @ApiProperty({
        example: 'pPn5d@example.com',
        description: 'Email del usuario',
    })
    @Column({ unique: true, length: 50, nullable: false })
    email: string;
    @ApiProperty({
        example: '123qweASD.?',
        description: 'Contraseña del usuario',
    })
    @Column({ nullable: false })
    password: string;

    // controlar el int, probar con bigint
    @ApiProperty({ example: '123456789', description: 'Teléfono del usuario' })
    @Column({ type: 'int' })
    phone: number;
    @ApiProperty({ example: 'Colombia', description: 'País del usuario' })
    @Column({ length: 50 })
    country: string;
    @ApiProperty({
        example: 'Calle falsa 123',
        description: 'Dirección del usuario',
    })
    @Column({ type: 'text' })
    address: string;
    @ApiProperty({ example: 'Bogota', description: 'Ciudad del usuario' })
    @Column({ length: 50 })
    city: string;
    @ApiProperty({ example: 'user', description: 'Rol del usuario' })
    @Column({ default: 'user' })
    role: string;

    @OneToMany(() => Order, (orders) => orders.user)
    orders: Order[];
}
