import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BlogEntity } from 'src/blog/entity/blog.entity';
import { ResponseType } from 'src/type/common.type';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/ (GET) all blogs', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/blog/all')
      .expect(200);

    const body = res.body as ResponseType<BlogEntity[]>;
    expect(body.success).toBe(true);
    expect(body.message).toBe('Blogs fetched successfully');
  });

  it('/ (GET) blog by id', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/blog/get-single/120')
      .expect(200);

    const body = res.body as ResponseType<BlogEntity>;
    expect(body.success).toBe(true);
    expect(body.message).toBe('Blog fetched successfully');
  });

  it('/ (POST) create blog', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/blog/create')
      .send({
        title: 'test',
        description: 'test',
        author: 1,
      })
      .expect(201);

    const body = res.body as ResponseType<BlogEntity>;
    expect(body.success).toBe(true);
    expect(body.message).toBe('Blog created successfully');
  });
});
