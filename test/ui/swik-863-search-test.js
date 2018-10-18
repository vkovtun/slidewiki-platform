const {By, Key, until} = require('selenium-webdriver');
const commons = require('./commons');
const assert = require('assert');

(async function () {
    const driver = await commons.getWebDriver();
    const searchString = "dat";
    const neededString = "data";
    const suggestionsLocator = By.css('a.result > div.content > div.title');

    async function checkSearchResultsPresent() {
        await commons.waitForElement(driver, By.xpath('//h2/span[text() = "Search Results"]'));
    }

    async function findSearchInput() {
        return await commons.findElement(driver, By.id('searchString'));
    }

    async function findOfferedSearchText() {
        await (await findSearchInput()).sendKeys(searchString);

        await commons.waitForElementAndForVisible(driver, suggestionsLocator);

        const results = await commons.findElements(driver, suggestionsLocator);

        /* Not synced, but it's OK, because it's just verification. */
        results.forEach(
            async (result) => {
                const text = await result.getText();
                console.log('findOfferedSearchText(). Found result. [text: \'' + text + '\']');
                assert(text.search(searchString) >= 0);
            }
        );

        let foundResultIndex = -1;
        const neededResults = await commons.filter(results,
            async (result, index) => {
                const text = await result.getText();

                const equals = text === neededString;
                if (equals) {
                    foundResultIndex = index;
                }

                return equals;
            }
        );
        console.log('findOfferedSearchText(). [foundResultIndex: ' + foundResultIndex + ']');

        assert.equal(1, neededResults.length);
        const offeredSearchText = neededResults[0];
        return {offeredSearchText, foundResultIndex};
    }

    async function search() {
        await driver.get(commons.applicationUrl);

        const {offeredSearchText, resultIndex} = await findOfferedSearchText();
        await offeredSearchText.click();
        await checkSearchResultsPresent();

        await driver.get(commons.applicationUrl);

        const searchInput = await findSearchInput();
        await searchInput.sendKeys(searchString);
        await commons.waitForElementAndForVisible(driver, suggestionsLocator);

        await searchInput.sendKeys(Array(resultIndex).fill(Key.DOWN).join(''));
        await searchInput.sendKeys(Key.RETURN);
        await checkSearchResultsPresent();

        const resultHeadersLocator = By.css('.searchResults h3 > a');
        await commons.waitForElement(driver, resultHeadersLocator);
        const resultHeaderElements = await commons.findElements(driver, resultHeadersLocator);

        const resultPromises = await resultHeaderElements.map(async (result) => await result.getText());
        const results = await Promise.all(resultPromises);

        /*
         * Very silly check that the search results are correct. We check that in first results the titles contain
         * the searched string.
         */
        assert(results[0].toLowerCase().search(neededString) >= 0);
        assert(results[1].toLowerCase().search(neededString) >= 0);
    }

    async function checkOtherVersions() {
        const multipleVersionResultItems = await commons.findElements(driver,
            By.xpath('//div[.//span[text()="Other versions"] and @class="accordionItem"]'));
        assert(multipleVersionResultItems.length > 0);

        const testedItem = multipleVersionResultItems[0];
        const button = await testedItem.findElement(By.css('button.ui.small.button'));
        await button.click();

        const mainLink = await testedItem.findElement(By.css('div.title.active h3 > a'));
        const mainHref = await mainLink.getAttribute('href');

        await driver.wait(until.elementLocated(By.css('div.content.active div.row a')));

        const altLink = await testedItem.findElement(By.css('div.content.active div.row a'));
        const altHref = await altLink.getAttribute('href');

        console.log('checkOtherVersions(). [mainHref: ' + mainHref + ', altHref: ' + altHref + ']');

        assert.notEqual(mainHref, altHref);
    }

    async function checkUserFilter() {
        const userFilterInput = await commons.findElement(driver, By.css('div#users_input_div > input.search'));
        await userFilterInput.sendKeys('e');
        await commons.waitForElement(driver, By.css('div#users_input_div > div.menu'))
    }

    async function checkMisspellingSuggestion() {
        const keyPress = Key.chord(Key.CONTROL, "a");
        const searchElement = await commons.findElement(driver, By.id('SearchTerm'));
        await searchElement.sendKeys(keyPress);
        await searchElement.sendKeys(Key.DELETE + 'sidewiki');
        await (await commons.findElement(driver, By.css('.ui.primary.submit.button'))).click();
        const suggestionElement = await commons.waitForElement(driver,
            By.xpath('//div[@class="searchResults"]//h4/a[text()="slidewiki"]'));
        const suggestedText = await (suggestionElement).getText();

        console.log('checkMisspellingSuggestion(). [suggestedText: ' + suggestedText + ']');
    }

    try {
        await search();
        await checkOtherVersions();
        await checkUserFilter();
        await checkMisspellingSuggestion();
    } finally {
        await driver.quit();
    }
})();
