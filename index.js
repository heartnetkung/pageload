const puppeteer = require('puppeteer');
const Spinner = require('cli-spinner').Spinner;
const rimraf = require('rimraf');
const fs = require('fs');


//EDIT HERE
const nTest = 1;
const URL = 'http://naiin.com';
const INTERVAL = 5000;


rimraf.sync('output/*', { glob: true });
try {
	fs.mkdirSync('output');
} catch (e) {}


(async() => {
	const spinner = new Spinner('processing.. %s');
	spinner.setSpinnerString('|/-\\');
	spinner.start();

	var totalTime = 0;

	for (var i = 0; i < nTest; i++) {
		var browser = await puppeteer.launch();
		var page = await browser.newPage();

		var start = Date.now();
		var count = 0;

		var cancel = setInterval(() => {
			var time = ('00' + (INTERVAL / 1000 * ++count)).replace(/\d+(\d\d\d)/, '$1');
			page.screenshot({ path: `output/screenshot${i+1}_${time}s.png`, fullPage: true });
		}, INTERVAL);

		await page.goto(URL, { timeout: 200 * 1000 });
		clearInterval(cancel);
		totalTime += Date.now() - start;

		await page.screenshot({ path: `output/screenshot${i+1}_final.png`, fullPage: true });
		await page.close();
		browser.close();
	}

	spinner.stop(true);

	console.log('url: ' + URL);
	console.log('avg time: ' + Math.round(totalTime / nTest / 1000) + 's');
	console.log('total run: ' + nTest + ' time(s)');
	console.log('screenshot interval: ' + (INTERVAL / 1000) + 's');
})();