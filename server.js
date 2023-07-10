const express = require('express');
const app = express();

const cheerio = require('cheerio');
const axios = require('axios');

const path = require('path');
const url = require('url');


app.use('/', async (req, res) => {
	const url = `${req.originalUrl.substr(1)}`;

	try {
		const response = await axios.get(url);
   		const $ = cheerio.load(response.data);

   		$('a').each(function () {
   			const href = $(this).attr('href');

   			if(!href.startsWith('/')) {
   				const extractedUrl = `${req.protocol}://${req.get('host')}/${href}`;

   				const parsedUrl = new URL(extractedUrl);
				parsedUrl.pathname  = path.normalize(parsedUrl.pathname);
				const fixedUrl = parsedUrl.toString();

	   			$(this).attr('href', `${fixedUrl}`);
   			}  else {
   				const extractedUrl = `${req.protocol}://${req.get('host')}/${url}/${href}`;

   				const parsedUrl = new URL(extractedUrl);
				parsedUrl.pathname = path.normalize(parsedUrl.pathname);
				const fixedUrl = parsedUrl.toString();


				 $('meta[property="og:url"]').attr('content') || $('link[rel="canonical"]').attr('href') || response.config.url;
				 $(this).attr('href', `${fixedUrl}`);   				
   			} 			

   		});




   		$('img').each(function () {
   			const src = $(this).attr('src');

   			if(!src.startsWith('/')) {
   				const extractedUrl = `${req.protocol}://${req.get('host')}/${src}`;

   				const parsedUrl = new URL(extractedUrl);
				parsedUrl.pathname  = path.normalize(parsedUrl.pathname);
				const fixedUrl = parsedUrl.toString();

	   			$(this).attr('src', `${fixedUrl}`);
   			}  else {
   				const extractedUrl = `${req.protocol}://${req.get('host')}/${url}/${src}`;

   				const parsedUrl = new URL(extractedUrl);
				parsedUrl.pathname = path.normalize(parsedUrl.pathname);
				const fixedUrl = parsedUrl.toString();


				 $('meta[property="og:url"]').attr('content') || $('link[rel="canonical"]').attr('src') || response.config.url;
				 $(this).attr('src', `${fixedUrl}`);   				
   			} 			

   		});



   		res.send($.html());
	} catch (err) {
   		res.status(500).send(err.message);
	}
	
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});