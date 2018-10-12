const {By, until, WebElementCondition} = require('selenium-webdriver');
const commons = require('./commons');
const assert = require('assert');

(async function () {
    const driver = commons.getWebDriver();
    const testDeck1Title = 'Test Deck 1';

    // Old attempt to solve the dimmer problem.
    // async function orderDecksBy(orderByValue) {
    //     // const dimmer = await commons.findElement(driver, By.className('ui active dimmer'));
    //     // if (dimmer) {
    //         // await driver.wait(until.stalenessOf(dimmer), 2000);
    //         // await driver.wait(until.elementIsNotVisible(dimmer), 2000);
    //     // }
    //
    //     /* Allowing the dimmer to pass. Better find a way around this hack. */
    //     // await driver.sleep(1000);
    //
    //     const foundElementsPromise = driver.findElements(
    //             By.xpath('//*[contains(@class, "ui active dimmer")] | //*[contains(@class, "icon exchange")]'));
    //
    //     const foundDimmer = foundElementsPromise.then((elements) => elements.filter(
    //         (foundElement) => foundElement.getAttribute('class') === 'ui active dimmer'
    //     ))[0];
    //     const foundButton = foundElementsPromise.then((elements) => elements.filter(
    //         (foundElement) => foundElement.getAttribute('class') === 'icon exchange'
    //     ))[0];
    //
    //     console.log('foundDimmer=' + foundDimmer + ", foundButton=" + foundButton);
    //
    //     if (foundButton) {
    //         const classAttribute = await foundButton.getAttribute('class');
    //         const tagName = await foundButton.getTagName();
    //         console.log('classAttribute="' + classAttribute + '", tagName="' + tagName + '"]');
    //     }
    //
    //     if (foundDimmer) {
    //         await driver.wait(until.elementIsNotVisible(foundDimmer), 2000);
    //     }
    //
    //     await foundButton.click();
    //     await commons.findElement(driver, By.xpath('//*[text()="' + orderByValue + '"]')).click();
    // }

    async function goToMyDecks() {
        await commons.waitForElement(driver, By.id('downIcon')).click();
        await commons.findElement(driver, By.id('decksItem')).click();
        await commons.waitForElement(driver, By.linkText('My Decks')).click();
    }

    async function openMyDeckAndGoBack() {
        await driver.sleep(2000);
        await commons.waitForElement(driver, By.linkText(testDeck1Title)).click();
        await commons.waitForElement(driver, By.css('h2.ui.header'));
        await commons.findElement(driver, By.id('downIcon')).click();
        await commons.findElement(driver, By.id('decksItem')).click();
        await commons.waitForElement(driver, By.linkText('My Decks')).click();
    }

    async function tryOrdering() {
        await orderDecksBy('Creation date');
        await orderDecksBy('Title');
        await orderDecksBy('Last updated');
    }

    async function orderDecksBy(orderByValue) {
        await driver.sleep(1000);
        await commons.findElement(driver, By.className('icon exchange')).click();
        await commons.findElement(driver, By.xpath('//*[text()="' + orderByValue + '"]')).click();
    }

    async function clickUserName() {
        // await driver.executeScript(() => {
        //     while(true) {
        //         if (driver.) {
        //             document.querySelector('.anticon.anticon-plus').click();
        //             break;
        //         }
        //     }
        // });

        // await commons.waitForElementAndForVisible(driver, By.linkText(testDeck1Title)).click();
        await driver.sleep(2000);
        await commons.waitForElement(driver, By.linkText(testDeck1Title)).click();
        await commons.waitForElement(driver, By.linkText(commons.userName)).click();
        await driver.sleep(2000);

        const allWindowHandles = await driver.getAllWindowHandles();
        await driver.switchTo().window(allWindowHandles[1]);

        const headerText = await commons.waitForElement(driver, By.id('decksHeader')).getText();
        assert(headerText === 'My Decks');

        await commons.findElement(driver, By.xpath('//*[normalize-space(text())="' + commons.userName + '"]'));

        await driver.close();
        await driver.switchTo().window(allWindowHandles[0]);
    }

    async function changePublicationStatusRadio() {
        await goToMyDecks();
        await commons.findElement(driver, By.id('published_hidden_label')).click();
        await commons.findElement(driver, By.id('published_public_label')).click();
        await commons.findElement(driver, By.id('published_any_label')).click();
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
