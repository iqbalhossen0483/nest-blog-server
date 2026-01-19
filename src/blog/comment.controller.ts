import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ResponseType } from '../type/common.type';
import { CommentService } from './comment.service';
import { commentDto } from './dto/blog.dto';

@Controller('blog/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  async createComment(
    @Body() payload: commentDto,
  ): Promise<ResponseType<{ id: number }>> {
    return await this.commentService.createComment(payload);
  }

  @Put('update/:id')
  async updateComment(
    @Param('id') id: number,
    @Body() payload: commentDto,
  ): Promise<ResponseType<null>> {
    return await this.commentService.updateComment(id, payload);
  }

  @Delete('delete/:id')
  async deleteComment(@Param('id') id: number): Promise<ResponseType<null>> {
    return await this.commentService.deleteComment(id);
  }
}
