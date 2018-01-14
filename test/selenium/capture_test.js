
const fs = require('fs');
const path = require('path');
const queryString = require('query-string');
const test = require('ava');
const webdriver = require('selenium-webdriver');
const { initWebdriverTests } = require('../helpers/webdriverSetup');

initWebdriverTests(test);

function testCapture(t, captureIndex, captureQueryOptions, options){
  const driver = t.context.driver;
  const { captureTimeout, saveCapturePath } = Object.assign({
    captureTimeout: 8000,
    saveCapturePath: './docs/gif-captures/',
  }, options);
  const captureQueryParams = Object.assign({
    capture: 'true',
  }, captureQueryOptions);
  const captureQueryString = queryString.stringify(captureQueryParams);
  const captureUrl = `http://localhost:9000/?${captureQueryString}#${captureIndex}`;
  t.log(`capturing ${captureUrl}`);
  return driver.get(captureUrl).then(() => {
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
    const saveName = `no${padStart(captureIndex, 4, '0')}-w${imgWidth}-h${imgHeight}.gif`;
    const savePathName = path.join(saveCapturePath, saveName);
    let imgDataBuffer = new Buffer(imgBase64, 'base64');
    return new Promise(resolve => fs.writeFile(savePathName, imgDataBuffer, resolve));
  });
}

test('no 16 high quality', t => {
  return testCapture(t, 16,
    { w: 640, h: 480, t: 0.03, n: 204, s: 2 },
    { captureTimeout: 3 * 60 * 1000 });
});

test('no 16 med quality', t => {
  return testCapture(t, 16,
    { w: 480, h: 360, t: 0.03, n: 204, s: 2 },
    { captureTimeout: 3 * 60 * 1000 });
});

test('no 8 w defaults', t => {
  return testCapture(t, 8);
});
