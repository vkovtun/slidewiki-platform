const {By, until, WebElementCondition} = require('selenium-webdriver');
const commons = require('./commons');
const assert = require('assert');

(async function () {
    const driver = await commons.getWebDriver();
    const testDeck1Title = 'Test Deck 1';

    async function goToMyDecks() {
        await (await commons.waitForElement(driver, By.id('downIcon'))).click();
        await (await commons.findElement(driver, By.id('decksItem'))).click();
        await (await commons.waitForElement(driver, By.linkText('My Decks'))).click();
    }

    async function openMyDeckAndGoBack() {
        await driver.sleep(2000);
        await (await commons.waitForElement(driver, By.linkText(testDeck1Title))).click();
        await commons.waitForElement(driver, By.css('h2.ui.header'));
        await (await commons.findElement(driver, By.id('downIcon'))).click();
        await (await commons.findElement(driver, By.id('decksItem'))).click();
        await (await commons.waitForElement(driver, By.linkText('My Decks'))).click();
    }

    async function tryOrdering() {
        await orderDecksBy('Creation date');
        await orderDecksBy('Title');
        await orderDecksBy('Last updated');
    }

    async function orderDecksBy(orderByValue) {
        await commons.waitForElementAndForNotVisible(driver, By.className('ui active dimmer'));
        await (await commons.waitForElementAndForVisible(driver, By.className('icon exchange'))).click();
        await (await commons.findElement(driver, By.xpath('//*[text()="' + orderByValue + '"]'))).click();
    }

    async function clickUserName() {
        await (await commons.waitForElement(driver, By.linkText(testDeck1Title))).click();
        await (await commons.waitForElement(driver, By.linkText(commons.userName))).click();
        await driver.sleep(2000);

        const allWindowHandles = await driver.getAllWindowHandles();
        await driver.switchTo().window(allWindowHandles[1]);

        const headerText = await (await commons.waitForElement(driver, By.id('decksHeader'))).getText();
        assert.equal('My Decks', headerText);

        await commons.findElement(driver, By.xpath('//*[normalize-space(text())="' + commons.userName + '"]'));

        await driver.close();
        await driver.switchTo().window(allWindowHandles[0]);
    }

    async function changePublicationStatusRadio() {
        await goToMyDecks();
        await (await commons.findElement(driver, By.id('published_hidden_label'))).click();
        await (await commons.findElement(driver, By.id('published_public_label'))).click();
        await (await commons.findElement(driver, By.id('published_any_label'))).click();
    }

    async function goToAnotherUsersMyDeck() {
        await driver.get('http://localhost:3000/user/kovtun');
        await orderDecksBy('Creation date');
        await orderDecksBy('Title');
        await orderDecksBy('Last updated');

        assert((await driver.findElements(By.id('published_hidden_label'))).length === 0);
    }

    try {
        await commons.login(driver);

        await commons.findElement(driver, By.id('slideWikiLogo'));

        await goToMyDecks();
        await openMyDeckAndGoBack();
        await tryOrdering();
        await clickUserName();
        await changePublicationStatusRadio();
        await goToAnotherUsersMyDeck();
    } finally {
        await driver.quit();
    }
})();
