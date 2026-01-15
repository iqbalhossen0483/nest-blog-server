import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BlogController } from './blog/blog.controller';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [BlogModule],
  controllers: [AppController, BlogController],
  providers: [],
})
export class AppModule {}
