const {Builder, By, Key, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

(async function example() {
  const userName = 'vkovtun';
  const key = 'fd33af29-4be5-46d4-8b2b-d96b9c9da4a1';
  const url = 'http://' + userName + ':' + key + '@ondemand.saucelabs.com:80/wd/hub';
  const driver = new webdriver.Builder()
      .forBrowser('firefox')
      .usingServer(url)
      .setFirefoxOptions(firefox)
      .build();
  try {
      await driver.get("https://andreidbr.github.io/JS30/");
      await driver.findElement(By.xpath('/html/body/div[2]/div[1]')).click();
      await(until.titleIs('JS30: 01 Drums'), 1000);

//      await driver.get('http://www.google.com');
//      await driver.findElement(By.name('q')).click();
//      await driver.sendKeys('webdriver', Key.RETURN);
//      await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
//        driver.close();
      await driver.quit();
  }
})();
