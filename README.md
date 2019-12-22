# Tumblr Image Scraper

Simple image scraper that is designed for use with tumblr.

## Usage

```bash
git clone https://github.com/violetcraze/tumblr-image-scraper.git
cd tumblr-image-scraper
npm i
npm start

# You will be asked for a url here is an example
https://tumblr.tumblr.com/

# You'll be asked for a cutoff this is the number of pages it will look through
100

# Wait until it's done and find the images in /images
```

If you would like you can specify a url and cutoff in a .env file like so:

```
URL=https://tumblr.tumblr.com/
CUTOFF=100
```