import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { OrderDetails } from './orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
    name: 'orders',
})
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: '2022-01-01', description: 'Fecha del pedido' })
    @Column()
    date: string;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToOne(() => OrderDetails)
    @JoinColumn()
    orderDetails: OrderDetails;
}
