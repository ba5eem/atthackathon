require('dotenv').config()
const express = require('express');
const app = express();
const axios = require('axios');
const search = require('youtube-search');
const API_KEY = process.env.VISION_KEY;


var opts = {
  maxResults: 10,
  key: 'yourkey'
};


app.get('/', (req, res) => {
	// youtube api

	res.json('ola');
})




app.listen(9000);