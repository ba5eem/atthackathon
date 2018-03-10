
require('dotenv').config();
const express         = require('express');
const router          = express.Router();
const bodyParser      = require('body-parser');
const app             = express();
const PORT            = process.env.PORT || 8080;
const axios = require('axios');
const vision = require('node-cloud-vision-api');
vision.init({auth: process.env.VISION_KEY})

let image;

// const req = new vision.Request({
//   image: new vision.Image(image),
//   features: [
//     new vision.Feature('FACE_DETECTION', 4),
//     new vision.Feature('LABEL_DETECTION', 10),
//   ]
// })

app.use(bodyParser.urlencoded({ extended: false }))

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

app.post("/api/load", (request, res) => {
  console.log('aldkfjlaksdj', request.body)
  
});

app.get('/', (request, res) => {
  console.log(request.body)
  image = request.body;

  const req = new vision.Request({
  image: new vision.Image(image),
  features: [
    new vision.Feature('FACE_DETECTION', 4),
    new vision.Feature('LABEL_DETECTION', 10),
  ]
})

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
    res.json(analysis);
    }, (e) => {
      console.log('Error: ')
  })
})

app.get('*', ( req, res ) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


const server = app.listen(PORT,() => {
  console.log(`Server connected on PORT: ${PORT}`);
});