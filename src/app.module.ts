import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './auth/entity/user.entity';
import { BlogModule } from './blog/blog.module';
import { BlogEntity, CommentEntity } from './blog/entity/blog.entity';

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
    BlogModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
