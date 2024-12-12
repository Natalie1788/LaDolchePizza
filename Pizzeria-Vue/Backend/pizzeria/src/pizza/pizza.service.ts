import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { Model } from 'mongoose';
import { Pizza } from './entities/pizza.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PizzaService {
  constructor(
    @InjectModel('Pizza') private readonly pizzaModel: Model<Pizza>,
    //private readonly commentModel: Model<Comment>,
  ) {}
  async createPizza(dto: CreatePizzaDto) {
    try {
      const pizza = new this.pizzaModel(dto);
      return await pizza.save();
    } catch (error) {
      throw new Error('Failed to create pizza');
    }
  }

  async findAllPizzas() {
    try {
      return await this.pizzaModel
        .find()
        .populate({
          path: 'comments',
          populate: {
            path: 'userId', // Также загружаем пользователя, связанного с комментарием
            select: 'username', // Только поле username
          },
        })
        .exec();
    } catch (error) {
      throw new Error(`Error fetching pizzas: ${error.message}`);
    }
  }

  async findPizza(id: string) {
    try {
      const objectId = new ObjectId(id);
      const pizza = await this.pizzaModel
        .findById(objectId)
        .populate({
          path: 'comments',
          populate: {
            path: 'userId', // Также загружаем пользователя, связанного с комментарием
            select: 'username', // Только поле username
          },
        })
        /*.populate('userId', 'username')*/
        .exec();
      if (!pizza) {
        throw new Error('Pizza not found!');
      }
      return pizza;
    } catch (error) {
      throw new Error(`Error fetching pizza with id: ${id}`);
    }
  }

  async updatePizza(id: string, dto: UpdatePizzaDto) {
    try {
      const updatedPizza = await this.pizzaModel
        .findByIdAndUpdate(id, dto, {
          new: true,
        })
        .populate({
          path: 'comments',
          populate: {
            path: 'userId', // Также загружаем пользователя, связанного с комментарием
            select: 'username', // Только поле username
          },
        });
      if (!updatedPizza) {
        throw new Error('Pizza not found and can not be updated!');
      }
      return updatedPizza;
    } catch (error) {
      throw new Error(`Error updating pizzas: ${error.message}`);
    }
  }

  async deletePizza(id: string) {
    try {
      const deletedPizza = await this.pizzaModel.findByIdAndDelete(id);
      if (!deletedPizza) {
        throw new Error('Pizza not found and can not be deleted!');
      }
      return deletedPizza;
    } catch (error) {
      throw new Error(`Error deleting pizza: ${error.message}`);
    }
  }
}
