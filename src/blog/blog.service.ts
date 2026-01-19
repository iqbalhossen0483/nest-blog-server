import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../auth/entity/user.entity';
import { ResponseType } from '../type/common.type';
import { blogDto, updateBlogDto } from './dto/blog.dto';
import { BlogEntity, CommentEntity } from './entity/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
  ) {}

  async getBlogs(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseType<BlogEntity[]>> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.blogRepo
      .createQueryBuilder('blog')
      .loadRelationCountAndMap('blog.commentCount', 'blog.comments')
      .loadRelationCountAndMap('blog.likeCount', 'blog.likes')
      .loadRelationCountAndMap('blog.dislikeCount', 'blog.dislikes')
      .leftJoinAndSelect('blog.author', 'author')
      .select(['blog', 'author.id', 'author.name', 'author.email'])
      .orderBy('blog.createdAt', 'ASC')
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.where('blog.title LIKE :search', { search: `%${search}%` });
    }

    const [blogs, count] = await queryBuilder.getManyAndCount();

    return {
      success: true,
      message: 'Blogs fetched successfully',
      data: blogs,
      meta: {
        total: count,
        page,
        last_page: Math.ceil(count / limit),
      },
    };
  }
  async getSingleBlog(
    id: number,
    page = 1,
    limit = 10,
  ): Promise<ResponseType<BlogEntity>> {
    const skip = (page - 1) * limit;

    const blog = await this.blogRepo
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .leftJoinAndSelect('blog.likes', 'likes')
      .leftJoinAndSelect('blog.dislikes', 'dislikes')
      .loadRelationCountAndMap('blog.viewsCount', 'blog.views')
      .select([
        'blog',
        'author.id',
        'author.name',
        'author.email',
        'likes.id',
        'likes.name',
        'likes.email',
        'dislikes.id',
        'dislikes.name',
        'dislikes.email',
      ])
      .where('blog.id = :id', { id })
      .skip(skip)
      .limit(limit)
      .getOne();

    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }

    const [comments, count] = await this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.likes', 'likes')
      .leftJoinAndSelect('comment.dislikes', 'dislikes')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('replies.author', 'replyAuthor')
      .select([
        'comment',
        'author.id',
        'author.name',
        'author.email',
        'likes.id',
        'likes.name',
        'likes.email',
        'dislikes.id',
        'dislikes.name',
        'dislikes.email',
        'replies',
        'replyAuthor.id',
        'replyAuthor.name',
        'replyAuthor.email',
      ])
      .where('comment.blogId = :id AND comment.parent IS NULL', { id })
      .getManyAndCount();

    blog.comments = comments;

    return {
      success: true,
      message: 'Blog fetched successfully',
      data: blog,
      meta: {
        total: count,
        page,
        last_page: Math.ceil(count / limit),
      },
    };
  }
  async createBlog(payload: blogDto): Promise<ResponseType<BlogEntity>> {
    const author = await this.userRepo.findOne({
      where: { id: payload.author },
    });

    if (!author) {
      throw new NotFoundException("Author doesn't exist");
    }

    const insertedBlog = await this.blogRepo.save({
      ...payload,
      author,
    });

    const newBlog = await this.blogRepo.findOne({
      where: { id: insertedBlog.id },
    });

    if (!newBlog) {
      throw new NotFoundException("Blog doesn't inserted");
    }

    return {
      success: true,
      message: 'Blog created successfully',
      data: newBlog,
    };
  }

  async createMultipleBlogs(
    payload: blogDto[],
  ): Promise<ResponseType<Omit<BlogEntity, 'author'>[]>> {
    const blogData = await Promise.all(
      payload.map(async (blog) => {
        const author = await this.userRepo.findOne({
          where: { id: blog.author },
        });
        if (!author) {
          throw new NotFoundException("Author doesn't exist");
        }
        return {
          ...blog,
          author,
        };
      }),
    );
    const insertedBlogs = await this.blogRepo.save(blogData);
    const newBlogs = await this.blogRepo.find({
      where: { id: In(insertedBlogs.map((blog) => blog.id)) },
    });

    return {
      success: true,
      message: 'Blogs created successfully',
      data: newBlogs,
    };
  }

  async updateBlog(
    id: number,
    payload: updateBlogDto,
  ): Promise<ResponseType<BlogEntity>> {
    const blogToUpdate = await this.blogRepo.findOne({ where: { id } });
    if (!blogToUpdate) {
      throw new NotFoundException("Blog doesn't exist");
    }

    await this.blogRepo.update(id, payload);

    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }

    return {
      success: true,
      message: 'Blog updated successfully',
      data: blog,
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

  async restoreBlog(id: number): Promise<ResponseType<BlogEntity>> {
    const blogToRestore = await this.blogRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!blogToRestore) {
      throw new NotFoundException("Blog doesn't exist");
    }

    await this.blogRepo.restore(id);

    const blog = await this.blogRepo.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }

    return {
      success: true,
      message: 'Blog restored successfully',
      data: blog,
    };
  }

  async likeBlog(id: number, userId: number): Promise<ResponseType<null>> {
    const blog = await this.blogRepo.findOne({
      where: { id },
      relations: ['likes', 'dislikes'],
    });
    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }
    if (blog.likes.some((user) => user.id === user.id)) {
      throw new ConflictException('You have already liked this blog');
    }

    if (blog.dislikes.some((user) => user.id === user.id)) {
      blog.dislikes = blog.dislikes.filter(
        (dislikeUser) => dislikeUser.id !== user.id,
      );
    }

    blog.likes.push(user);
    await this.blogRepo.save(blog);
    return {
      success: true,
      message: 'Blog liked successfully',
      data: null,
    };
  }

  async dislikeBlog(id: number, userId: number): Promise<ResponseType<null>> {
    const blog = await this.blogRepo.findOne({
      where: { id },
      relations: ['likes', 'dislikes'],
    });
    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    if (blog.dislikes.some((user) => user.id === user.id)) {
      throw new ConflictException('You have already disliked this blog');
    }

    if (blog.likes.some((user) => user.id === user.id)) {
      blog.likes = blog.likes.filter((likeUser) => likeUser.id !== user.id);
    }
    blog.dislikes.push(user);
    await this.blogRepo.save(blog);
    return {
      success: true,
      message: 'Blog disliked successfully',
      data: null,
    };
  }

  async blogViews(id: number, userId: number): Promise<ResponseType<null>> {
    const blog = await this.blogRepo.findOne({
      where: { id },
      relations: ['views'],
    });
    if (!blog) {
      throw new NotFoundException("Blog doesn't exist");
    }
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    if (blog.views.some((user) => user.id === user.id)) {
      throw new ConflictException('You have already viewed this blog');
    }

    blog.views.push(user);
    await this.blogRepo.save(blog);
    return {
      success: true,
      message: 'Blog views updated successfully',
      data: null,
    };
  }
}
