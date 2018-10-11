const {By, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

module.exports = {

    getWebDriver: function () {
        // email: "dazuyopuho@bit2tube.com"
        // name: "tester-tib"
        // pass: "slidewiki2test"

        //    const userName = 'vkovtun';
        //    const key = 'fd33af29-4be5-46d4-8b2b-d96b9c9da4a1';
        //    const url = 'http://' + userName + ':' + key + '@ondemand.saucelabs.com:80/wd/hub';
        //    const driver = new webdriver.Builder().forBrowser('firefox').usingServer(url).setFirefoxOptions(firefox).build();

        return new webdriver.Builder().forBrowser('firefox').usingServer('http://localhost:4444/wd/hub')
                .setFirefoxOptions(firefox).build();
    },

    findElement: function (driver, locator) {
        return driver.findElement(locator);
    },

    waitForElement: function(driver, locator) {
        return driver.wait(until.elementLocated(locator), 10000);
    },

    waitForElementVisible: function (driver, element) {
        return driver.wait(until.elementIsVisible(element), 10000);
    },

    login: async function (driver) {
        const loginEmail = 'dazuyopuho@bit2tube.com';
        const loginPassword = 'slidewiki2test';

        await driver.get('http://localhost:3000/');
        await driver.findElement(By.xpath('/html/body'));
        await driver.findElement(By.xpath('//button/span[normalize-space(text())="Sign In"]')).click();

        await driver.findElement(By.id('email1')).sendKeys(loginEmail);
        await driver.findElement(By.id('password1')).sendKeys(loginPassword);
        await driver.findElement(By.xpath('//form[contains(@class, "signin")]//button/span[normalize-space(text())="Sign In"]')).click();
    },

};
