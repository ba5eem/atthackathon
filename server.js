
require('dotenv').config();
const express         = require('express');
const router          = express.Router();
const bodyParser      = require('body-parser');
const app             = express();
const PORT            = process.env.PORT || 8080;
const axios = require('axios');
const vision = require('node-cloud-vision-api');
vision.init({auth: process.env.VISION_KEY});

var fs = require('fs');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

//LIGHTS STUFF HERE
const hue = require('node-hue-api');
const HueApi = hue.HueApi;
const lightState = hue.lightState;
const hostname = "10.172.61.40";
const username = "AT42ej27YdL6uup75sU1khX8HTfsfwxjc1QUkkBM";

var api = new HueApi(hostname, username);

app.use(bodyParser.urlencoded({ extended: false }))

function getStats(param){
  let score;
  if(param === 'VERY_LIKELY'){ score = 100; }
  if(param === 'LIKELY'){ score = 90; }
  if(param === 'POSSIBLE'){ score = 80; }
  if(param === 'UNLIKELY'){ score = 30; }
  if(param === 'VERY_UNLIKELY'){ score = 20; }
  if(param === 'UNKNOWN'){ score = 0; }
  return score;
}

// app.post("/api/load", (request, res) => {
//   console.log('aldkfjlaksdj', request.body)

// });

app.post('/api/analyze', upload.single('capturedImage'), (request, res) => {

  console.log('running post / on server');

  var base64Data = request.body.capturedImage;
  base64Data = base64Data.replace(/^data:image\/jpeg;base64,/, "");

  console.log('writing file...');

  return new Promise((resolve, reject) => {
    fs.writeFile(__dirname + "/upload/out.jpeg", base64Data, 'base64', function(err) {
      if (err) console.log(err);
      fs.readFile(__dirname + "/upload/out.jpeg", function(err, data) {
        if (err) throw err;
        console.log('reading file...', data.toString('base64'));
        return resolve(data);
        });
    });
  })
  .then((file) => {

    let newImage = './upload/out.jpeg';

    const visionReq = new vision.Request({
      image: new vision.Image(newImage),
      features: [
      new vision.Feature('FACE_DETECTION', 4),
      new vision.Feature('LABEL_DETECTION', 10),
      ]
    });

    return vision.annotate(visionReq).then((elem) => {
      console.log('this is coming back from Google Vision', elem);
      let ext = elem.responses[0].faceAnnotations[0];
      let joy = getStats(ext.joyLikelihood);
      let sorrow = getStats(ext.sorrowLikelihood);
      let anger = getStats(ext.angerLikelihood);
      let surprise = getStats(ext.surpriseLikelihood);

      let label_results = elem.responses[0].labelAnnotations;

      // console.log('label results', label_results);

      let foundClown = label_results.some(labelObj => {
        return labelObj.description === 'clown';
      });

      console.log('foundClown', foundClown);

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
        highest: undefined,
        clown: undefined
      }];

      let obj = analysis[0]; // emotion object
      let highest = Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
      analysis[3].highest = highest;
      analysis[3].clown = foundClown;

      // console.log('THIS IS ANALYSIS', analysis);

      // res.json(analysis);
      return analysis;
    })
    .then((analysis) => {
      console.log ('ANALYSIS in the next then', analysis);

    //   var state = lightState.create();

    //   // Set light state to 'on' first
    //   api.setLightState(5, state.on())
    //     .then(displayResult)
    //     .done();


    //   var mood = analysis.highest;

    //   switch (mood){

    //     case "surprise":
    //       state.hsl(17000/182, 180/2.55, 255/2.55);
    //       console.log("turn yellow");

    //     case "joy":
    //       state.hsl(28/182, 129/2.55, 255/2.55);
    //       console.log("turn pink");

    //     case "anger":
    //       state.hsl(1000/182, 190/2.55, 255/2.55);
    //       console.log("turn red");

    //     case "sorrow":
    //       state.hsl(45000/182, 255/2.55, 255/2.55);
    //       console.log("turn blue");
    //     default:
    //       state.hsl(28/182, 129/2.55, 255/2.55);
    //       console.log("default - joy");
    //   }

    //   //change the color
    //    api.setLightState(5, state)
    //      .then(displayResult)
    //      .done();

      res.end();

    })
    .catch(error => {
      console.log('there is an error', error);
    });
  });
});


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