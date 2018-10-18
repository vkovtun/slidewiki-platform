const {By, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

const timeout = 10000;
const applicationUrl = 'http://localhost:3000/';
const serverUrl = 'http://localhost:4444/wd/hub';
const userName = 'tester-tib';

module.exports = {
    applicationUrl,
    userName,

    getWebDriver: async () => {
        // email: "dazuyopuho@bit2tube.com"
        // name: "tester-tib"
        // pass: "slidewiki2test"

        //    const userName = 'vkovtun';
        //    const key = 'fd33af29-4be5-46d4-8b2b-d96b9c9da4a1';
        //    const url = 'http://' + userName + ':' + key + '@ondemand.saucelabs.com:80/wd/hub';
        //    const driver = new webdriver.Builder().forBrowser('firefox').usingServer(url).setFirefoxOptions(firefox).build();

        return await new webdriver.Builder().forBrowser('firefox').usingServer(serverUrl).build()
    },

    findElement: async (driver, locator) => {
        return await driver.findElement(locator);
    },

    findElements: async (driver, locator) => {
        return await driver.findElements(locator);
    },

    waitForElement: async (driver, locator) => {
        return await driver.wait(until.elementLocated(locator), timeout);
    },

    waitForElementAndForVisible: async (driver, locator) => {
        return new Promise(function(resolve, reject){
            driver.wait(until.elementLocated(locator), timeout).then(
                (element) => {
                    driver.wait(until.elementIsVisible(element), timeout).then(resolve,
                        (err) => {
                            console.log(err);
                            reject(err);
                        });
                },
                (err) => {
                    console.log(err);
                    reject(err);
                });
        });
    },

    waitForElementAndForNotVisible: async (driver, locator) => {
        return new Promise(function(resolve, reject){
            driver.wait(until.elementLocated(locator), 100).then(
                (element) => {
                    driver.wait(until.elementIsNotVisible(element), timeout).then(resolve,
                        (err) => {
                            if (err.name === "StaleElementReferenceError") {
                                resolve(err);
                            } else {
                                reject(err);
                            }
                        });
                },
                (err) => {
                    resolve(err);
                });
        });
    },

    waitForElementVisible: async (driver, element) => {
        return await driver.wait(until.elementIsVisible(element), timeout);
    },

    login: async (driver) => {
        const loginEmail = 'dazuyopuho@bit2tube.com';
        const loginPassword = 'slidewiki2test';

        await driver.get(applicationUrl);
        await driver.findElement(By.xpath('/html/body'));
        await driver.findElement(By.xpath('//button/span[normalize-space(text())="Sign In"]')).click();

        await driver.findElement(By.id('email1')).sendKeys(loginEmail);
        await driver.findElement(By.id('password1')).sendKeys(loginPassword);
        await driver.findElement(By.xpath('//form[contains(@class, "signin")]//button/span[normalize-space(text())="Sign In"]')).click();
    },

    filter: async (arr, callback) => {
        const fail = Symbol();
        return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail);
    }

};
