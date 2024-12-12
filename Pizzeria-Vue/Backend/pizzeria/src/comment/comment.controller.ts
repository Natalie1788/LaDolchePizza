import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Auth()
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser('id') userId: string, // Получаем userId из токена
  ) {
    return this.commentService.createComment({ ...createCommentDto, userId });
  }

  @Get()
  findAllComments() {
    return this.commentService.findAllComments();
  }

  @Get(':id')
  findOneComment(@Param('id') id: string) {
    return this.commentService.findOneComment(id);
  }

  @Get('pizza/:pizzaId')
  async getCommentsForPizza(@Param('pizzaId') pizzaId: string) {
    return this.commentService.findCommentsByPizzaId(pizzaId);
  }

  @Patch(':id')
  @Auth()
  updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentService.updateComment(id, updateCommentDto, userId);
  }

  @Delete(':id')
  @Auth()
  deleteComment(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.commentService.deleteComment(id, userId);
  }

  @Get('/count-by-pizza')
  async getCommentCounts() {
    return this.commentService.countCommentsByPizza();
  }
}

/*import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { UserDocument } from 'src/user/entities/user.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Auth()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentService.createComment(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAllComments();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOneComment(id);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentService.updateComment(+id, updateCommentDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.commentService.deleteComment(+id);
  }
}
*/
