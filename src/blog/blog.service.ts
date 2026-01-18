import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { ResponseType } from '../type/common.type';
import { blogDto, updateBlogDto } from './dto/blog.dto';
import { BlogEntity } from './entity/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
  ) {}

  async getBlogs(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseType<BlogEntity[]>> {
    const skip = (page - 1) * limit;

    const query: FindManyOptions<BlogEntity> = {
      order: { createdAt: 'DESC' },
      skip: skip,
      take: limit,
      relations: ['comments'],
    };

    if (search) {
      query.where = { title: Like(`%${search}%`) };

      const count = await this.blogRepo.count(query);
      const blogs = await this.blogRepo.find(query);
      return {
        success: true,
        message: 'Blogs found',
        data: blogs,
        meta: {
          total: count,
          page,
          last_page: Math.ceil(count / limit),
        },
      };
    }

    const count = await this.blogRepo.count();

    const blogs = await this.blogRepo.find(query);
    return {
      success: true,
      message: 'Blogs found',
      data: blogs,
      meta: {
        total: count,
        page,
        last_page: Math.ceil(count / limit),
      },
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
  async createBlog(payload: blogDto): Promise<ResponseType<BlogEntity>> {
    const newBlog = await this.blogRepo.save(payload);
    return {
      success: true,
      message: 'Blog created successfully',
      data: newBlog,
    };
  }

  async createMultipleBlogs(
    payload: blogDto[],
  ): Promise<ResponseType<BlogEntity[]>> {
    const newBlogs = await this.blogRepo.save(payload);
    return {
      success: true,
      message: 'Blogs created successfully',
      data: newBlogs,
    };
  }

  async updateBlog(
    id: number,
    payload: updateBlogDto,
  ): Promise<ResponseType<null>> {
    const blogToUpdate = await this.blogRepo.findOne({ where: { id } });
    if (!blogToUpdate) {
      throw new NotFoundException("Blog doesn't exist");
    }

    await this.blogRepo.update(id, payload);

    return {
      success: true,
      message: 'Blog updated successfully',
      data: null,
    };
  }
  async deleteBlog(id: number): Promise<ResponseType<null>> {
    const blogToDelete = await this.blogRepo.findOne({ where: { id } });
    if (!blogToDelete) {
      throw new NotFoundException("Blog doesn't exist");
    }

    await this.blogRepo.softDelete(id);

    return {
      success: true,
      message: 'Blog deleted successfully',
      data: null,
    };
  }

  async restoreBlog(id: number): Promise<ResponseType<null>> {
    const blogToRestore = await this.blogRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!blogToRestore) {
      throw new NotFoundException("Blog doesn't exist");
    }

    await this.blogRepo.restore(id);

    return {
      success: true,
      message: 'Blog restored successfully',
      data: null,
    };
  }
}
