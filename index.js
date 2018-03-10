require('dotenv').config()
const express = require('express');
const app = express();
const axios = require('axios');
const search = require('youtube-search');//npm package


const opts = {
  maxResults: 1,
  key: process.env.VISION_KEY // 
}; //options

app.get('/', (req, res) => {
	res.json('ola');
})


app.get('/:id', (req, res) => {
	let query = req.params.id;
	search(query, opts, function(err, results) {
	  if(err) return console.log(err);
	  res.json(results[0].link);// output is link of search
	});
})




app.listen(9000);

//olena 
