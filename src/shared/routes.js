
function routeNameFromLocation(location){
  const hash = location.hash;
  // Remove the '#'
  const routeName = hash.substring(1);
  const routeIndex = parseInt(routeName);
  return routeIndex;
}

function getLocationModuleIndex(moduleList){
  const routeName = routeNameFromLocation(document.location);
  const routeIndex = parseInt(routeName);
  if((routeIndex >= 0) && (routeIndex < (moduleList.length + 1))){
    const moduleListIndex = moduleList.length - routeIndex - 1;
    return moduleListIndex;
  }
  throw new Error(`Couldn't find route "${routeName}"`);
}

function routeListenAndInit(moduleList, routeFn){
  function gotoLocation(){
    let routeIndex = 0;
    try {
      routeIndex = getLocationModuleIndex(moduleList);
    } catch(err) {
      console.error('err get location', err);
    }
    routeFn(routeIndex);
  }
  window.onpopstate = gotoLocation;
  gotoLocation();
}

module.exports = { routeListenAndInit, routeNameFromLocation, getLocationModuleIndex };
