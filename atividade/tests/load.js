import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp-up: 0 a 50 usuários
    { duration: '2m', target: 50 },  // Platô: mantém 50 usuários
    { duration: '30s', target: 0 },  // Ramp-down: 50 a 0 usuários
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // p95 menor que 500ms
    http_req_failed: ['rate<0.01'],   // erros abaixo de 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    userId: 1,
    productId: 101,
    quantity: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/checkout/simple`, payload, params);

  check(res, {
    'status é 200 ou 201': (r) => r.status === 200 || r.status === 201,
    'tempo menor que 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}