import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Pizza } from 'src/pizza/entities/pizza.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Pizza.name) private readonly pizzaModel: Model<Pizza>,
  ) {}

  // Создать комментарий
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { text, userId, pizzaId } = createCommentDto;

    // Проверка валидности MongoDB ID
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(pizzaId)) {
      throw new BadRequestException('Invalid userId or pizzaId');
    }
    // Проверяем, существует ли пицца с указанным ID
    const pizza = await this.pizzaModel.findById(pizzaId).exec();
    if (!pizza) {
      throw new NotFoundException('Pizza not found');
    }

    const comment = new this.commentModel({
      text,
      userId,
      pizzaId,
      //userId: new Types.ObjectId(userId),
      // pizzaId: new Types.ObjectId(pizzaId),
    });

    const savedComment = await comment.save();

    // Обновляем пиццу, добавляя комментарий
    await this.pizzaModel.findByIdAndUpdate(
      pizzaId,
      { $push: { comments: savedComment._id } },
      { new: true },
    );

    return savedComment;
  }

  // Получить все комментарии
  async findAllComments(): Promise<Comment[]> {
    return this.commentModel
      .find()
      .populate('userId', 'username') // Подгружаем информацию о пользователе
      .populate('pizzaId', 'name') // Подгружаем информацию о пицце
      .exec();
  }

  // Получить один комментарий
  async findOneComment(id: string): Promise<Comment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.commentModel
      .findById(id)
      .populate('userId', 'username')
      .populate('pizzaId', 'name')
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
  async findCommentsByPizzaId(pizzaId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ pizzaId }) // Находим только комментарии для указанной пиццы
      .populate('userId', 'username') // Заполняем данные о пользователе
      .populate('pizzaId', 'name') // Заполняем данные о пицце
      .exec();
  }

  // Обновить комментарий
  async updateComment(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Проверяем, что пользователь — автор комментария
    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return comment.save();
  }

  // Удалить комментарий
  async deleteComment(
    id: string,
    userId: string,
  ): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment ID');
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Проверяем, что пользователь — автор комментария
    if (comment.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Удаляем комментарий из всех пицц
    const commentId = new Types.ObjectId(id); // Преобразуем строку в ObjectId

    const pizzasWithComment = await this.pizzaModel
      .find({ comments: id })
      .exec();
    console.log('Pizzas with comment:', pizzasWithComment);

    const updateResult = await this.pizzaModel.updateMany(
      { comments: commentId },
      { $pull: { comments: commentId } },
    );

    await comment.deleteOne();
    return { message: 'Comment deleted successfully' };
  }

  // Подсчет комментариев по пицце
  async countCommentsByPizza(): Promise<Record<string, number>> {
    // Логирование всех комментариев
    const comments = await this.commentModel.find().exec();
    console.log('All comments:', comments);

    const commentCounts = await this.commentModel.aggregate([
      {
        $match: {
          pizzaId: { $type: 'ObjectId' },
        },
      },
      {
        $group: {
          _id: '$pizzaId',
          count: { $sum: 1 },
        },
      },
    ]);

    console.log('Comment counts:', commentCounts);

    return commentCounts.reduce(
      (acc, curr) => {
        acc[curr._id.toString()] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}

/*import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    try {
      const newComment = new this.commentModel(createCommentDto);
      return await newComment.save();
    } catch (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  }

  async findAllComments() {
    try {
      return await this.commentModel.find().exec();
    } catch (error) {
      throw new Error(`Failed to retrieve comments: ${error.message}`);
    }
  }

  async findOneComment(id: number) {
    try {
      const comment = await this.commentModel.findById(id).exec();
      if (!comment) {
        throw new Error(`Comment not found with id: ${id}`);
      }
    } catch (error) {
      throw new Error(`Failed to find comment: ${error.message}`);
    }
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      const updatedComment = await this.commentModel
        .findByIdAndUpdate(id)
        .exec();
      if (!updatedComment) {
        throw new Error('Failed to find updated comment');
      }
    } catch (error) {
      throw new Error('Failed to update the comment');
    }
  }

  async deleteComment(id: number) {
    try {
      const deletedComment = await this.commentModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedComment) {
        throw new Error('Failed to find deleted comment');
      }
    } catch (error) {
      throw new Error('Failed to delete the comment');
    }
  }
}*/
