import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 35 },
    { duration: '2m', target: 35 },
    { duration: '1m', target: 70 },
    { duration: '2m', target: 70 },
    { duration: '1m', target: 105 },
    { duration: '2m', target: 105 },
    { duration: '1m', target: 140 },
    { duration: '2m', target: 140 },
    { duration: '10s', target: 0 },
  ],

  thresholds: {
    http_req_duration: ['p(99)<1500'],
  },
};

const BASE_URL = 'https://ninjasul-subway.kro.kr';

export default function ()  {

  var payload = JSON.stringify({
    email: `${Date.now()}@ninjasul.com`,
    password: '1234',
    age: '20'
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let loginRes = http.post(`${BASE_URL}/members`, payload, params);

  check(loginRes, {
    'logged in successfully': (resp) => resp.status === 201
  });

  sleep(1);
};
