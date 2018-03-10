require('dotenv').config()
const express = require('express');
const app = express();
const axios = require('axios');
const vision = require('node-cloud-vision-api')
vision.init({auth: process.env.VISION_KEY})

'use strict'

// init with auth

// construct parameters
const req = new vision.Request({
  image: new vision.Image('./bat.jpg'),
  features: [
    new vision.Feature('FACE_DETECTION', 4),
    new vision.Feature('LABEL_DETECTION', 10),
  ]
})

app.get('/', (request, res) => {
	vision.annotate(req).then((elem) => {
	  let ext = elem.responses[0].faceAnnotations[0];
	  let local = {
	  	detectionConfidence: ext.detectionConfidence,
	  	joy: ext.joyLikelihood,
	  	sorrow: ext.sorrowLikelihood,
	  	anger: ext.angerLikelihood,
	  	surprise: ext.surpriseLikelihood
	  }
	  res.json(local);
		}, (e) => {
	  	console.log('Error: ')
	})
})

app.listen(9000);