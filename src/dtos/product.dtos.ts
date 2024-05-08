import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductsDtos {
    @ApiProperty({ example: 'Ps5', description: 'Nombre del producto' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'The best console in the world',
        description: 'Descripción del producto',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 199.99, description: 'Precio del producto' })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ example: 12, description: 'stock del producto' })
    @IsNotEmpty()
    @IsNumber()
    stock: number;

    @ApiProperty({ example: 'consoles', description: 'Categoría del producto' })
    @IsString()
    @IsNotEmpty()
    category: string;
}

export class PutProductDto extends PartialType(ProductsDtos) {}
