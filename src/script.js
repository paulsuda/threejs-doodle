

const moduleList = [
  require('./20171129-1/script'),
  require('./20171129-2/script'),
];

function main(rootEl) {
  const viewModuleMain = moduleList[0];
  return viewModuleMain(rootEl);
}

module.exports = main;
