// This file implements a user interface to control axe-core tests.
// It includes functions to trigger tests for each axe-core rule via buttons in the UI
// and displays the results after testing.

import axe from "axe-core";
import puppeteer from "puppeteer";

const url = "https://gfu.net"; // URL to test

async function runAxeTest(rule) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.addScriptTag({ content: axe.source });

    const results = await page.evaluate(async (rule) => {
        const result = await window.axe.run(document, {
            runOnly: [rule],
        });
        return result;
    }, rule);

    await browser.close();
    return results;
}

document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById("results");

    const rules = ["wcag2a", "wcag2aa"]; // List of rules to test

    rules.forEach((rule) => {
        const button = document.createElement("button");
        button.innerText = `Run ${rule} Test`;
        button.addEventListener("click", async () => {
            const results = await runAxeTest(rule);
            resultsContainer.innerHTML = `<pre>${JSON.stringify(results, null, 2)}</pre>`;
        });
        document.body.appendChild(button);
    });
});