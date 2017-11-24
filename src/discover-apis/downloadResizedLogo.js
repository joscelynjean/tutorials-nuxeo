#!/usr/bin/env node
// fs and path NodeJS modules are required to handle file download
let config = require('./config.js');
let fs = require('fs');
let path = require('path');
let Nuxeo = require('nuxeo');
let nuxeo = new Nuxeo({
    baseURL: config.baseURL,
    auth: {
        method: 'basic',
        username: 'sconnor',
        password: 'sconnor'
    }
});
// Change this value to indicate in which folder the image rendition file should be downloaded
// Don't forget the trailing slash
let filePath = 'data/tmp/';
// Which portfolio to fetch a rendition for - No need to change if you followed our instructions so far
let portfolioToFetch = '/default-domain/workspaces/North America/Money Bank';
// Size of the company logo rendition you want to obtain
// You can change "Medium" to "Thumbnail", "Small" or "OriginalJpeg" to see the difference for yourself
let renditionSize = 'Medium';
// Init some variables that will be used for the file name
let companyName;
let fileFormat;
// Further calls will return all document properties
nuxeo.schemas('*');
nuxeo.repository().fetch(portfolioToFetch)
    .then(portfolio => {
        // Store the company name to use it in the file name later
        companyName = portfolio.properties['dc:title'];
        // Display the different image sizes
        console.log('\nThe following image sizes can be downloaded:\n');
        portfolio.properties['picture:views'].forEach(currentPictureView => {
            console.log(currentPictureView.title);
            console.log(currentPictureView.info);
            // Store the rendition format to generate the filename later
            if (currentPictureView.title === renditionSize) {
                fileFormat = currentPictureView.info.format.toLowerCase();
            }
        });
        console.log('\nWe\'ll ask for a ' + renditionSize + '-sized company logo in the ' + fileFormat + ' format.');
        return portfolio.fetchRendition(renditionSize);
    })
    .then(response => {
        // Download the rendition and store it on the disk
        try {
            var stats = fs.statSync(filePath);
            if (!stats.isDirectory()) {
                console.log(`${filePath} is not a folder.\nPlease check the filePath variable (currently set to: ${filePath})\nand make sure you have the proper rights on that folder.`);
                return;
            }
            let renditionFilePath = path.join(filePath, `${companyName}-${renditionSize}.${fileFormat}`);
            const writable = fs.createWriteStream(renditionFilePath);
            response.body.pipe(writable);
            console.log(`The ${renditionSize} sized company logo has been downloaded!`);
            console.log(`You can take a look at it here: ${renditionFilePath}`)
        } catch (error) {
            console.log('The folder where the rendition should be downloaded cannot be accessed.\nPlease check the filePath variable (currently set to: ' + filePath + ')\nand make sure you have write access on that folder.');
            console.log(error);
            return;
        }
    })
    .catch(error => {
        console.log('Apologies, an error occurred while fetching the rendition.');
        console.log(error);
        return;
    });