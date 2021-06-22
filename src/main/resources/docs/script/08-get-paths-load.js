import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 35 },
    { duration: '2m', target: 35 },
    { duration: '10s', target: 0 },
  ],

  thresholds: {
    http_req_duration: ['p(99)<1500'],
  },
};

const BASE_URL = 'https://ninjasul-subway.kro.kr';

export default function ()  {

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let loginRes = http.get(`${BASE_URL}/paths?source=1&target=23`, params);

  check(loginRes, {
    'logged in successfully': (resp) => resp.status === 200,
    'correct distance' : (resp) => resp.json('distance') === 26
  });

  sleep(1);
};
