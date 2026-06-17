import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    checks: ['rate==1.0'],
    http_req_failed: ['rate==0'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/health`);

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(1);
}