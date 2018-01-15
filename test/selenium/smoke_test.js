
const test = require('ava');
const webdriver = require('selenium-webdriver');
const { initWebdriverTests } = require('../helpers/webdriverSetup');

initWebdriverTests(test);

test('default page loads with title', t => {
  let driver = t.context.driver;
  return driver.get('http://localhost:9000/').then(() => {
    return driver.wait(webdriver.until.titleIs('threejs-doodle'), 1000);
  }).then(() => {
    return driver.getTitle();
  }).then((title) => {
    t.is(title, "threejs-doodle");
  });
});

test('no 8 loads in capture mode w no errors', t => {
  const runForSeconds = 4;
  const driver = t.context.driver;
  return driver.get('http://localhost:9000/#8?capture=1').then(() => {
    return driver.sleep(runForSeconds * 1000);
  }).then(() => {
    t.pass();
  });
});

test('no 10 loads and runs in interactive mode w no errors', t => {
  const runForSeconds = 4;
  const driver = t.context.driver;
  return driver.get('http://localhost:9000/#10').then(() => {
    return driver.sleep(runForSeconds * 1000);
  }).then(() => {
    t.pass();
  });
});
