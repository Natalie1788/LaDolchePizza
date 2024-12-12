import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Пользователь, установленный в JwtAuthGuard

    if (user?.role !== 'admin') {
      throw new ForbiddenException('Access denied: Admins only');
    }

    return true;
  }
}
