
const THREE = require('three');

const moduleList = [
  require('./20171215-1/script'),
  require('./20171214-1/script'),
  require('./20171208-1/script'),
  require('./20171207-1/script'), // 10
  require('./20171206-1/script'),
  require('./20171202-3/script'),
  require('./20171202-2/script'),
  require('./20171202-1/script'),
  require('./20171201-2/script'), // 5
  require('./20171201-1/script'),
  require('./20171129-1/script'),
  require('./20171128-2/script'),
  require('./20171128-1/script'), // 1
  require('./stopped'),
];

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

function routeNameFromLocation(location){
  const hash = location.hash;
  // Remove the '#'
  const routeName = hash.substring(1);
  const routeIndex = parseInt(routeName);
  return routeIndex;
}

function handleLocation(){
  const routeName = routeNameFromLocation(document.location);
  const routeIndex = parseInt(routeName);
  if((routeIndex >= 0) && (routeIndex < (moduleList.length + 1))){
    const moduleListIndex = moduleList.length - routeIndex - 1;
    return moduleListIndex;
  }
  return null;
}

function routeListenAndInit(moduleList, routeFn){
  function gotoLocation(){
    const routeIndex = handleLocation();
    routeFn(routeIndex);
  }
  window.onpopstate = gotoLocation;
  gotoLocation();
}

var _lastAnimationFrameRequestId = null;

function showIndex(rootEl, i){
  console.log(`showing index ${i}`, moduleList);
  const viewModuleMain = moduleList[i];
  const urlIndex = moduleList.length - i - 1;
  rootEl.innerHTML = '';
  history.pushState({moduleIndex: i, urlIndex: urlIndex}, `page ${urlIndex}`, `#${urlIndex}`);
  /* Run the module. */
  const windowSize = [window.innerWidth, window.innerHeight];
  const animateHandler = viewModuleMain(rootEl, windowSize);
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
  let currentIndex = 0;
  const moduleCount = moduleList.length;

  routeListenAndInit(moduleList, function(newIndex){
    if(newIndex){
      currentIndex = newIndex;
    }
    showIndex(rootEl, currentIndex);
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
    showIndex(rootEl, currentIndex);
  });

  return;
}

module.exports = main;
