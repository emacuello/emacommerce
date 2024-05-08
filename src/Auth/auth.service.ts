import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { LoginDto } from '../dtos/loginUser.dtos';
import { UsersService } from '../Users/users.service';
import { UserDtos } from '../dtos/user.dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signUp(user: UserDtos) {
        const findUser = await this.usersService.findByEmail(user.email);
        if (findUser)
            throw new BadRequestException(
                'El Email ya se encuentra registrado',
            );
        const hashedPassword = await bcrypt.hash(user.password, 10);
        if (!hashedPassword)
            throw new BadRequestException('Error al encriptar el password');
        const newUser = await this.usersService.createUser({
            ...user,
            password: hashedPassword,
        });
        return { message: 'Usuario creado con exito', ...newUser };
    }

    async signIn(credentials: LoginDto) {
        const { email, password } = credentials;
        const find = await this.usersService.findByEmail(email);
        if (!find)
            throw new NotFoundException('El email no se encuentra registrado');
        if (find.email !== email)
            throw new BadRequestException('Email o password incorrectos');
        const isMatch = await bcrypt.compare(password, find.password);
        if (!isMatch)
            throw new BadRequestException('Email o password incorrectos');
        const payload = {
            id: find.id,
            email: find.email,
            sub: find.id,
            role: [find.role],
        };
        const token = this.jwtService.sign(payload);
        return { message: 'Inicio de Sesion con exito', token };
    }
}
