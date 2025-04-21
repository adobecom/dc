/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import proxy from 'koa-proxies';
import { brotliDecompressSync, gunzipSync } from 'zlib';
import { readFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

export default {
  port: 3001,
  middleware: [
    proxy('/', {
      selfHandleResponse: true,
      target: 'http://localhost:3000/',
      logs: true,
      events: {
        proxyRes: async (proxyRes, req, res) => {
          const contentType = proxyRes.headers['content-type'] || '';

          // Only modify HTML content for compress-pdf URLs
          if (!contentType.includes('text/html')
            || !req.url.includes('/acrobat/online/')) {
            // For non-HTML content or non-frictionless-pdf URLs, preserve original headers and pipe
            Object.entries(proxyRes.headers).forEach(([key, value]) => {
              res.setHeader(key, value);
            });
            res.statusCode = proxyRes.statusCode;
            proxyRes.pipe(res);
            return;
          }

          const chunks = [];
          const encoding = proxyRes.headers['content-encoding'];

          // Load the injection content and styles
          const defaultContent = '<!-- Failed to load injection content -->';
          let htmlContent = defaultContent;
          let topPosition = defaultContent;
          let stylesContent = defaultContent;
          let blockContent = defaultContent;
          let miloStyles = defaultContent;
          try {
            const userAgent = req.headers['user-agent'] || '';
            const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
            const injectionFile = isMobile ? 'sign-pdf-mobile.json' : 'sign-pdf-desktop.json';

            // Fetch Milo styles
            const miloResponse = await fetch('https://www.adobe.com/libs/styles/styles.css');
            miloStyles = await miloResponse.text();

            const jsonContent = JSON.parse(readFileSync(join(process.cwd(), 'tools', 'prerender', injectionFile), 'utf8'));
            htmlContent = jsonContent.html;
            topPosition = jsonContent.top;
            stylesContent = readFileSync(join(process.cwd(), 'acrobat', 'styles', 'styles.css'), 'utf8');
            blockContent = readFileSync(join(process.cwd(), 'acrobat', 'blocks', 'verb-widget', 'verb-widget.css'), 'utf8');
          } catch (error) {
            console.error('Error reading/fetching files:', error);
            stylesContent = '';
            blockContent = '';
            miloStyles = '';
          }

          // Copy all headers except content-length and content-encoding
          Object.entries(proxyRes.headers).forEach(([key, value]) => {
            if (key.toLowerCase() !== 'content-length'
              && key.toLowerCase() !== 'content-encoding') {
              res.setHeader(key, value);
            }
          });

          proxyRes.on('data', (chunk) => {
            chunks.push(chunk);
          });

          proxyRes.on('end', () => {
            try {
              const buffer = Buffer.concat(chunks);
              res.statusCode = proxyRes.statusCode;

              let decompressedBody;

              // Decompress based on encoding using sync methods
              if (encoding === 'br') {
                decompressedBody = brotliDecompressSync(buffer);
              } else if (encoding === 'gzip') {
                decompressedBody = gunzipSync(buffer);
              } else {
                decompressedBody = buffer;
              }

              // Modify the HTML content
              const html = decompressedBody.toString().replace(
                '</head>',
                `<style id="inline-milo-styles">${miloStyles}</style>
                <style id="inline-dc-styles">${stylesContent}</style>
                <style id="inline-verb-widget-styles">${blockContent}</style>
                <style>#prerender_verb-widget { position: absolute; top: ${topPosition}; left: 0; width: 100%; z-index: -1; pointer-events: auto; }</style></head>`,
              ).replace(
                '<body>',
                `<body><div id="prerender_verb-widget">${htmlContent}</div>`,
              );

              // Send uncompressed content
              const finalBody = Buffer.from(html);
              res.setHeader('content-length', finalBody.length);
              res.end(finalBody);
            } catch (error) {
              console.error('Error processing response:', error);
              if (!res.headersSent) {
                // On error, copy original headers and pipe the response
                Object.entries(proxyRes.headers).forEach(([key, value]) => {
                  res.setHeader(key, value);
                });
                proxyRes.pipe(res);
              } else {
                res.end();
              }
            }
          });
        },
      },
    }),
  ],
};
