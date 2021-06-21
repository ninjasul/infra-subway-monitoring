import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  // the number of virtual users
  vus: 1,
  duration: '10s',

  thresholds: {
    // 99% of requests should be below 1500ms
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
