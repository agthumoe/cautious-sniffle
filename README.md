# Mock Server (Netlify)

Mock error conditions using Netlify Functions.

## Endpoints

All endpoints are under `/api`.

Each endpoint also supports additional path segments (prefix match). Example: `/api/503/what/ever/behind` returns `503`.

- `GET /api/404`
- `GET /api/500`
- `GET /api/503`
- `GET /api/502`
- `GET /api/504`
- `GET /api/timeout` (delays 120 seconds)
- `GET /api/drop` (returns status 444)
- `GET /api/` (returns 200 OK)

## Local development

1. Install dependencies:

   ```sh
   npm install
   ```

2. Run locally:

   ```sh
   npm run dev
   ```

3. Test (example):

   ```sh
   curl -i http://localhost:8888/api/503
   ```

## Deploy

- Preview deploy:

  ```sh
  npm run deploy
  ```

- Production deploy:

  ```sh
  npm run deploy:prod
  ```
