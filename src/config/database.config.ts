import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entity/user.entity';
import { BlogEntity, CommentEntity } from 'src/blog/entity/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'blog_server',
      synchronize: true,
      entities: [BlogEntity, CommentEntity, UserEntity],
    }),
  ],
})
export class DatabaseModule {}
