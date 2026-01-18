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
import { blogDto, updateBlogDto } from './dto/blog.dto';
import { BlogEntity } from './entity/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  getBlogs(
    @Query('search') search?: string,
  ): Promise<ResponseType<BlogEntity[]>> {
    return this.blogService.getBlogs(search);
  }

  @Get(':id')
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

  @Put('/update/:id')
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() blog: updateBlogDto,
  ): Promise<ResponseType<null>> {
    return this.blogService.updateBlog(id, blog);
  }

  @Delete('/delete/:id')
  deleteBlog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseType<null>> {
    return this.blogService.deleteBlog(id);
  }
}
