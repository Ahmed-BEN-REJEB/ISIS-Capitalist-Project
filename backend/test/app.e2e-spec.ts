import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const testUser = 'e2e-test-user';
  const worldFile = join(process.cwd(), 'userworlds', `${testUser}-world.json`);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/graphql returns and persists a complete world', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query GetWorld($user: String!) {
            getWorld(user: $user) {
              name
              lastupdate
              products { id name }
            }
          }
        `,
        variables: { user: testUser },
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.getWorld.name).toBe('War Toy Kingdom');
    expect(response.body.data.getWorld.products).toHaveLength(6);
    expect(response.body.data.getWorld.lastupdate).toBeGreaterThan(0);
    expect(existsSync(worldFile)).toBe(true);
  });

  it('/graphql executes a purchase mutation', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation Buy($user: String!, $id: Int!, $quantity: Int!) {
            acheterQtProduit(user: $user, id: $id, quantite: $quantity) {
              id
              quantite
              cout
            }
          }
        `,
        variables: { user: testUser, id: 1, quantity: 2 },
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.acheterQtProduit.id).toBe(1);
    expect(response.body.data.acheterQtProduit.quantite).toBe(3);
    expect(response.body.data.acheterQtProduit.cout).toBeCloseTo(4 * 1.07 ** 2);
  });

  it('/graphql exposes the development playground', async () => {
    const response = await request(app.getHttpServer())
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);

    expect(response.text).toContain('<title>GraphiQL</title>');
  });

  afterEach(async () => {
    await app.close();
    if (existsSync(worldFile)) unlinkSync(worldFile);
  });
});
