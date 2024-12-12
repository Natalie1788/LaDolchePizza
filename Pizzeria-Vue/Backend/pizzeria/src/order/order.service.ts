// orders.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Pizza } from 'src/pizza/entities/pizza.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Pizza.name) private readonly pizzaModel: Model<Pizza>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Создание нового заказа
  /*async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, pizzas } = createOrderDto;

    // Преобразуем userId в ObjectId
    const userObjectId = new Types.ObjectId(userId);

    // Проверяем, существует ли пользователь
    const user = await this.userModel.findById(userObjectId).exec();
    if (!user) {
      throw new Error('User not found');
    }

    // Преобразуем данные пицц в массив объектов с ObjectId
    const pizzasWithObjectIds = pizzas.map((item) => ({
      pizzas: new Types.ObjectId(item.pizzaId), // Преобразуем ID пиццы в ObjectId
      //quantity: item.quantity, // Количество пиццы
    }));

    // Подсчитываем общую цену
    const totalPrice = await this.calculateTotalPrice(pizzasWithObjectIds);

    // Создаём новый заказ
    const order = new this.orderModel({
      userId: userObjectId,
      pizzas: pizzasWithObjectIds,
      totalPrice,
    });

    // Добавляем заказ в список заказов пользователя
    await this.userModel.findByIdAndUpdate(
      userObjectId,
      { $push: { orders: order._id } },
      { new: true },
    );

    return order.save(); // Сохраняем заказ в базе данных
  }

  /*async calculateTotalPrice(
    pizzas: { pizza: Types.ObjectId; quantity: number }[],
  ): Promise<number> {
    let totalPrice = 0;

    // Получаем массив ID пицц
    const pizzaIds = pizzas.map((item) => item.pizza);

    // Извлекаем данные о пиццах из базы
    const pizzaData = await this.pizzaModel
      .find({ _id: { $in: pizzaIds } })
      .exec();

    // Подсчитываем общую стоимость заказа
    pizzas.forEach((orderPizza) => {
      const pizza = pizzaData.find(
        (p) => p._id.toString() === orderPizza.pizza.toString(),
      ); // Сравниваем ID пиццы
      if (pizza) {
        totalPrice += pizza.price * orderPizza.quantity;
      }
    });

    return totalPrice;
  }*/
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, pizzas } = createOrderDto;

    // Проверяем, существует ли пользователь
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Проверяем, существуют ли все пиццы
    const pizzaData = await this.pizzaModel
      .find({ _id: { $in: pizzas } })
      .exec();

    /* if (pizzaData.length !== pizzas.length) {
      throw new NotFoundException('One or more pizzas not found');
    }*/

    // Подсчитываем общую стоимость
    const totalPrice = await this.calculateTotalPrice(pizzas);

    // Создаём новый заказ
    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      pizzas,
      totalPrice,
    });

    // Обновляем список заказов пользователя
    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { orders: order._id } },
      { new: true },
    );

    return order.save();
  }

  async calculateTotalPrice(pizzaIds: string[]): Promise<number> {
    let totalPrice = 0;

    // Преобразуем строковые ID в ObjectId
    const objectIds = pizzaIds.map((id) => new Types.ObjectId(id));

    // Извлекаем данные о пиццах из базы
    const pizzaData = await this.pizzaModel
      .find({ _id: { $in: objectIds } })
      .exec();

    // Подсчитываем общую стоимость
    pizzaIds.forEach((pizzaId) => {
      const pizza = pizzaData.find((p) => p._id.toString() === pizzaId);
      if (pizza) {
        totalPrice += pizza.price;
      }
    });

    return totalPrice;
  }

  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
    userId: string,
  ): Promise<Order> {
    // Проверяем валидность `orderId`
    if (!Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid order ID format');
    }

    const orderObjectId = new Types.ObjectId(orderId);
    const userObjectId = new Types.ObjectId(userId);

    const { pizzas } = updateOrderDto;

    // Проверяем, существует ли заказ
    const order = await this.orderModel.findById(orderObjectId).exec();
    if (!order) {
      throw new Error('Order not found');
    }

    // Проверяем, принадлежит ли заказ пользователю
    if (order.userId.toString() !== userObjectId.toString()) {
      throw new ForbiddenException('You can only update your own orders');
    }

    // Пересчитываем общую стоимость заказа
    const totalPrice = await this.calculateTotalPrice(pizzas);

    // Обновляем заказ
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        orderObjectId,
        {
          pizzas: pizzas.map((pizzaId) => new Types.ObjectId(pizzaId)), // Преобразуем ID в ObjectId
          totalPrice, // Пересчитанная стоимость
        },
        { new: true },
      )
      .exec();

    if (!updatedOrder) {
      throw new Error('Failed to update order');
    }

    return updatedOrder;
  }

  // Обновление заказа (например, добавление или удаление пицц)
  /*async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
    userId: string,
  ): Promise<Order> {
    // Проверяем, является ли `orderId` валидным ObjectId
    if (!Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid order ID format');
    }

    const orderObjectId = new Types.ObjectId(orderId);
    const userObjectId = new Types.ObjectId(userId);

    const { pizzas } = updateOrderDto;

    // Проверяем, существует ли заказ
    const order = await this.orderModel.findById(orderObjectId).exec();
    if (!order) {
      throw new Error('Order not found');
    }

    // Проверяем, принадлежит ли заказ пользователю
    if (order.userId.toString() !== userObjectId.toString()) {
      throw new ForbiddenException('You can only update your own orders');
    }

    // Преобразуем данные пицц в массив объектов с ObjectId
    const pizzasWithObjectIds = pizzas.map((item) => ({
      pizza: new Types.ObjectId(item.pizzaId), // Преобразуем ID пиццы
      quantity: item.quantity,
    }));

    // Пересчитываем общую стоимость заказа
    const totalPrice = await this.calculateTotalPrice(pizzasWithObjectIds);

    // Обновляем заказ
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        orderObjectId,
        {
          pizzas: pizzasWithObjectIds,
          totalPrice, // Пересчитанная стоимость
        },
        { new: true },
      )
      .exec();

    if (!updatedOrder) {
      throw new Error('Failed to update order');
    }

    return updatedOrder;
  }*/

  // Удаление заказа (отмена)
  async cancelOrder(
    orderId: string,
    userId: string,
  ): Promise<{ message: string }> {
    // Проверяем валидность ObjectId
    if (!Types.ObjectId.isValid(orderId)) {
      throw new Error('Invalid order ID format');
    }
    const orderObjectId = new Types.ObjectId(orderId);

    // Находим заказ
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      throw new Error('Order not found');
    }

    // Проверяем права доступа
    if (order.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own orders');
    }
    const userWithOrder = await this.userModel.find({ orders: orderId }).exec();
    console.log('Users made this order:', userWithOrder);

    // Удаляем заказ из массива заказов пользователя
    /*const updateResult = await this.userModel.updateOne(
      { _id: order.userId },
      { $pull: { orders: orderObjectId } },
    );*/
    const updateResult = await this.userModel.updateMany(
      { orders: orderObjectId },
      { $pull: { orders: orderObjectId } },
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to remove order from user orders');
    }

    // Удаляем сам заказ
    await order.deleteOne();

    return { message: 'Order deleted successfully' };
  }

  async getOrders() {
    try {
      // Популяция поля `pizzas.pizza`
      const orders = await this.orderModel
        .find()
        .populate('pizzas', 'name')
        .populate('userId', 'username')
        .exec();
      return orders;
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  }

  async getOrderById(orderId: string) {
    try {
      // Проверка валидности ObjectId
      if (!Types.ObjectId.isValid(orderId)) {
        throw new Error('Invalid order ID format');
      }

      // Популяция поля `pizzas.pizza`
      const order = await this.orderModel
        .findById(orderId)
        .populate({
          path: 'pizzas', // Пополняем массив `pizzas`
          select: 'name', // Указываем, что нам нужно только поле `name` из коллекции `Pizza`
        })
        .populate('userId', 'username')
        .exec();

      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      throw new Error('Failed to fetch order');
    }
  }
}
