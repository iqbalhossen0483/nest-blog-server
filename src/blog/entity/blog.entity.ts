import { UserEntity } from 'src/auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blogs')
export class BlogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 1000 })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.blogs)
  @JoinColumn({ name: 'author' })
  author: UserEntity;

  @Column('int', { array: true, default: [] })
  views: number[]; // to do: make it unique for each blog

  @ManyToMany(() => UserEntity, (user) => user.likedBlogs)
  @JoinTable({
    name: 'blog_likes',
    joinColumn: {
      name: 'blogId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  likes: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.dislikedBlogs)
  @JoinTable({
    name: 'blog_dislikes',
    joinColumn: {
      name: 'blogId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  dislikes: UserEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.blog)
  comments: CommentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 1000 })
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'author' })
  author: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
