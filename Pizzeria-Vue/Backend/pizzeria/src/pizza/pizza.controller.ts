import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('pizzas')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @Post('create')
  @Auth('admin')
  createPizza(@Body() createPizzaDto: CreatePizzaDto) {
    return this.pizzaService.createPizza(createPizzaDto);
  }

  @Get()
  findAllPizzas() {
    return this.pizzaService.findAllPizzas();
  }

  @Get(':id')
  findOnePizza(@Param('id') id: string) {
    console.log('Received ID:', id);
    return this.pizzaService.findPizza(id);
  }

  @Patch(':id')
  @Auth('admin')
  updatePizza(@Param('id') id: string, @Body() updatePizzaDto: UpdatePizzaDto) {
    return this.pizzaService.updatePizza(id, updatePizzaDto);
  }

  @Delete(':id')
  @Auth('admin')
  deletePizza(@Param('id') id: string) {
    return this.pizzaService.deletePizza(id);
  }
}
