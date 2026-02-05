import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity, CommentEntity } from '../entities/blog.entity';
import { UserEntity } from '../entities/user.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, CommentEntity, UserEntity])],
  providers: [BlogService, CommentService],
  controllers: [BlogController, CommentController],
})
export class BlogModule {}
