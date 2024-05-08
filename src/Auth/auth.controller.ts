import {
    Body,
    Controller,
    Get,
    Post,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../dtos/loginUser.dtos';
import { UserDtos } from '../dtos/user.dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    async signIn(@Body() credentials: LoginDto) {
        return await this.authService.signIn(credentials);
    }

    @Post('signup')
    async signUp(@Body() user: UserDtos) {
        return await this.authService.signUp(user);
    }
}
