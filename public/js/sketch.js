// const density = 'Ñ@#W$9876543210?!abc;:+=-,._                    ';

if(confirm("Do you allow this feature to access your webcam ?")){
  const density = "Ñ@#W$OXV?!ox*^+-,.'                  ";
  let divAscii;

  function setup() {
    noCanvas();
    video = createCapture(VIDEO);
    video.size(52,39); // (64,48) => 85%
    video.hide();
    divAscii = createDiv().parent("camfilter");
    // captureButton = createButton('Capture Image').parent("filterInterface");
    // captureButton.mousePressed(capImage);
  }

  function draw() {
    background(0);
    video.loadPixels();
    let asciiImage = "";
    for(let j=0; j<video.height ;j++){
      for(let i=0; i<video.width ;i++){
        const pixelIndex = (i + j * video.width) * 4;
        const r = video.pixels[pixelIndex + 0];
        const g = video.pixels[pixelIndex + 1];
        const b = video.pixels[pixelIndex + 2];
        avgr = (r + g + b) / 3;
        const len = density.length;
        const charindex = floor(map(avgr,0,255,len,0));
        const c = density.charAt(charindex);
        if(c == " "){
          asciiImage += "&nbsp;";
        }else{
          asciiImage += c;
        }
      }
      asciiImage += '<br/>'
    }
    divAscii.html(asciiImage);
  }
}else{
  document.getElementById("camfilter").innerHTML = "Webcam access blocked";
  document.getElementById("camfilter").style.padding = "15px 0"
}


