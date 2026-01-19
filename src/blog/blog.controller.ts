import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { ResponseType } from '../type/common.type';
import { BlogService } from './blog.service';
import {
  blogDto,
  BlogsQueryDto,
  LikeDislikeBlogDto,
  updateBlogDto,
} from './dto/blog.dto';
import { BlogEntity } from './entity/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/all')
  getBlogs(@Query() query: BlogsQueryDto): Promise<ResponseType<BlogEntity[]>> {
    return this.blogService.getBlogs(query.search, query.page, query.limit);
  }

  @Get('/get-single/:id')
  getSingleBlog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseType<BlogEntity>> {
    return this.blogService.getSingleBlog(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createBlog(@Body() blog: blogDto): Promise<ResponseType<BlogEntity>> {
    return this.blogService.createBlog(blog);
  }

  @Post('/create-multiple')
  @HttpCode(HttpStatus.CREATED)
  createMultipleBlogs(
    @Body() blogs: blogDto[],
  ): Promise<ResponseType<Omit<BlogEntity, 'author'>[]>> {
    return this.blogService.createMultipleBlogs(blogs);
  }

  @Put('/update/:id')
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() blog: updateBlogDto,
  ): Promise<ResponseType<BlogEntity>> {
    return this.blogService.updateBlog(id, blog);
  }

  @Delete('/delete/:id')
  deleteBlog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseType<null>> {
    return this.blogService.deleteBlog(id);
  }

  @Post('/restore/:id')
  restoreBlog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseType<BlogEntity>> {
    return this.blogService.restoreBlog(id);
  }

  @Post('/like/:id')
  likeBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LikeDislikeBlogDto,
  ): Promise<ResponseType<null>> {
    return this.blogService.likeBlog(id, payload.userId);
  }

  @Post('/dislike/:id')
  dislikeBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LikeDislikeBlogDto,
  ): Promise<ResponseType<null>> {
    return this.blogService.dislikeBlog(id, payload.userId);
  }

  @Post('/views/:id')
  blogViews(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LikeDislikeBlogDto,
  ): Promise<ResponseType<null>> {
    return this.blogService.blogViews(id, payload.userId);
  }
}
