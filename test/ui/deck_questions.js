const {By, until} = require('selenium-webdriver');
const commons = require('./commons');

(async function () {
    const driver = await commons.getWebDriver();

    try {
        await commons.login(driver);

        await commons.findElement(driver, By.id('slideWikiLogo'));
        await (await commons.waitForElement(driver, By.id('downIcon'))).click();

        /* Another way to make async calls. */
        driver.findElement(By.id('decksItem')).then((element) => element.click());

        await (await commons.waitForElement(driver, By.linkText('Test Deck 1'))).click();

        const element = await commons.waitForElement(driver, By.id('questionsTab'));

        /* This wait is needed to avoid to quick switch to the questions tab, otherwise the default tab will be
         * displayed again.*/
        await driver.sleep(2000);
        await element.click();

        await (await commons.waitForElement(driver, By.id('addQuestion'))).click();
        await (await commons.waitForElement(driver, By.id('question'))).sendKeys('2+2=');
        await (await commons.findElement(driver, By.id('response1'))).sendKeys('1');
        await (await commons.findElement(driver, By.id('response2'))).sendKeys('2');
        await (await commons.findElement(driver, By.id('response3'))).sendKeys('3');
        await (await commons.findElement(driver, By.id('response4'))).sendKeys('4');
        await (await commons.findElement(driver, By.xpath('//*[@id="answer4"]/..'))).click();
        await (await commons.findElement(driver, By.id('easy'))).click();
        await (await commons.findElement(driver, By.id('explanation'))).sendKeys('Very easy question');
        await (await commons.findElement(driver, By.id('saveQuestionButtonAdd'))).click();
        await (await commons.findElement(driver, By.xpath('//*[@id="answer3"]/..'))).click();
        await (await commons.findElement(driver, By.id('showHideAnswerButton'))).click();
        await commons.findElement(driver, By.xpath('//div[@class="header" and text()="4"]'));
        await (await commons.findElement(driver, By.id('editQuestionButton'))).click();
        await (await commons.findElement(driver, By.id('deleteQuestionButtonEdit'))).click();
        await commons.findElement(driver, By.xpath('//*[text()="Delete this question. Are you sure?"]'));
        await (await commons.findElement(driver, By.xpath('//button[@type="button" and contains(text(), "Yes, delete!")]')))
            .click();
    } finally {
        await driver.quit();
    }
})();
