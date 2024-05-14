import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../entities/products.entity';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDtos {
    @ApiProperty({
        example: '4d2936ae-4c37-420d-829a-c0f81d043119',
        description: 'Id del usuario',
    })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        example: [
            { id: '4d2936ae-4c37-420d-829a-c0f81d043119' },
            { id: 'de217ef1-8116-4cb2-89d3-782f0def4e65' },
        ],
        description: 'Listado de productos',
    })
    @IsArray()
    @ArrayMinSize(1)
    @Type(() => Product)
    products: Partial<Product[]>;
}
