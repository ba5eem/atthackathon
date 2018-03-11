import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
import { Button, Well, Image } from 'react-bootstrap';
import YouTube from 'react-youtube';
import Webcam from 'react-webcam';
import Particles from 'react-particles-js';



const url = 'http://localhost:9000/recogs';
const opts = {
      height: '300',
      width: '340',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { 
      file: '',
      url: 'http://via.placeholder.com/350x150',
      obj: undefined,
      emoColor: 'black',
      videoUrl: undefined,
      clown: false
    }
  }
  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    var formData = new FormData();
    formData.append('capturedImage', imageSrc);
    axios.post(url, formData)
    .then(img => {
      console.log(img);
      this.setState({
        emoColor: img.data[3].highest,
        videoUrl: img.data[3].video,
        clown: img.data[3].clown

      })
    })
  };

  render() {
    const {url,emoColor} = this.state;
    let color;
    let logo = 'sss'
    if(emoColor === 'joy'){ color = 'pink'; }
    if(emoColor === 'sorrow'){ color = 'grey'; }
    if(emoColor === 'anger'){ color = 'red'; }
    if(emoColor === 'surprise'){ color = 'purple'; }

    return (
      <div className="wrapper-option">
        <Well>
          <div className="wrapper">
          
              <div className="options-img">
                <Webcam
                  audio={false}
                  height={350}
                  ref={this.setRef}
                  screenshotFormat="image/jpeg"
                  width={350}/>

                  <h1>FACEMOTING</h1>
                  <Particles 
              params={{
                particles: {
                  line_linked: {
                    shadow: {
                      enable: true,
                      color: "#3CA9D1",
                      blur: 5
                    }
                  }
                }
              }}
              style={{
                width: '100%',
                backgroundImage: `url(${logo})` 
              }}
            />
              </div>
              <Button bsStyle="success" onClick={this.capture}>Capture photo</Button>
            </div>
          </Well>

          <div className="hue-wrapper">
            <div className="feature" style={{marginRight: 20, textAlign: 'center'}}>
              <h2>Philips Hue Bridge Integration</h2>
              <div style={{backgroundColor: color}}className="lights"></div>
            </div>

            <div className="feature" style={{marginRight: 20, textAlign: 'center'}}>
              <h2>YouTube Api Integration</h2>
              <YouTube
              videoId={this.state.videoUrl}
              opts={opts}
              onReady={this._onReady}
              />
            </div>
            
            
          </div>
          <div className="youtube-wrapper">
            
          </div>
          {this.state.clown && 
            <div className="clown">
              <img src="https://cdn.drawception.com/images/panels/2012/12-22/sYSHGDgwHy-2.png" alt=""/>
            </div>}
            <button onClick={(e)=>this.setState({clown: true})}>clown</button>

      </div>
    );
  }
}

export default App;