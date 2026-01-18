import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseType } from '../type/common.type';
import { blogDto, updateBlogDto } from './dto/blog.dto';
import { BlogEntity } from './entity/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
  ) {}

  async getBlogs(search?: string): Promise<ResponseType<BlogEntity[]>> {
    if (search) {
      const blogs = await this.blogRepo.find({ where: { title: search } });
      return {
        success: true,
        message: 'Blogs found',
        data: blogs,
      };
    }
    const blogs = await this.blogRepo.find();
    return {
      success: true,
      message: 'Blogs found',
      data: blogs,
    };
  }
  async getSingleBlog(id: number): Promise<ResponseType<BlogEntity>> {
    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }
    return {
      success: true,
      message: 'Blog found',
      data: blog,
    };
  }
  async createBlog(blog: blogDto): Promise<ResponseType<BlogEntity>> {
    const newBlog = await this.blogRepo.save(blog);
    return {
      success: true,
      message: 'Blog created successfully',
      data: newBlog,
    };
  }
  async updateBlog(
    id: number,
    blog: updateBlogDto,
  ): Promise<ResponseType<BlogEntity>> {
    const blogToUpdate = await this.blogRepo.findOne({ where: { id } });
    if (!blogToUpdate) {
      throw new NotFoundException("Blog doesn't exist");
    }

    await this.blogRepo.update(id, blog);

    return {
      success: true,
      message: 'Blog updated successfully',
      data: blogToUpdate,
    };
  }
  async deleteBlog(id: number): Promise<ResponseType<BlogEntity>> {
    const blogToDelete = await this.blogRepo.findOne({ where: { id } });
    if (!blogToDelete) {
      throw new NotFoundException("Blog doesn't exist");
    }

    await this.blogRepo.upsert({ id, deletedAt: new Date() }, ['id']);

    return {
      success: true,
      message: 'Blog deleted successfully',
      data: blogToDelete,
    };
  }
}
