import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity, CommentEntity } from '../entities/blog.entity';
import { UserEntity } from '../entities/user.entity';
import { ResponseType } from '../type/common.type';
import { commentDto } from './dto/blog.dto';

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

    let parent: CommentEntity | undefined = undefined;
    if (payload.parentId) {
      parent =
        (await this.commentRepo.findOne({
          where: { id: payload.parentId },
        })) || undefined;
    }

    const newBlog = await this.commentRepo.save({
      text: payload.text,
      parent,
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

  async likeComment(id: number, userId: number): Promise<ResponseType<null>> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['likes', 'dislikes'],
    });
    if (!comment) {
      throw new NotFoundException("Comment doesn't exist");
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    if (comment.likes.some((user) => user.id === user.id)) {
      throw new ConflictException('You have already liked this comment');
    }
    if (comment.dislikes.some((user) => user.id === user.id)) {
      comment.dislikes = comment.dislikes.filter(
        (dislikeUser) => dislikeUser.id !== user.id,
      );
    }

    comment.likes.push(user);
    await this.commentRepo.save(comment);
    return {
      success: true,
      message: 'Comment liked successfully',
      data: null,
    };
  }

  async dislikeComment(
    id: number,
    userId: number,
  ): Promise<ResponseType<null>> {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['likes', 'dislikes'],
    });
    if (!comment) {
      throw new NotFoundException("Comment doesn't exist");
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    if (comment.dislikes.some((user) => user.id === user.id)) {
      throw new ConflictException('You have already disliked this comment');
    }

    if (comment.likes.some((user) => user.id === user.id)) {
      comment.likes = comment.likes.filter(
        (likeUser) => likeUser.id !== user.id,
      );
    }
    comment.dislikes.push(user);
    await this.commentRepo.save(comment);
    return {
      success: true,
      message: 'Comment disliked successfully',
      data: null,
    };
  }
}
