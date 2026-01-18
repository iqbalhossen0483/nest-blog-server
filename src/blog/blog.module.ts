import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { BlogEntity, CommentEntity } from './entity/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, CommentEntity])],
  providers: [BlogService, CommentService],
  controllers: [BlogController, CommentController],
})
export class BlogModule {}
