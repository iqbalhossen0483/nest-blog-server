import { Injectable, NotFoundException } from '@nestjs/common';
import { ResponseType } from '../type/common.type';
import { Blog, blogDto, updateBlogDto } from './dto/blog.dto';

@Injectable()
export class BlogService {
  private blogs: Blog[] = [
    {
      id: 1,
      title: 'My first blog',
      description: 'This is my first blog',
      author: 1,
    },
    {
      id: 2,
      title: 'My second blog',
      description: 'This is my second blog',
      author: 2,
    },
  ];
  getBlogs(search?: string): ResponseType<Blog[]> {
    if (search) {
      const filteredBlogs = this.blogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()),
      );
      return {
        success: true,
        message: 'Blogs found',
        data: filteredBlogs,
      };
    }
    return {
      success: true,
      message: 'Blogs found',
      data: this.blogs,
    };
  }
  getSingleBlog(id: number): ResponseType<Blog> {
    const blog = this.blogs.find((blog) => blog.id === id);
    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }
    return {
      success: true,
      message: 'Blog found',
      data: blog,
    };
  }
  createBlog(blog: blogDto): ResponseType<Blog> {
    const lastId = this.blogs[this.blogs.length - 1].id;
    const newBlog = { ...blog, id: lastId + 1 } as Blog;
    this.blogs.push(newBlog);
    return {
      success: true,
      message: 'Blog created successfully',
      data: newBlog,
    };
  }
  updateBlog(id: number, blog: updateBlogDto): ResponseType<Blog> {
    const blogToUpdate = this.blogs.find((blog) => blog.id === id);
    if (!blogToUpdate) {
      throw new NotFoundException("Blog doesn't exist");
    }

    if (blog.title) blogToUpdate.title = blog.title;
    if (blog.description) blogToUpdate.description = blog.description;

    return {
      success: true,
      message: 'Blog updated successfully',
      data: blogToUpdate,
    };
  }
  deleteBlog(id: number): ResponseType<Blog> {
    const blogToDelete = this.blogs.find((blog) => blog.id === id);
    if (!blogToDelete) {
      throw new NotFoundException("Blog doesn't exist");
    }
    this.blogs = this.blogs.filter((blog) => blog.id !== id);
    return {
      success: true,
      message: 'Blog deleted successfully',
      data: blogToDelete,
    };
  }
}
