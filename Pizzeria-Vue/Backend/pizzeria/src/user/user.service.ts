import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getAllUsers() {
    try {
      return await this.userModel.find().populate('orders').exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching all users: ${error.message}`,
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userModel.findById(id).populate('orders').exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching user by ID: ${error.message}`,
      );
    }
  }

  async updateUser(id: string, updateDto: Partial<User>) {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateDto, { new: true })
        .populate('orders')
        .exec();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating user: ${error.message}`,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return deletedUser;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error deleting user: ${error.message}`,
      );
    }
  }

  // Метод для получения текущего пользователя
  async getCurrentUser(id: string) {
    try {
      const user = await this.userModel.findById(id).populate('orders').exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error fetching current user: ${error.message}`,
      );
    }
  }
}
