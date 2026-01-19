import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ResponseType } from '../type/common.type';
import { CommentService } from './comment.service';
import { commentDto, LikeDislikeBlogDto } from './dto/blog.dto';
import { CommentEntity } from './entity/blog.entity';

@Controller('blog/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  async createComment(
    @Body() payload: commentDto,
  ): Promise<ResponseType<CommentEntity>> {
    return await this.commentService.createComment(payload);
  }

  @Put('update/:id')
  async updateComment(
    @Param('id') id: number,
    @Body() payload: commentDto,
  ): Promise<ResponseType<CommentEntity>> {
    return await this.commentService.updateComment(id, payload);
  }

  @Delete('delete/:id')
  async deleteComment(@Param('id') id: number): Promise<ResponseType<null>> {
    return await this.commentService.deleteComment(id);
  }

  @Post('like/:id')
  async likeComment(
    @Param('id') id: number,
    @Body() payload: LikeDislikeBlogDto,
  ): Promise<ResponseType<null>> {
    return await this.commentService.likeComment(id, payload.userId);
  }

  @Post('dislike/:id')
  async dislikeComment(
    @Param('id') id: number,
    @Body() payload: LikeDislikeBlogDto,
  ): Promise<ResponseType<null>> {
    return await this.commentService.dislikeComment(id, payload.userId);
  }
}
