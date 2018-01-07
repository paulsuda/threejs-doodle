
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
    const routeIndex = getLocationModuleIndex(moduleList);
    routeFn(routeIndex);
  }
  window.onpopstate = gotoLocation;
  gotoLocation();
}

module.exports = { routeListenAndInit, routeNameFromLocation, getLocationModuleIndex };
