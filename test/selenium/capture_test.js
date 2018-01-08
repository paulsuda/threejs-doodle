
const fs = require('fs');
const padStart = require('string.prototype.padStart');
const path = require('path');
const queryString = require('query-string');
const test = require('ava');
const webdriver = require('selenium-webdriver');
const { initWebdriverTests } = require('../helpers/webdriverSetup');

initWebdriverTests(test);

function testCapture(t, captureIndex, captureQueryOptions, options){
  const { captureTimeout, saveCapturePath } = Object.assign({
    captureTimeout: 8000,
    saveCapturePath: './docs/gif-captures/',
  }, options);
  const captureQueryParams = Object.assign({
    capture: 'true',
  }, captureQueryOptions);
  const captureQueryString = queryString.stringify(captureQueryParams);
  let driver = t.context.driver;
  return driver.get(`http://localhost:9000/?${captureQueryString}#${captureIndex}`).then(() => {
    return driver.wait(webdriver.until.elementLocated(webdriver.By.css('img.output')), captureTimeout);
  }).then(() => {
    return driver.findElements(webdriver.By.css('img.output'));
  }).then((outputImgList) => {
    t.is(outputImgList.length, 1);
    const outputImg = outputImgList[0];
    return Promise.all([
      outputImg.getCssValue('width'),
      outputImg.getCssValue('height'),
      outputImg.getAttribute('src'),
    ]);
  }).then(([imgWidth, imgHeight, imgBase64Src]) => {
    t.is(imgBase64Src.slice(0, 22), 'data:image/gif;base64,');
    const imgBase64 = imgBase64Src.slice(22, -1);
    const saveName = `no${padStart(captureIndex, 6, '0')}-w${imgWidth}-h${imgHeight}.gif`;
    const savePathName = path.join(saveCapturePath, saveName);
    let imgDataBuffer = new Buffer(imgBase64, 'base64');
    return new Promise(resolve => fs.writeFile(savePathName, imgDataBuffer, resolve));
  });
}

test('Capturing no. 8', t => {
  return testCapture(t, 8);
});
