import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 1,
  duration: '10s',

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
    'correct distance' : (resp) => resp.json('distance') === 30
  });

  sleep(1);
};
