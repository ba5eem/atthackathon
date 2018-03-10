
const express = require('express');
const router = express.Router();

// Connect and configure AWS
const AWS = require('aws-sdk');
const AWS = require('aws-sdk/global');
const S3 = require('aws-sdk/clients/s3');
AWS.config.update({region: 'us-east-1'});

// Uploads the image to an S3 bucket

const params = {
  Image: {
    S3Object: {
      Bucket: 'cs591-mean',
      Name: 'utest.jpg'
    }
  }
};

const rekognition = new AWS.Rekognition();

router.get('/', function(req, res, next) {
  rekognition.recognizeFace(params, function (err, data) {
    if (err) console.log(err, err.stack);
      else {
      name = data.screenshotFace[0].Name;
      id = data.screenshotFace[0].Urls[0].match(/nm(.*)/)[0]; /
      res.send(name)
    }
  });
});


module.exports = router;