import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';
import { Repository } from 'typeorm';
import { ResponseType } from '../type/common.type';
import { commentDto } from './dto/blog.dto';
import { BlogEntity, CommentEntity } from './entity/blog.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    @InjectRepository(BlogEntity)
    private blogRepo: Repository<BlogEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async createComment(
    payload: commentDto,
  ): Promise<ResponseType<CommentEntity>> {
    const blog = await this.blogRepo.findOne({
      where: { id: payload.blogId },
    });
    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }

    const author = await this.userRepo.findOne({
      where: { id: payload.author },
    });
    if (!author) {
      throw new NotFoundException("Author doesn't exist");
    }

    const newBlog = await this.commentRepo.save({
      text: payload.text,
      blog,
      author,
    });

    const comment = await this.commentRepo.findOne({
      where: { id: newBlog.id },
    });
    if (!comment) {
      throw new NotFoundException("Comment doesn't exist");
    }
    return {
      success: true,
      message: 'Comment created successfully',
      data: comment,
    };
  }

  async updateComment(
    id: number,
    payload: commentDto,
  ): Promise<ResponseType<CommentEntity>> {
    const commentToUpdate = await this.commentRepo.findOne({ where: { id } });
    if (!commentToUpdate) {
      throw new NotFoundException("Comment doesn't exist");
    }

    await this.commentRepo.update(id, {
      text: payload.text,
    });

    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException("Comment doesn't exist");
    }

    return {
      success: true,
      message: 'Comment updated successfully',
      data: comment,
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
