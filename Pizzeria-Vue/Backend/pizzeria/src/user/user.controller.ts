import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from './decorators/user.decorator';
//import { User } from './entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*@UseGuards(JwtAuthGuard) // Проверка аутентификации
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = req.user['id']; // Извлечение userId из токена
    return this.userService.getCurrentUser(userId);
  }*/
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.getUserById(id);
  }
  @Get()
  findAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  findOneUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  @Auth()
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Auth()
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
