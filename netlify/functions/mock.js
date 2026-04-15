'use strict';

exports.handler = async (event) => {
  const path = event.path || '';

  const route = path
    .replace(/^\/.netlify\/functions\/mock/, '')
    .replace(/^\/api/, '');

  const matchesPrefix = (value, prefix) =>
    value === prefix || value.startsWith(`${prefix}/`);

  if (matchesPrefix(route, '/404')) {
    return { statusCode: 404, body: 'Not Found' };
  }

  if (matchesPrefix(route, '/500')) {
    return { statusCode: 500, body: 'Internal Server Error' };
  }

  if (matchesPrefix(route, '/501')) {
    return { statusCode: 501, body: 'Not Implemented' };
  }

  if (matchesPrefix(route, '/505')) {
    return { statusCode: 505, body: 'HTTP Version Not Supported' };
  }

  // return html server error page
  if (matchesPrefix(route, '/html-500')) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Internal Server Error</h1></body></html>',
    };
  }

  // return html not found page
  if (matchesPrefix(route, '/html-404')) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Not Found</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-501')) {
    return {
      statusCode: 501,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Not Implemented</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-505')) {
    return {
      statusCode: 505,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>HTTP Version Not Supported</h1></body></html>',
    };
  }

  // HTML 4xx Client Errors
  if (matchesPrefix(route, '/html-400')) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Bad Request</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-401')) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Unauthorized</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-403')) {
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Forbidden</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-405')) {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Method Not Allowed</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-406')) {
    return {
      statusCode: 406,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Not Acceptable</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-408')) {
    return {
      statusCode: 408,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Request Timeout</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-409')) {
    return {
      statusCode: 409,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Conflict</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-410')) {
    return {
      statusCode: 410,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Gone</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-429')) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'text/html', 'Retry-After': '60' },
      body: '<html><body><h1>Too Many Requests</h1></body></html>',
    };
  }

  // HTML 5xx Server Errors
  if (matchesPrefix(route, '/html-502')) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Bad Gateway</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-503')) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'text/html', 'Retry-After': '120' },
      body: '<html><body><h1>Service Unavailable</h1></body></html>',
    };
  }

  if (matchesPrefix(route, '/html-504')) {
    return {
      statusCode: 504,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body><h1>Gateway Timeout</h1></body></html>',
    };
  }

  // 4xx Client Errors
  if (matchesPrefix(route, '/400')) {
    return { statusCode: 400, body: 'Bad Request' };
  }

  if (matchesPrefix(route, '/401')) {
    return { statusCode: 401, body: 'Unauthorized' };
  }

  if (matchesPrefix(route, '/403')) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  if (matchesPrefix(route, '/405')) {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (matchesPrefix(route, '/406')) {
    return { statusCode: 406, body: 'Not Acceptable' };
  }

  if (matchesPrefix(route, '/408')) {
    return { statusCode: 408, body: 'Request Timeout' };
  }

  if (matchesPrefix(route, '/409')) {
    return { statusCode: 409, body: 'Conflict' };
  }

  if (matchesPrefix(route, '/410')) {
    return { statusCode: 410, body: 'Gone' };
  }

  if (matchesPrefix(route, '/429')) {
    return {
      statusCode: 429,
      headers: { 'Retry-After': '60' },
      body: 'Too Many Requests',
    };
  }

  // 5xx Server Errors
  if (matchesPrefix(route, '/503')) {
    return {
      statusCode: 503,
      headers: { 'Retry-After': '120' },
      body: 'Service Unavailable',
    };
  }

  if (matchesPrefix(route, '/502')) {
    return { statusCode: 502, body: 'Bad Gateway' };
  }

  if (matchesPrefix(route, '/504')) {
    return { statusCode: 504, body: 'Gateway Timeout' };
  }

  if (matchesPrefix(route, '/timeout')) {
    await new Promise((r) => setTimeout(r, 120_000));
    return { statusCode: 200, body: 'Late OK' };
  }

  if (matchesPrefix(route, '/no-response')) {
    await new Promise(() => {});
    return { statusCode: 200, body: 'Never returns' };
  }

  if (matchesPrefix(route, '/drop')) {
    return { statusCode: 444, body: '' };
  }

  return { statusCode: 200, body: 'OK' };
};
