const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const Puppeteer = require('puppeteer')
const Handlebars = require('handlebars')
const ReadFile = Util.promisify(Fs.readFile)


function Api() {
    this.data = {};
    this.imagetype = ['jpg', 'png', 'jpeg', 'JPG', 'JPEG', 'PNG'];
    this.doctype = ['pdf', 'PDF'];
}

Api.prototype.readHtml = async function (inputpath) {
    try {
        const data = {
            your: 'data'
        };
        const templatePath = Path.resolve(inputpath);
        const content = await ReadFile(templatePath, 'utf8');
        const template = Handlebars.compile(content);
        return template(data);
    } catch (error) {
        throw new Error('unable to read HTML template. check your input file path');
    }
};

Api.prototype.pdf = async function (inputpath, outputpath, options) {
    const html = await this.readHtml(inputpath);
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMedia('screen'); //print
    var qOpts = {
        format: 'A4',
        displayHeaderFooter: false,
        margin: {
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px"
        },
        printBackground: true,
        landscape: false,
        preferCSSPageSize: false,
        path: outputpath
    };
    if (options) {
        for (var property in options) {
            if (qOpts[property]) {
                qOpts[property] = options[property];
            }
        }
    }
    await page.pdf(qOpts);
    return browser.close();
};

Api.prototype.image = async function (inputpath, outputpath, options) {
    const html = await this.readHtml(inputpath);
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMedia('screen');
    if (options && options.viewport) {
        await page.setViewport({ width: options.viewport.width || 800, height: options.viewport.height || 600 });
    }
    var qOpts = {
        fullPage: true,
        type: 'png',
        omitBackground: false,
        path: outputpath
    };
    if (options) {
        for (var property in options) {
            if (qOpts[property]) {
                qOpts[property] = options[property];
            }
        }
    }
    if (options && options.clip) {
        qOpts.clip = {};
        qOpts.clip.x = options.clip.x || 0;
        qOpts.clip.y = options.clip.y || 0;
        qOpts.clip.width = options.clip.width;
        qOpts.clip.height = options.clip.height;
        qOpts.fullPage = false;
    }
    if (options && options.type && options.type !== 'png') {
        qOpts.quality = 100;
    }
    await page.screenshot(qOpts);
    return browser.close();
};


function isUndefinedOrNull(key) {
    return (typeof key !== 'undefined' && key.trim() !== '') ? false : true;
};
Api.prototype.convertor = async function (inputpath, outputpath, type, options) {
    if (isUndefinedOrNull(inputpath)) {
        throw new Error('Provide Valid Input  Path!');
    }
    if (isUndefinedOrNull(outputpath)) {
        throw new Error('Provide Valid Output  Path!');
    }
    if (this.doctype.indexOf(type) > -1) {
        await this.pdf(inputpath, outputpath, options)
    } else if (this.imagetype.indexOf(type) > -1) {
        await this.image(inputpath, outputpath, options);
    } else {
        throw new Error('Invalid Type!');
    }
};

module.exports = Api;