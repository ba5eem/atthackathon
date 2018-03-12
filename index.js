require('dotenv').config()
const express = require('express');
const app = express();
const axios = require('axios');
const vision = require('node-cloud-vision-api')
vision.init({auth: process.env.VISION_KEY})
const search = require('youtube-search');//npm package



//YOUTUBE CODE:
const uTubeOpts = {
  maxResults: 1,
  key: process.env.VISION_KEY // 
}; //options
//

const image = './bat.jpg'; // or image save from front-end

const req = new vision.Request({
  image: new vision.Image(image),
  features: [
    new vision.Feature('FACE_DETECTION', 4),
    new vision.Feature('LABEL_DETECTION', 10),
  ]
})

function getStats(param){
	let score;
	if(param === 'VERY_LIKELY'){ score = 100 }
	if(param === 'LIKELY'){ score = 90 }
	if(param === 'POSSIBLE'){ score = 80 }
	if(param === 'UNLIKELY'){ score = 30 }
	if(param === 'VERY_UNLIKELY'){ score = 20 }	
	if(param === 'UNKNOWN'){ score = 0 }
	return score;
}

app.get('/', (request, res) => {
	vision.annotate(req).then((elem) => {
		console.log(elem.responses[0]);
	  let ext = elem.responses[0].faceAnnotations[0];
	  let joy = getStats(ext.joyLikelihood);
	  let sorrow = getStats(ext.sorrowLikelihood);
	  let anger = getStats(ext.angerLikelihood);
	  let surprise = getStats(ext.surpriseLikelihood);
	  let analysis = [{
		  	joy: joy,
		  	sorrow: sorrow,
		  	anger: anger,
		  	surprise: surprise,
	  	},{
		  	VERY_LIKELY: 100,
		  	LIKELY: 90,
		  	POSSIBLE: 80,
		  	UNLIKELY: 30,
		  	VERY_UNLIKELY: 20,
		  	UNKNOWN: 0
	  	},{
		  	joy: 'pink/yellow', 
		  	sorrow: 'blue/grey',
		  	anger: 'red/purple',
		  	suprised: 'yellow'
	  	},{
	  		highest: undefined,
	  		video: undefined
	  	}]
	  let obj = analysis[0]; // emotion object

	  let highest = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
	  analysis[3].highest = highest;
		//video search done here from highest emotion
			search(highest, uTubeOpts, (err, response) => {
				console.log(highest);
				if(err){ console.log('error with youtube') }
				analysis[3].video = response[0].link;
				res.json(analysis); // return of analysis object including youtube video link
			})
		}, (e) => {
	  	console.log('Error: ')
	})
})

app.listen(9000);