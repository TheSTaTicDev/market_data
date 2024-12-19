const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.use(express.static('public'));

const getStockPrice = async (ticker, exchange) => {
    const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const selector = '.YMlKec.fxKbKc';
        await page.waitForSelector(selector);

        const priceText = await page.$eval(selector, el => el.textContent);
        const price = parseFloat(priceText.replace(/₹|,/g, ''));

        await browser.close();
        return price;
    } catch (error) {
        console.error('Error fetching stock price:', error.message);
        await browser.close();
        return null;
    }
};

app.get('/get-stock-price', async (req, res) => {
    const { ticker, exchange } = req.query;
    if (!ticker || !exchange) {
        return res.status(400).json({ error: 'Ticker and exchange are required' });
    }

    const price = await getStockPrice(ticker, exchange);
    if (price !== null) {
        return res.json({ price });
    } else {
        return res.status(500).json({ error: 'Unable to fetch the stock price' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});