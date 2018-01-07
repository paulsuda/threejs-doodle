
const test = require('ava');
const webdriver = require('selenium-webdriver');

test.beforeEach(t => {
  t.context.driver = new webdriver.Builder()
                        .forBrowser('chrome')
                        .usingServer('http://localhost:9515/')
                        .build();
});

test('webdriver webdriver', t => {
      let driver = t.context.driver;
      return driver.get('http://localhost:9000/#1').then(() => {
        return driver.wait(webdriver.until.titleIs('threejs-doodle'), 1000);
      }).then(() => {
        return driver.getTitle();
      }).then((title) => {
        t.is(title, "threejs-doodle");
        return driver.quit();
      });
});
