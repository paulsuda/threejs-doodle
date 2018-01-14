
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
    if(messages.length >= 1){
      console.log('Webdriver Console:', messages);      
    }
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
