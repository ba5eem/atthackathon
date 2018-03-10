(function(){
  // const constraints = {
  //   video: true
  // };
  const video = document.querySelector('#screenshot-video');
  const img = document.querySelector('#screenshot-img');
  const startButton = document.querySelector('#start');
  const screenshotButton = document.querySelector('#screenshot');
  
  const canvas = document.createElement('canvas');
  
  const constraints = {
    video: { width: { exact: 640 }, height: { exact: 480 } }
  }
  
  screenshotButton.onclick = video.onclick = function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    // Other browsers will fall back to image/png
    img.src = canvas.toDataURL('image/webp');
  };

  setInterval(function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    // Other browsers will fall back to image/png
image/jpeg');
    console.log(img.src)
    // let oReq = new XMLHttpRequest();
    // oReq.open("GET", "http://www.example.org/example.txt");
    // oReq.send();

    // var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
    // saveAs(blob, "hello world.txt");

    // canvas.toBlob(function (blob) {
    //   saveAs(blob, "pretty image.png");
    // });

  }, 5  
  function handleSuccess(stream) {
    video.srcObject = stream;
  }
  
  function handleError(error) {
    console.error('Reeeejected!', error);
  }
  
  navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
      // navigator.mediaDevices.getUserMedia(vgaConstraints, handleSuccess, handleError);
})();
