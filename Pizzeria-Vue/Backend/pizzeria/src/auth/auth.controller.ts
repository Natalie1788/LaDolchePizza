import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CustomValidationPipe } from './pipes/customPipe';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new CustomValidationPipe())
    createAuthDto: CreateAuthDto,
  ) {
    return this.authService.registerUser(createAuthDto);
  }

  @Post('login')
  async login(@Body() dto: CreateAuthDto) {
    return this.authService.login(dto);
  }

  @Post('create-admin')
  async createAdmin(@Body() dto: CreateAuthDto) {
    return this.authService.createAdmin(dto);
  }
}
