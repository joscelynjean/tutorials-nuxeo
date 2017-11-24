// We need to require path and fs to browse the filesystem
let config = require('./config.js');
let Nuxeo = require('nuxeo');
let path = require('path');
let fs = require('fs');
let nuxeo = new Nuxeo({
    baseURL: config.baseURL,
  auth: {
    method: 'basic',
    username: 'sconnor',
    password: 'sconnor'
  }
});

// Full path to the file that should be uploaded
// ** Be sure to modify the path **
let filePath = 'data/discover-apis-files/AwesomeTech-Contract.docx';

// Path where the document should be created in Nuxeo Platform
let whereToCreate = '/default-domain/workspaces/North America/awesome-tech';

fs.stat(filePath, (err, stats) => {
  if (err) {
    console.log(`File cannot be found.\nPlease check the filePath variable (currently set to ${filePath}).`);
    return;
  }
  if (!stats.isFile()) {
    console.log(`${filePath} is not a file.\nPlease check the filePath variable.`);
    return;
  }

  // We create a blob from the filePath passed as variable
  let blob = new Nuxeo.Blob({
    'content': fs.createReadStream(filePath),
    'name': path.basename(filePath),
    'size': stats.size
  });
  let fileName = path.basename(filePath);

  // Then upload the file
  nuxeo.batchUpload()
    .upload(blob)
    .then(uploadedFile => {
      console.log('File is uploaded, we will now create a document to attach it.');

      // We create a contract and attach the file to it
      // We could also attach the file to an existing contract
      let contractToCreate = {
        'entity-type': 'document',
        'type': 'BCContract',
        'name': 'awesome-contract',
        'properties': {
          'dc:title': fileName,
          'file:content': uploadedFile.blob,
          'bcsalescommon:amount': '15000'
        }
      };

      return nuxeo.repository().create(whereToCreate, contractToCreate, { schemas: ['*'] });
    })
    .then(contract => {
      console.log('Contract has been created as follows:');
      console.log(contract);
      console.log(`Blob can be downloaded here: ${contract.get('file:content').data}.\nNote that a file security policy restricts downloads to Administrators and members of the managers group.\nYou can log in as sconnor / sconnor to download it.`);
    })
    .catch(error => {
       console.log(error);
     });
});