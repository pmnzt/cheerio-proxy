const express = require('express');
const { createProxyMiddleware, responseInterceptor  } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'https://unsplash.com',
  changeOrigin: true,
   selfHandleResponse: true,
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8'); 
    return response.replace(/https?:\/\/(?:[^./]+\.)?unsplash\.com/gi, 'http://localhost:3000');
  }),
}));

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});