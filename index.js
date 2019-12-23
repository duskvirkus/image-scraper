const {
  app,
  BrowserWindow,
  ipcMain,
} = require('electron');
const puppeteer = require('puppeteer');
const fs = require('fs');

let win;
let imgCount = 0;

function init() {
  createWindow();
}

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
}

ipcMain.on('scrap', (event, msg) => {
  console.log(JSON.stringify(msg));
  scrapSite(msg);
});

async function scrapSite(data) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  switch(data.site) {
    default:
      for (let i = 0; i < data.urls.length; ++i) {
        await scrapPage(page, data.urls[i]);
      }
  }

  await browser.close();
  console.log("done");
}

async function scrapPage(page, url) {
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

app.on('ready', init);