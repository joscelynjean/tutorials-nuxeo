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
// Change this value to indicate in which folder the PDF rendition file should be downloaded
// Don't forget the trailing slash
let filePath = 'data/tmp/';
// Which contract to fetch a rendition for - No need to change if you followed our instructions so far
let contractToFetch = '/default-domain/workspaces/North America/awesome-tech/awesome-contract';
// Further calls will return all document properties
nuxeo.schemas('*');
// First we'll display the renditions list
// to give you an idea of what you could fetch out of the box
nuxeo.repository().fetch(contractToFetch)
    .then(contract => {
        return contract.fetchRenditions();
    })
    .then(renditions => {
        console.log('\nThe following renditions can be called on the contract:\n');
        console.log(renditions);
        console.log('\nWe\'ll ask for a PDF rendition.\n');
    })
    .catch(error => {
        console.log('Apologies, an error occurred while fetching the renditions list.');
        console.log(error);
        return;
    });
nuxeo.repository().fetch(contractToFetch)
    .then(contract => {
        return contract.fetchRendition('pdf');
    })
    .then(response => {
        // Download the rendition and store it on the disk
        try {
            let stats = fs.statSync(filePath);
            if (!stats.isDirectory()) {
                console.log(filePath + ' is not a folder.\nPlease check the filePath variable (currently set to: ' + filePath + ')\nand make sure you have the proper rights on that folder.');
                return;
            }
            const writable = fs.createWriteStream(path.join(filePath, 'contract.pdf'));
            response.body.pipe(writable);
            console.log('The PDF rendition has been downloaded.');
            console.log(`You can take a look at it here: ${path.join(filePath, 'contract.pdf')}`)
        } catch (error) {
            console.log(`The folder where the rendition should be downloaded cannot be accessed.\nPlease check the filePath variable (currently set to: ${filePath})\nand make sure you have write access on that folder.`);
            console.log(error);
            return;
        }
        return nuxeo.repository().fetch(contractToFetch);
    })
    .then(contract => {
        console.log(`Notice that the contract's file remains in its initial format:`);
        console.log(contract.properties['file:content']);
    })
    .catch(error => {
        console.log('Apologies, an error occurred while retrieving the contract.');
        console.log(error);
        return;
    });