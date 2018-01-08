
const test = require('ava');
const webdriver = require('selenium-webdriver');
const { initWebdriverTests } = require('../helpers/webdriverSetup');

initWebdriverTests(test);

test('page loads with title', t => {
  let driver = t.context.driver;
  return driver.get('http://localhost:9000/#1').then(() => {
    return driver.wait(webdriver.until.titleIs('threejs-doodle'), 1000);
  }).then(() => {
    return driver.getTitle();
  }).then((title) => {
    t.is(title, "threejs-doodle");
  });
});
