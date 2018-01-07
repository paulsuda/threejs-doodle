
const THREE = require('three');
const { showDescription, htmlMessage } = require('./shared/util');
const moduleList = require('./conf/moduleList');
const { getLocationModuleIndex, routeListenAndInit } = require('./shared/routes');
const gifshot = require('gifshot');


var _lastAnimationFrameRequestId = null;

function keyListen(callbackFn){
  document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    const stopKeys = ['Escape', 'q'];
    const nextKeys = [' ', 'Tab', 'n', ']'];
    const prevKeys = ['p', '['];
    if(stopKeys.includes(keyName)){
      callbackFn('stop');
    }
    else if(nextKeys.includes(keyName)){
      callbackFn('next');
    }
    else if(prevKeys.includes(keyName)){
      callbackFn('previous');
    }
    else{
      console.log('keyListen() unknown key', keyName);
    }
  }, false);
}

function setupShowIndex(rootEl, i, displayMessage){
  const viewModuleMain = moduleList[i];
  const urlIndex = moduleList.length - i - 1;
  rootEl.innerHTML = '';
  history.pushState({moduleIndex: i, urlIndex: urlIndex}, `page ${urlIndex}`, `#${urlIndex}`);
  if (displayMessage) {
    showDescription(rootEl, urlIndex, viewModuleMain);
  }
  /* Run the module. */
  const windowSize = [window.innerWidth, window.innerHeight];
  return viewModuleMain(rootEl, windowSize);
}

function getCanvasEl(rootEl){
  const el = rootEl.children[0];
  if(el.tagName !== "CANVAS"){
    throw new Error(`Element "${el.tagName}" should be <CANVAS> in getCanvasEl()`);
  }
  return el;
}

function captureMain(rootEl, i, width, height, timeIncrement, frameCount, skipFrames){
  console.log(`capturing index ${i}`);
  const animateHandler = setupShowIndex(rootEl, i, false);
  const frameDataList = [];
  const canvasEl = getCanvasEl(rootEl);
  const cycleFrames = skipFrames + 1;
  const frameTimeIncrement = cycleFrames * timeIncrement;
  const totalCount = frameCount * cycleFrames;
  for(let i = 0; i < totalCount; i++){
    const frameTime = timeIncrement * i;
    animateHandler(timeIncrement);
    const recordingFrame = Math.floor(i / cycleFrames) + 1;
    if(i % cycleFrames === 0){
      console.log(`capturing frame ${recordingFrame} of ${frameCount} at ${frameTime} seconds`);
      frameDataList.push(canvasEl.toDataURL());
    }
    else{
      console.log(`skipping recording of frame ${recordingFrame} + ${i % cycleFrames} of ${frameCount} at ${frameTime} seconds`);
    }
  }
  console.log('building GIF image...');
  htmlMessage(rootEl, 'Building image...');
  gifshot.createGIF({
    images: frameDataList,
    interval: frameTimeIncrement,
    numFrames: frameDataList.length,
    savedRenderingContexts: true, /* gets us canvas to work with */
    gifWidth: width,
    gifHeight: height,
  }, (obj) => {
    console.log('... done building GIF');
    if (obj.error) {
      throw new Error(`Save to GIF failed: ${obj.errorMsg}`);
    } else {
      const imgDataUrl = obj.image;
      htmlMessage(rootEl, `Done. Data URL size: ${imgDataUrl.length}`);
      var gifImage = new Image(width, height);
      gifImage.src = imgDataUrl;
      gifImage.classList.add('output');
      console.log('test', rootEl);
      rootEl.appendChild(gifImage);
      canvasEl.style.display = "none";
    }
  });
}

function showIndex(rootEl, i, displayMessage){
  console.log(`showing index ${i}`);
  const animateHandler = setupShowIndex(rootEl, i, displayMessage);
  /* Cancel any outstanding frame requests. */
  window.cancelAnimationFrame(_lastAnimationFrameRequestId);
  /* Request frames and run animateHandler() to render. */
  if(typeof(animateHandler) == 'function'){
    const c = new THREE.Clock();
    c.getDelta();
    const animate = function(){
      let frameTimeSec = c.getDelta();
      if(frameTimeSec < 0 || frameTimeSec > 0.5){
        console.log('Bad frametimesec', frameTimeSec);
        frameTimeSec = 0.05;
      }
      animateHandler(frameTimeSec);
      _lastAnimationFrameRequestId = window.requestAnimationFrame( animate );
    };
    _lastAnimationFrameRequestId = window.requestAnimationFrame( animate );
  }
  return;
}

function main(rootEl) {
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.has('capture')){
    const moduleIndex = getLocationModuleIndex(moduleList);
    const width = urlParams.get('w') || 320;
    const height = urlParams.get('h') || 240;
    const timeIncrement = parseFloat(urlParams.get('t')) || 0.1;
    const frameCount = parseInt(urlParams.get('n')) || 6;
    const skipFrames = parseInt(urlParams.get('s')) || 0;
    rootEl.classList.add('capture-mode');
    rootEl.style.width = `${width}px`;
    rootEl.style.height = `${height}px`;
    return captureMain(rootEl, moduleIndex, width, height, timeIncrement, frameCount, skipFrames);
  }
  else{
    rootEl.style.width = "auto";
    rootEl.style.height = "height";
    rootEl.classList.add('interactive-mode');
    return interactiveMain(rootEl);
  }
}

function interactiveMain(rootEl){
  let currentIndex = 0;
  const moduleCount = moduleList.length;

  routeListenAndInit(moduleList, function(newIndex){
    if(newIndex){
      currentIndex = newIndex;
    }
    showIndex(rootEl, currentIndex, false);
  });

  keyListen(function(actionName){
    if(actionName == 'next'){
      currentIndex += 1;
      if(currentIndex >= moduleCount){
        currentIndex = 0;
      }
    }
    else if(actionName == 'previous'){
      currentIndex -= 1;
      if(currentIndex < 0){
        currentIndex = (moduleCount - 1);
      }
    }
    else if(actionName == 'stop'){
      currentIndex = moduleCount - 1;
    }
    showIndex(rootEl, currentIndex, true);
  });

  return;
}

module.exports = main;
