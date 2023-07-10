const express = require('express');
const { createProxyMiddleware, responseInterceptor  } = require('http-proxy-middleware');

const app = express();

app.use('/cdn', createProxyMiddleware({
  target: 'https://images.unsplash.com',
  changeOrigin: true,
  pathRewrite: {
    '^/cdn/': ''
  }
}));

app.use('/', createProxyMiddleware({
  target: 'https://unsplash.com',
  changeOrigin: true,
   selfHandleResponse: true,
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8'); 
    return response.replace(/https:\/\/images\.unsplash\.com/g, '/cdn');
  }),
}));


app.listen(3000, () => {
  console.log('Server started on port 3000');
});