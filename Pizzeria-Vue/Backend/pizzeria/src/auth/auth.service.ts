import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../user/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(dto: CreateAuthDto) {
    const { username, email, password } = dto;

    // Проверяем, существует ли пользователь
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
      role: 'user', // Роль по умолчанию
    });

    await user.save();

    return { message: 'User registered successfully' };
  }

  async login(dto: { email: string; password: string }) {
    const { email, password } = dto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async createAdmin(dto: {
    username: string;
    email: string;
    password: string;
  }) {
    const { username, email, password } = dto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new this.userModel({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();

    return { message: 'Admin user created successfully' };
  }
}
