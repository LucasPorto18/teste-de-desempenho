import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Carga baixa: 10 usuários por 30s
    { duration: '10s', target: 300 },  // Salto rápido para 300 usuários em 10s
    { duration: '1m', target: 300 },   // Mantém 300 usuários por 1 minuto
    { duration: '1s', target: 10 },    // Queda rápida para 10 usuários
    { duration: '30s', target: 10 },   // Mantém baixa carga após o pico
    { duration: '10s', target: 0 },    // Finaliza o teste
  ],
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const payload = JSON.stringify({
    userId: 1,
    productId: Math.floor(Math.random() * 100000),
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
  });

  sleep(1);
}