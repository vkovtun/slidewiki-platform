const {By, until} = require('selenium-webdriver');

module.exports = {

    findElement: function (driver, locator) {
        return driver.findElement(locator);
    },

    waitForElement: function(driver, locator) {
        return driver.wait(until.elementLocated(locator), 10000);
    },

    waitForElementVisible: function (driver, element) {
        return driver.wait(until.elementIsVisible(element), 10000);
    },

    login: async function (driver, loginEmail, loginPassword) {
        await driver.get('http://localhost:3000/');
        await driver.findElement(By.xpath('/html/body'));
        await driver.findElement(By.xpath('//button/span[normalize-space(text())="Sign In"]')).click();

        await driver.findElement(By.id('email1')).sendKeys(loginEmail);
        await driver.findElement(By.id('password1')).sendKeys(loginPassword);
        await driver.findElement(By.xpath('//form[contains(@class, "signin")]//button/span[normalize-space(text())="Sign In"]')).click();
    },

};
