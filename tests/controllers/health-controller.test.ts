import request from 'supertest';
import express from 'express';
import {HealthController} from "../../src/controllers/health-controller";

describe('HealthController', () => {
  const app = express();
  const healthController = new HealthController();

  beforeAll(() => {
    app.get('/health', (req, res) => healthController.getHealthStatus(req, res));
  });

  describe('getHealthStatus', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return JSON with correct structure', async () => {
      const response = await request(app).get('/health');

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');

      // Validate timestamp is a valid ISO string
      expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);

      // Validate uptime is a string representation of a number
      expect(parseFloat(response.body.uptime)).not.toBeNaN();
    });
  });
});