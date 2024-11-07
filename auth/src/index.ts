import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

const app = new Hono().basePath('/auth');
app.use(logger());

app.get('/health', (c) => {
  return c.text('ok');
});

app.post('/register', (c) => {
  return c.json({
    message: 'User signed up successfully!',
  });
});

app.post('/login', (c) => {
  return c.json({
    message: 'User logged in successfully!',
  });
});

app.post('/refresh', (c) => {
  return c.json({
    message: 'Jwt refreshed successfully!',
  });
});

app.post('/logout', (c) => {
  return c.json({
    message: 'User logged out successfully!',
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
