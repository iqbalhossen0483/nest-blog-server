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
import { Blog, blogDto, updateBlogDto } from './dto/blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  getBlogs(@Query('search') search?: string): ResponseType<Blog[]> {
    return this.blogService.getBlogs(search);
  }

  @Get(':id')
  getSingleBlog(@Param('id', ParseIntPipe) id: number): ResponseType<Blog> {
    return this.blogService.getSingleBlog(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createBlog(@Body() blog: blogDto): ResponseType<Blog> {
    return this.blogService.createBlog(blog);
  }

  @Put('/update/:id')
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() blog: updateBlogDto,
  ): ResponseType<Blog> {
    return this.blogService.updateBlog(id, blog);
  }

  @Delete('/delete/:id')
  deleteBlog(@Param('id', ParseIntPipe) id: number): ResponseType<Blog> {
    return this.blogService.deleteBlog(id);
  }
}
