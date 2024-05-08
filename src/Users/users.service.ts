import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { PutUserDtos, UserDtos } from '../dtos/user.dtos';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}
    async findAll(page: number, limit: number) {
        const users = (await this.usersRepository.find())
            .map((user) => {
                const users = { ...user };
                delete users.password;
                return users;
            })
            .slice((page - 1) * limit, page * limit);
        if (!users.length)
            throw new NotFoundException('No hay usuarios registrados');
        return users;
    }

    async findOne(id: string) {
        const user = await this.usersRepository.findOne({
            where: { id: id },
            relations: ['orders'],
        });
        if (user === null)
            throw new NotFoundException(
                `Usuario con el id ${id} no encontrado`,
            );
        const { password, role, ...result } = user;
        return result;
    }

    async createUser(user: UserDtos) {
        const findDuplicates = await this.usersRepository.findOneBy({
            email: user.email,
        });
        if (findDuplicates)
            throw new BadRequestException(
                `Ya existe un usuario con el email ${user.email}`,
            );
        this.usersRepository.create(user);
        const userCreated = await this.usersRepository.save(user);
        if (!userCreated.id)
            throw new BadRequestException(
                'Ocurrio algun problema, usuario no creado :(',
            );
        const { password, role, confirmPassword, ...result } = userCreated;
        return { message: 'Usuario creado con exito', ...result };
    }

    async updateUser(id: string, user: PutUserDtos) {
        const usersExist = await this.usersRepository.findOneBy({
            id,
        });
        if (!usersExist)
            throw new NotFoundException(`Usuario con el id ${id} no existe`);
        const updateUser = await this.usersRepository.update({ id: id }, user);
        if (updateUser.affected === 0)
            throw new BadRequestException(
                'Error inesperado!, no se pudo actualizar el usuario',
            );
        return { message: 'Usuario actualizado con exito', ...updateUser };
    }

    async deleteUser(id: string) {
        const usersExist = await this.usersRepository.findOne({
            where: { id: id },
            relations: ['orders'],
        });
        if (!usersExist)
            throw new NotFoundException(`Usuario con el id ${id} no existe`);
        console.log(usersExist);
        if (usersExist.orders)
            throw new BadRequestException(
                'No se puede borrar un usuario con ordenes de compra',
            );
        const deleteUser = await this.usersRepository.delete({ id: id });
        if (deleteUser.affected === 0)
            throw new BadRequestException('No se pudo borrar el usuario');
        return { message: 'Usuario eliminado con exito', deleteUser };
    }

    async findByEmail(email: string) {
        return await this.usersRepository.findOneBy({ email });
    }
}
