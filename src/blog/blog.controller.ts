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
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/common/decorator/role.decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { UserRole } from 'src/entities/user.entity';
import { BlogEntity } from '../entities/blog.entity';
import type { ResponseType } from '../type/common.type';
import { BlogService } from './blog.service';
import {
  blogDto,
  BlogsQueryDto,
  LikeDislikeBlogDto,
  updateBlogDto,
} from './dto/blog.dto';

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
    @Query() query: BlogsQueryDto,
  ): Promise<ResponseType<BlogEntity>> {
    return this.blogService.getSingleBlog(id, query.page, query.limit);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Role(UserRole.ADMIN, UserRole.EDITOR)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  createBlog(@Body() blog: blogDto): Promise<ResponseType<BlogEntity>> {
    return this.blogService.createBlog(blog);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Role(UserRole.ADMIN, UserRole.EDITOR)
  @Post('/create-multiple')
  @HttpCode(HttpStatus.CREATED)
  createMultipleBlogs(
    @Body() blogs: blogDto[],
  ): Promise<ResponseType<Omit<BlogEntity, 'author'>[]>> {
    return this.blogService.createMultipleBlogs(blogs);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Role(UserRole.ADMIN, UserRole.EDITOR)
  @Put('/update/:id')
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() blog: updateBlogDto,
  ): Promise<ResponseType<BlogEntity>> {
    return this.blogService.updateBlog(id, blog);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Role(UserRole.ADMIN, UserRole.EDITOR)
  @Delete('/delete/:id')
  deleteBlog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseType<null>> {
    return this.blogService.deleteBlog(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Role(UserRole.ADMIN, UserRole.EDITOR)
  @Post('/restore/:id')
  restoreBlog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseType<BlogEntity>> {
    return this.blogService.restoreBlog(id);
  }

  @UseGuards(AuthGuard)
  @Role(UserRole.ADMIN, UserRole.EDITOR)
  @Post('/like/:id')
  likeBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LikeDislikeBlogDto,
  ): Promise<ResponseType<null>> {
    return this.blogService.likeBlog(id, payload.userId);
  }

  @UseGuards(AuthGuard)
  @Role(UserRole.ADMIN, UserRole.EDITOR)
  @Post('/dislike/:id')
  dislikeBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LikeDislikeBlogDto,
  ): Promise<ResponseType<null>> {
    return this.blogService.dislikeBlog(id, payload.userId);
  }

  @UseGuards(AuthGuard)
  @Post('/views/:id')
  blogViews(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LikeDislikeBlogDto,
  ): Promise<ResponseType<null>> {
    return this.blogService.blogViews(id, payload.userId);
  }
}
