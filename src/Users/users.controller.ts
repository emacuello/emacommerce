import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { PutUserDtos, UserDtos } from '../dtos/user.dtos';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiBearerAuth()
    @Get()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async findAll(@Query('page') page: string, @Query('limit') limit: string) {
        if (!page || !limit) {
            return await this.usersService.findAll(1, 5);
        }
        return await this.usersService.findAll(Number(page), Number(limit));
    }

    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return await this.usersService.findOne(id);
    }

    @ApiBearerAuth()
    @Put(':id')
    @UseGuards(AuthGuard)
    async updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() user: PutUserDtos,
    ) {
        return await this.usersService.updateUser(id, user);
    }

    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return await this.usersService.deleteUser(id);
    }
}
