let config = require('./config.js');
let Nuxeo = require('nuxeo');
let fs = require('fs');
let nuxeo = new Nuxeo({
  baseURL: config.baseURL,
  auth: {
    method: 'basic',
    username: 'sconnor',
    password: 'sconnor'
  }
});

// Change this value to indicate in which folder the full PDF contract should be downloaded
// Don't forget the trailing slash
let filePath = 'data/tmp/';
// Which contract to fetch a rendition for
let contractToFetch = '/default-domain/workspaces/North America/awesome-tech/awesome-contract';
// Launch the automation chain to generate the final PDF file
console.log('We\'ll launch an automation chain.');
console.log('This chain will:');
console.log('- Gather the contract and all of its attachments');
console.log('- Convert them to PDF');
console.log('- And concatenate them all in a single file.');
nuxeo.operation('BCGenerateCompletePDFContract_ac')
  .input(contractToFetch)
  .execute()
  .then(response => {
    // Download file
    console.log('The file has been generated, we\'ll download it now.');
    try {
      var stats = fs.statSync(filePath);
      if (!stats.isDirectory()) {
        console.log(`${filePath} is is not a folder.\nPlease check the filePath variable (currently set to: ${filepath} )\nand make sure you have the proper rights on that folder.`);
        return;
      }
      const writable = fs.createWriteStream(`${filePath}contract-with-attachments.pdf`);
      response.body.pipe(writable);
      console.log('The complete PDF contract has been downloaded!');
      console.log(`You can take a look at it here: ${filePath}contract-with-attachments.pdf`)
    } catch (error) {
      console.log(`The folder where the rendition should be downloaded cannot be accessed.\nPlease check the filePath variable (currently set to: ${filePath})\nand make sure you have write access on that folder.`);
      console.log(error);
      return;
    }
  })
  .catch(error => {
    console.log('Apologies, an error occurred while generating the final PDF file.');
    console.log(error);
    return;
  });