

const moduleList = [
  require('./20171129-1/script'),
  require('./20171129-2/script'),
];

function nextListen(nextFn){
  document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    console.log(keyName);
    nextFn();
  }, false);
}

function showIndex(rootEl, i){
  const viewModuleMain = moduleList[i];
  rootEl.innerHTML = '';
  return viewModuleMain(rootEl);
}

function main(rootEl) {
  let currentIndex = 0;
  const moduleCount = moduleList.length;
  showIndex(rootEl, currentIndex);
  nextListen(function(){
    currentIndex += 1;
    if(currentIndex >= moduleCount){
      currentIndex = 0;
    }
    showIndex(rootEl, currentIndex);
  });
}

module.exports = main;
