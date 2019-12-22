require('dotenv').config();
const puppeteer = require('puppeteer');
const readline = require('readline');
const fs = require('fs');

const R = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let imgCount = 0;

(async () => {
  console.log("Starting Image Scraper!");

  const url = process.env.URL ? process.env.URL : await humanInput("Enter URL: ");
  const cutoff = process.env.CUTOFF ? process.env.CUTOFF : await humanInput("Enter cutoff page number: ");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await scrapPages(url, page, cutoff);

  await browser.close();
  console.log("Done!")
  process.exit(0);
})();

function humanInput(prompt) {
  return new Promise((resolve, reject) => {
    R.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function scrapPages(url, page, cutoff) {
  for (let i = 1; i < cutoff; ++i) {
    const modifiedUrl = url + '/page/' + i;
    const end = await scrapPage(modifiedUrl, page);
    if (end) break;
  }
}

async function scrapPage(url, page) {
  console.log("Scraping: " + url);
  await page.goto(url);
  const imgURLs = await getImageURLs(page);
  if (imgURLs.length == 0) {
    return true;
  }
  await downloadImages(imgURLs, page);
}

async function getImageURLs(page) {
  return await page.evaluate((selector) => {
    const imgElements = document.querySelectorAll(selector);
    let imgUrls = [];
    for (let i = 0; i < imgElements.length; ++i) {
      imgUrls.push(imgElements[i].getAttribute('src'));
    }
    return imgUrls;
  }, 'img');
}

async function downloadImages(urls, page) {
  for (let i = 0; i < urls.length; ++i) {
    const source = await page.goto(urls[i]);
    const urlParts = urls[i].split('.');
    fs.writeFile('images/' + imgCount++ + '.' + urlParts[urlParts.length - 1], await source.buffer(), err => err ? console.error(err) : (1));
  }
}