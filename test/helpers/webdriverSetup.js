
const webdriver = require('selenium-webdriver');

function webdriverSetup(t){
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .usingServer('http://localhost:9515/')
    .build();
  t.context.driver = driver;
}

function webdriverCleanUp(t){
  t.context.driver.manage().logs().get("browser").then((messages) => {
    messages.forEach((message) => {
      if(message.level.name == 'SEVERE'){
        t.fail(`Console errors found "${message.message}"`);
      }
    });
  });
  return t.context.driver.quit();
}

function initWebdriverTests(test){
  test.beforeEach(webdriverSetup);
  test.afterEach(webdriverCleanUp);
}

module.exports = {
  webdriverSetup, webdriverCleanUp, initWebdriverTests
};
