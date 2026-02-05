import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity, CommentEntity } from 'src/entities/blog.entity';
import { UserEntity } from 'src/entities/user.entity';

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
