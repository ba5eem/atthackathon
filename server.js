
require('dotenv').config();
const express         = require('express');
const router          = express.Router();
const bodyParser      = require('body-parser');
const app             = express();
const PORT            = process.env.PORT || 8080;
const axios = require('axios');
const vision = require('node-cloud-vision-api');
vision.init({auth: process.env.VISION_KEY})

//LIGHTS STUFF HERE
const hue = require('node-hue-api');
const HueApi = hue.HueApi;
const lightState = hue.lightState;
const hostname = "192.168.2.2";
const username = "AT42ej27YdL6uup75sU1khX8HTfsfwxjc1QUkkBM";

var api = new HueApi(hostname, username)


//TEMPORARY IMAGE
const image = './sorrow.jpg'; // or image save from front-end



const visionReq = new vision.Request({
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
    let ext = elem.responses[0].faceAnnotations[0];
    let joy = getStats(ext.joyLikelihood);
    let sorrow = getStats(ext.sorrowLikelihood);
    let anger = getStats(ext.angerLikelihood);
    let surprise = getStats(ext.surpriseLikelihood);

    let analysis = [{
        detectionConfidence: ext.detectionConfidence * 100 +'%',
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
        highest: undefined
      }]
    let obj = analysis[0]; // emotion object
    let highest = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
    analysis[3].highest = highest;
    res.json(analysis); // .then(analysis) then POST
    }, (e) => {
      console.log('Error: ')
  })
})

app.post('/changeColor', function(req, res){
  var state = lightState.create();

  // Set light state to 'on' first
  api.setLightState(5, state.on())
    .then(displayResult)
    .done();

  if (req.body.highest){
    var mood = req.body.highest;
    if(id == "surprise"){
      state.hsl(17000/182, 180/2.55, 255/2.55);
      console.log("turn yellow");

    } else if(id == "joy"){
      state.hsl(28/182, 129/2.55, 255/2.55);
      console.log("turn pink");

    }  else if(mood == "anger"){
      state.hsl(1000/182, 190/2.55, 255/2.55);
      console.log("turn red");

    } else if(mood == "sorrow"){
      state.hsl(45000/182, 255/2.55, 255/2.55);
      console.log("turn blue");
    }
  }
  //change the color
   api.setLightState(5, state)
     .then(displayResult)
     .done();

  res.end();

});


app.get('*', ( req, res ) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


const server = app.listen(PORT,() => {
  console.log(`Server connected on PORT: ${PORT}`);
});