const config = require('./config.js');
const Nuxeo = require('nuxeo');
const nuxeo = new Nuxeo({
    baseURL: config.baseURL,
    auth: {
        method: 'basic',
        username: 'sconnor',
        password: 'sconnor'
        // Not working, forbidden
        /*
        username: 'afraser',
        password: 'afraser'
        */
    }
});

var contractToDownload = '/default-domain/workspaces/North America/Beyond Space Travel Agen/To the Moon and back';

nuxeo.repository()
  .fetch(contractToDownload)
  .then(function(contract) {
    return contract.fetchBlob();
  })
  .then(function(blob) {
    console.log('Contract\'s file can be downloaded!');
  })
  .catch(function(error) {
    console.log('The contract\'s file can\'t be downloaded, response is:');
    console.log(error.response.status + ' ' + error.response.statusText);
  });