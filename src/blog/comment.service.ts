import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseType } from '../type/common.type';
import { commentDto } from './dto/blog.dto';
import { CommentEntity } from './entity/blog.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  async createComment(
    payload: commentDto,
  ): Promise<ResponseType<CommentEntity>> {
    const newComment = await this.commentRepo.save(payload);
    return {
      success: true,
      message: 'Comment created successfully',
      data: newComment,
    };
  }

  async updateComment(
    id: number,
    payload: commentDto,
  ): Promise<ResponseType<null>> {
    const commentToUpdate = await this.commentRepo.findOne({ where: { id } });
    if (!commentToUpdate) {
      throw new NotFoundException("Comment doesn't exist");
    }

    await this.commentRepo.update(id, payload);

    return {
      success: true,
      message: 'Comment updated successfully',
      data: null,
    };
  }

  async deleteComment(id: number): Promise<ResponseType<null>> {
    const commentToDelete = await this.commentRepo.findOne({ where: { id } });
    if (!commentToDelete) {
      throw new NotFoundException("Comment doesn't exist");
    }

    await this.commentRepo.softDelete(id);

    return {
      success: true,
      message: 'Comment deleted successfully',
      data: null,
    };
  }
}
