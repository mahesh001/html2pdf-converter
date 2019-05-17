const html2pdf = require('../lib/api.js');
const Path = require('path')
var htmltopdf = new html2pdf();
var input = Path.resolve(__dirname, 'test.html');
var output = Path.resolve(__dirname, 'test1.jpeg');
var type = 'jpeg';


// var input = Path.resolve(__dirname, 'test.html');
// var output = Path.resolve(__dirname, 'test.jpg');
// var type = 'jpg';




/*    Letter: 8.5in x 11in
Legal: 8.5in x 14in
Tabloid: 11in x 17in
Ledger: 17in x 11in
A0: 33.1in x 46.8in
A1: 23.4in x 33.1in
A2: 16.5in x 23.4in
A3: 11.7in x 16.5in
A4: 8.27in x 11.7in
A5: 5.83in x 8.27in
A6: 4.13in x 5.83in*/

// var options = {
// 	format: 'A4',
// 	displayHeaderFooter: false,
// 	margin: {
// 		top: "0px",
// 		bottom: "0px",
// 		left: "0px",
// 		right: "0px"
// 	},
// 	printBackground: true,
// 	landscape: false,
// 	preferCSSPageSize: false,
// 	path: output
// }; //pdf


var options = {
	quality: 100,
	fullPage: true, // not supported with clip, with clip it would be false
	type: 'jpeg',
	omitBackground: false,
	clip: {
		x: 0,
		y: 0,
		width: 300,
		height: 300
	},
	viewport: {
		width: 1920, //800
		height: 1080 //600
	}
	path: output
}; //image

htmltopdf.convertor(input, output, type, options)
	.then(() => {
		process.exit(0); //for exit script
	})
	.catch((e) => {
		console.log(e);
		process.exit(0);
	})