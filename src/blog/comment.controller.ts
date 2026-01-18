import { Controller, Param, Post } from '@nestjs/common';
import { ResponseType } from '../type/common.type';
import { CommentService } from './comment.service';
import { commentDto } from './dto/blog.dto';
import { CommentEntity } from './entity/blog.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async createComment(
    payload: commentDto,
  ): Promise<ResponseType<CommentEntity>> {
    return await this.commentService.createComment(payload);
  }

  @Post('update/:id')
  async updateComment(
    @Param('id') id: number,
    payload: commentDto,
  ): Promise<ResponseType<null>> {
    return await this.commentService.updateComment(id, payload);
  }

  @Post('delete/:id')
  async deleteComment(@Param('id') id: number): Promise<ResponseType<null>> {
    return await this.commentService.deleteComment(id);
  }
}
