const {Builder, By, Key, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

async function login(driver, loginEmail, loginPassword) {
    await driver.get('http://localhost:3000/');
    await driver.findElement(By.xpath('/html/body'));
    await driver.findElement(By.xpath('//button/span[normalize-space(text())="Sign In"]')).click();

    await driver.findElement(By.id('email1')).sendKeys(loginEmail);
    await driver.findElement(By.id('password1')).sendKeys(loginPassword);
    await driver.findElement(By.xpath('//form[contains(@class, "signin")]//button/span[normalize-space(text())="Sign In"]')).click();
}

function findElement(driver, locator) {
    return driver.findElement(locator);
}

function waitForElement(driver, locator) {
    return driver.wait(until.elementLocated(locator), 10000);
}

function waitForElementVisible(driver, locator) {
    return driver.wait(until.elementIsVisible(locator), 10000);
}

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

    const capabilities = await driver.getCapabilities();
    capabilities['map_'].set('timeouts', { implicit: 5000, pageLoad: 5000, script: 5000 });



    // const timeouts = await driver.manage.getTimeouts();

    // driver.manage().setTimeouts({null, null, true});

    // const driver = new webdriver.Builder().forBrowser('chrome').usingServer('http://localhost:4444/wd/hub')
    //         .setChromeOptions(chrome).build();

    try {
        // await driver.manage().setTimeouts( { implicit: 5000 } );

        await login(driver, loginEmail, loginPassword);

        await driver.findElement(By.id('slideWikiLogo'));
        await driver.findElement(By.id('downIcon')).click();

        // await driver.findElement(By.id('decksItem')).click();
        driver.findElement(By.id('decksItem')).then((element) => element.click());

        await waitForElement(driver, By.linkText('Test Deck 1')).click();

        waitForElement(driver, By.id('questionsTab')).then((element) => {
            /* This wait is needed to avoid to quick switch to the questions tab, otherwise the default tab will be
             * displayed again.*/
            driver.sleep(2000).then(() => {
                element.click()
            }).then(() => {driver.sleep(2000)});
        });

        await waitForElement(driver, By.id('addQuestion')).click();

        const question = await waitForElement(driver, By.id('question'));
        driver.sleep(1000);
        await question.sendKeys('2+2=');
        await findElement(driver, By.id('response1')).sendKeys('1');
        await findElement(driver, By.id('response2')).sendKeys('2');
        await findElement(driver, By.id('response3')).sendKeys('3');
        await findElement(driver, By.id('response4')).sendKeys('4');
        await findElement(driver, By.xpath('//*[@for="answer4"]')).click();
    } finally {
        await driver.quit();
    }
})();
