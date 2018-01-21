const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const queryString = require('query-string');
const webdriver = require('selenium-webdriver');


function compileFavicon(t, no){
  return new Promise((resolve, reject) => {
    const cmd = [
      'convert',
      `docs/gif-captures/no${no}-w64px-h64px.gif`,
      `docs/gif-captures/no${no}-w32px-h32px.gif`,
      `docs/gif-captures/no${no}-w24px-h24px.gif`,
      `docs/gif-captures/no${no}-w16px-h16px.gif`,
      'docs/favicon.ico'
    ].join(' ');
    t.log(`Building favicon.ico "${cmd}"`);
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(`Exec could not run ${cmd}. Is imagemagick installed?`);
      }
      if(stdout){
        t.log(`STDOUT: ${stdout}`);
      }
      if(stderr){
        t.log(`STDERR: ${stderr}`);
      }
      resolve('Favicon built.');
    });
  });
}

function testFetch(t, captureIndex, captureQueryOptions, _options){
  const driver = t.context.driver;
  const captureQueryString = queryString.stringify(captureQueryOptions);
  const captureUrl = `http://localhost:9000/?${captureQueryString}#${captureIndex}`;
  t.log(`capturing ${captureUrl}`);
  return driver.get(captureUrl);
}

function testDryRun(t, captureIndex, captureQueryOptions, options){
  const driver = t.context.driver;
  const captureQueryParams = Object.assign({
    capture: 'true',
    dryRun: 'true'
  }, captureQueryOptions);
  const { runForSeconds } = Object.assign({
    runForSeconds: 4,
  }, options);
  return testFetch(t, captureIndex, captureQueryParams, options).then(() => {
    return driver.sleep(runForSeconds * 1000);
  }).then(() => {
    t.pass();
    return;
  });
}

function testCapture(t, captureIndex, captureQueryOptions, options){
  const driver = t.context.driver;

  const { captureTimeout, saveCapturePath } = Object.assign({
    captureTimeout: 8000,
    saveCapturePath: './docs/gif-captures/',
  }, options);
  const captureQueryParams = Object.assign({
    capture: 'true',
    w: 320,
    h: 240,
  }, captureQueryOptions);
  const saveName = `no${captureIndex}-w${captureQueryParams.w}-h${captureQueryParams.h}.gif`;
  const savePathName = path.join(saveCapturePath, saveName);
  if (fs.existsSync(savePathName)) {
    console.log(`Dry run with "${savePathName}", file already exists`);
    return testDryRun(t, captureIndex, captureQueryOptions, options);
  }
  return testFetch(t, captureIndex, captureQueryParams, options).then(() => {
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
    t.is(captureQueryParams.w, imgWidth);
    t.is(captureQueryParams.h, imgHeight);
    t.is(imgBase64Src.slice(0, 22), 'data:image/gif;base64,');
    const imgBase64 = imgBase64Src.slice(22, -1);
    let imgDataBuffer = new Buffer(imgBase64, 'base64');
    return new Promise(resolve => fs.writeFile(savePathName, imgDataBuffer, resolve));
  });
}

module.exports = { testCapture, compileFavicon };
