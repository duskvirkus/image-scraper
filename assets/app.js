const sites = require('./sites.json');
const ipc = require('electron').ipcRenderer;

populateSites();

function populateSites() {
  const siteDropdown = document.getElementById('site');

  const sitesKeys = Object.keys(sites);
  for (let i = 0; i < sitesKeys.length; ++i) {
    const option = document.createElement('option');
    option.innerHTML = sitesKeys[i];
    siteDropdown.appendChild(option);
  }

  const option = document.createElement('option');
  option.innerHTML = 'Custom';
  siteDropdown.appendChild(option);

  updateOptions();
}

function updateOptions() {
  const siteSelect = document.getElementById('site');
  ([...(document.getElementsByClassName('active'))]).forEach(el => {
    el.classList.remove('active');
  });
  switch(siteSelect.options[siteSelect.selectedIndex].innerHTML) {
    case 'tumblr.com':
      document.getElementById('tumblr-options').classList.add('active');
      break;
  }
}

function begin() {
  const siteSelect = document.getElementById('site');

  let urls = [];
  const input = document.getElementById('urls').value;
  const lines = input.split('\n');
  console.log(lines);
  for (let i = 0; i < lines.length; ++i) {
    const fields = lines[i].split(' ');
    if (fields.length > 1) {
      urls.push({
        url: fields[0],
        pages: fields[1],
      });
    } else if (fields.length === 1) {
      urls.push({
        url: fields[0],
      });
    }
  }
  
  const msg = {
    site: siteSelect.options[siteSelect.selectedIndex].innerHTML,
    urls: urls,
  }

  ipc.send('scrap', msg);
}