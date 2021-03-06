# AT&T Hackathon - Mar. 2018 - IoT
[![Google](https://img.shields.io/badge/GOOGLEVISION-API-brightgreen.svg)](https://cloud.google.com/vision/)
[![DevLeague](https://img.shields.io/badge/DevLeague-Alumni-blue.svg)](https://www.devleague.com/)
[![PhilipsHue](https://img.shields.io/badge/PhilipsHue-IOT-green.svg)](https://www2.meethue.com/en-us)
[![AT&T](https://img.shields.io/badge/Hackathon-AT%26T-blue.svg)](https://twitter.com/attdeveloper)
* Best IoT App Overall - 2nd Place - Submission for Honolulu AT&T Hackathon 2018



## MoodLighting Team

* [Ella](https://github.com/ellamae0821) - [DevLeague](https://github.com/devleague)
* [Oksana](https://github.com/oksanaharris) - [DevLeague](https://github.com/devleague)
* [HyperKind](https://github.com/Hyperkind) - [DevLeague](https://github.com/devleague)
* [Joceln](https://github.com/jocelynsaysrawr) - [DevLeague](https://github.com/devleague)
* [Olena](https://github.com/op9674a) - [General Assembly](https://generalassemb.ly/)
* [Baseem](https://github.com/ba5eem) - [DevLeague](https://github.com/devleague)


## Demo UI Screenshot:
<img src="./img.png" width="450"/>

## About

* Are you in denial about how crappy you're feeling? Do you never realize when you're actually feeling good about or something or life in general? MoodLighting will let you know how you're doing when you're just not sure and just want to be at home with whatever the hell kind of feelings you're having. MoodLighting will also create the ambience to match how you feel.

## Approach

* MoodLighting was made with React, Google Vision API & YouTube API. Images are captured in intervals from video capture. The Google Vision API provide the user's emotion analysis. The user's emotion will determine and change the color of their light bulb and browser experience.

## MVP

* User should be able to capture an image of their face through their browser using React WebCam. The user's light bulb should change to the color associated with each mood.

## Stretch Goals Met

* Youtube Videos customized from your current emotional status

## Stretch Goals

* User will be able to customize their light preferences to reflect their matching moods. They will also have the option to further prompt the light to change to assist in adjusting their mood. For example, if the light turns red because they are angry, they have the option to change the light to their designated "calm" color such as blue. Additional prompts and APIs would allow the user to order their favorite Starbucks concoction or comfort meal, play their favorite mood associated songs, or show them some cat pics.

## Getting Started

```js
npm install 
npm start
```

## How to connect to your Philips HUE Light, a quick on/off example:

```js
const app = require('express')();
const axios = require('axios');

//Follow the steps here to get your unique username:
//https://www.developers.meethue.com/documentation/getting-started

const username = process.env.USERNAME;
const url = `http://192.168.0.2/api/${username}/lights/2/state`;

app.get('/on', (req, res) => {
	axios.put(url, {"on":true})
	.then(elem => {
		res.json('Light is ON: ');
	})
})

app.get('/off', (req, res) => {
	axios.put(url, {"on":false})
	.then(elem => {
		res.json('Light is OFF: ');
	})
})

app.listen(9000);
```

