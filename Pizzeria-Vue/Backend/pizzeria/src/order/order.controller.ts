// orders.controller.ts
import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Создание нового заказа
  @Post()
  @Auth()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser('id') userId: string,
  ): Promise<Order> {
    return this.orderService.createOrder({ ...createOrderDto, userId });
  }

  // Обновление заказа (добавление или удаление пицц)
  @Put(':id')
  @Auth()
  async updateOrder(
    @Param('id') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser('id') userId: string,
  ): Promise<Order> {
    return this.orderService.updateOrder(orderId, updateOrderDto, userId);
  }

  // Отмена заказа
  @Delete(':id')
  @Auth()
  async cancelOrder(
    @Param('id') orderId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.orderService.cancelOrder(orderId, userId);
  }

  @Get()
  findAllOrders() {
    return this.orderService.getOrders();
  }

  @Get(':id')
  findOneOrder(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }
}
