import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 200 },   // 0 a 200 usuários em 2 minutos
    { duration: '2m', target: 500 },   // 200 a 500 usuários em 2 minutos
    { duration: '2m', target: 1000 },  // 500 a 1000 usuários em 2 minutos
  ],
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    userId: 1,
    orderId: Math.floor(Math.random() * 100000),
    amount: 199.90,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(`${BASE_URL}/checkout/crypto`, payload, params);

  check(res, {
    'status é 200 ou 201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}