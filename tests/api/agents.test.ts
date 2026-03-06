import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from 'next-test-api-route-handler';

// helper to load route handlers directly
import * as configRoute from '../../app/api/agents/config/route';

const getHandler = (handler: any) => app(handler);

describe('agents config API', () => {
  it('GET returns json', async () => {
    const res = await request(getHandler(configRoute.GET)).get('/');
    expect(res.status).toBe(200);
    expect(res.body.agentList).toBeInstanceOf(Array);
  });

  it('PUT rejects disallowed keys', async () => {
    const res = await request(getHandler(configRoute.PUT))
      .put('/')
      .send({ evil: 1, syncInterval: 5 });
    expect(res.status).toBe(200);
    expect(res.body.syncInterval).toBe(5);
    expect(res.body.evil).toBeUndefined();
  });
});
