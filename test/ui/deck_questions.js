const {By, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const commons = require('./commons');



(async function deckQuestions() {
    // email: "dazuyopuho@bit2tube.com"
    // name: "tester-tib"
    // pass: "slidewiki2test"

    const loginEmail = 'dazuyopuho@bit2tube.com';
    const loginPassword = 'slidewiki2test';

//    const userName = 'vkovtun';
//    const key = 'fd33af29-4be5-46d4-8b2b-d96b9c9da4a1';
//    const url = 'http://' + userName + ':' + key + '@ondemand.saucelabs.com:80/wd/hub';
//    const driver = new webdriver.Builder().forBrowser('firefox').usingServer(url).setFirefoxOptions(firefox).build();

    const driver = new webdriver.Builder().forBrowser('firefox').usingServer('http://localhost:4444/wd/hub')
            .setFirefoxOptions(firefox).build();

    try {
        await commons.login(driver, loginEmail, loginPassword);

        await commons.findElement(driver, By.id('slideWikiLogo'));
        await commons.waitForElement(driver, By.id('downIcon')).click();

        /* Another way to make async calls. */
        driver.findElement(By.id('decksItem')).then((element) => element.click());

        await commons.waitForElement(driver, By.linkText('Test Deck 1')).click();

        const element = await commons.waitForElement(driver, By.id('questionsTab'));

        /* These wait is needed to avoid to quick switch to the questions tab, otherwise the default tab will be
         * displayed again.*/
        await driver.sleep(2000);
        await element.click();

        await commons.waitForElement(driver, By.id('addQuestion')).click();
        await commons.waitForElement(driver, By.id('question')).sendKeys('2+2=');
        await commons.findElement(driver, By.id('response1')).sendKeys('1');
        await commons.findElement(driver, By.id('response2')).sendKeys('2');
        await commons.findElement(driver, By.id('response3')).sendKeys('3');
        await commons.findElement(driver, By.id('response4')).sendKeys('4');
        await commons.findElement(driver, By.xpath('//*[@id="answer4"]/..')).click();
        await commons.findElement(driver, By.id('easy')).click();
        await commons.findElement(driver, By.id('explanation')).sendKeys('Very easy question');
        await commons.findElement(driver, By.id('saveQuestionButtonAdd')).click();
        await commons.findElement(driver, By.xpath('//*[@id="answer3"]/..')).click();
        await commons.findElement(driver, By.id('showHideAnswerButton')).click();
        await commons.findElement(driver, By.xpath('//div[@class="header" and text()="4"]'));
        await commons.findElement(driver, By.id('editQuestionButton')).click();
        await commons.findElement(driver, By.id('deleteQuestionButtonEdit')).click();
        await commons.findElement(driver, By.xpath('//*[text()="Delete this question. Are you sure?"]'));
        await commons.findElement(driver, By.xpath('//button[@type="button" and contains(text(), "Yes, delete!")]')).click();
    } finally {
        await driver.quit();
    }
})();
