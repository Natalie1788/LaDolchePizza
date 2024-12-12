import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { UserDocument } from '../entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: keyof UserDocument | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Данные пользователя из JwtAuthGuard

    console.log('Request user:', user); // Логируем содержимое `user`

    if (!user) {
      throw new UnauthorizedException('User not authenticated'); // Если `user` отсутствует
    }

    return data ? user[data] : user;
  },
);
