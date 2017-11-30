

const moduleList = [
  require('./20171129/script'),
  require('./20171128-1/script'),
  require('./20171128-2/script'),
];

function nextListen(nextFn){
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
