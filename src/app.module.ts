import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './config/database.config';

@Module({
  imports: [DatabaseModule, AppConfigModule, BlogModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
