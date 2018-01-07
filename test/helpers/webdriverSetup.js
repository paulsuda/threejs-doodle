
const webdriver = require('selenium-webdriver');

function webdriverSetup(t){
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .usingServer('http://localhost:9515/')
    .build();
  t.context.driver = driver;
}

module.exports = webdriverSetup;
