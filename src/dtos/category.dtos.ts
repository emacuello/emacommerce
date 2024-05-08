import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoriesDtos {
    @ApiProperty({ example: 'consoles', description: 'Nombre de la categoria' })
    @IsString()
    @IsNotEmpty()
    name: string;
}
