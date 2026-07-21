import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Applications (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/applications', () => {
    const validPayload = {
      company: 'Test Corp',
      role: 'Engineer',
      appliedAt: '2026-07-01',
    };

    it('should create an application and return 201 with the created record', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/applications')
        .send(validPayload)
        .expect(201);

      expect(res.body).toMatchObject({
        company: 'Test Corp',
        role: 'Engineer',
        status: 'applied',
        appliedAt: '2026-07-01',
      });
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 when company is missing', async () => {
      const { company, ...invalid } = validPayload;
      await request(app.getHttpServer())
        .post('/api/applications')
        .send(invalid)
        .expect(400);
    });

    it('should return 400 when role is missing', async () => {
      const { role, ...invalid } = validPayload;
      await request(app.getHttpServer())
        .post('/api/applications')
        .send(invalid)
        .expect(400);
    });

    it('should return 400 when appliedAt is missing', async () => {
      const { appliedAt, ...invalid } = validPayload;
      await request(app.getHttpServer())
        .post('/api/applications')
        .send(invalid)
        .expect(400);
    });
  });
});
