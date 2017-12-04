
const moduleList = [
  require('./20171202-3/script'),
  require('./20171202-2/script'),
  require('./20171202-1/script'),
  require('./20171201-2/script'),
  require('./20171201-1/script'),
  require('./20171129/script'),
  require('./20171128-2/script'),
  require('./20171128-1/script'),
];

function nextKeyListen(nextFn){
  document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    const nextKeys = [' ', 'Tab', 'Escape', 'n'];
    if(nextKeys.includes(keyName)){
      nextFn();
    }
    else{
      console.log(keyName);
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
  if((routeIndex >= 1) && (routeIndex < (moduleList.length + 1))){
    const moduleListIndex = moduleList.length - routeIndex;
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

function showIndex(rootEl, i){
  const viewModuleMain = moduleList[i];
  const urlIndex = moduleList.length - i;
  rootEl.innerHTML = '';
  history.pushState({moduleIndex: i, urlIndex: urlIndex}, `page ${urlIndex}`, `#${urlIndex}`)
  return viewModuleMain(rootEl);
}

function main(rootEl) {
  let currentIndex = 0;
  const moduleCount = moduleList.length;
  console.log(document.location);

  routeListenAndInit(moduleList, function(newIndex){
    if(newIndex){
      currentIndex = newIndex;
    }
    showIndex(rootEl, currentIndex);
  });

  nextKeyListen(function(){
    currentIndex += 1;
    if(currentIndex >= moduleCount){
      currentIndex = 0;
    }
    showIndex(rootEl, currentIndex);
  });

  return;
}

module.exports = main;
