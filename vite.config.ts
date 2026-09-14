import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function driveProxyPlugin(): Plugin {
  return {
    name: 'drive-download-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/drive-download')) {
          try {
            const urlObj = new URL(req.url, 'http://localhost:3000');
            const id = urlObj.searchParams.get('id');
            if (!id) {
              res.statusCode = 400;
              res.end('Missing file id');
              return;
            }

            const driveUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
            const driveRes = await fetch(driveUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              }
            });

            if (!driveRes.ok) {
              res.statusCode = driveRes.status;
              res.end('Failed to fetch from Google Drive');
              return;
            }

            const contentType = driveRes.headers.get('content-type') || 'application/pdf';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');

            const arrayBuffer = await driveRes.arrayBuffer();
            res.end(Buffer.from(arrayBuffer));
          } catch (err) {
            console.error('Drive proxy error:', err);
            res.statusCode = 500;
            res.end('Internal proxy error');
          }
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), driveProxyPlugin()],
  server: {
    port: 3000,
    open: true,
  },
});
