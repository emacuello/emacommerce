import { PickType } from '@nestjs/swagger';
import { UserDtos } from './user.dtos';
export class LoginDto extends PickType(UserDtos, ['email', 'password']) {}
