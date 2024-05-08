import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const hasRole = () => roles.some((role) => user?.role?.includes(role));
        const authorization = user && user.role && hasRole();
        if (!authorization) {
            throw new UnauthorizedException(
                'No estas autorizado para acceder a esta ruta, comprueba tus privilegios',
            );
        }
        return authorization;
    }
}
