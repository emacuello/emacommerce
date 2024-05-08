import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsStrongPassword,
    Length,
    Matches,
    Validate,
} from 'class-validator';
import { ComparePassword } from '../decorators/comparepassword.decorator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UserDtos {
    @ApiProperty({ example: 'Patch', description: 'Nombre del usuario' })
    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    name: string;

    @ApiProperty({
        example: 'patch2000@mail.com',
        description: 'Email del usuario',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '123qweASD.!@',
        description: 'Password del usuario',
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 15)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,_-])([A-Za-z\d$@$!%*?&.,_-]|[^ ]){8,15}$/,
    )
    @IsStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @ApiProperty({
        example: '123qweASD.!@',
        description: 'Confirmar password del usuario',
    })
    @IsNotEmpty()
    @Validate(ComparePassword, ['password'])
    confirmPassword: string;

    @ApiProperty({
        example: 'Calle falsa 123',
        description: 'Dirección del usuario',
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 80)
    address: string;

    @ApiProperty({ example: '123456789', description: 'Telefono del usuario' })
    @IsNumber()
    @IsNotEmpty()
    phone: number;

    @ApiProperty({ example: 'Argentina', description: 'Pais del usuario' })
    @IsString()
    @Length(5, 20)
    country: string;

    @ApiProperty({ example: 'Buenos Aires', description: 'Ciudad del usuario' })
    @IsString()
    @Length(5, 20)
    city: string;
}

export class PutUserDtos extends PartialType(UserDtos) {}
