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

// Further calls will return all document properties
nuxeo.schemas('*');

// Phase 0
// Defining the variables that will be needed to attach files to the document:
// Where attachments are located on the disk
// ** Be sure to modify the path, keeping the trailing slash **
let filesPath = 'data/discover-apis-files/contract-attachments/';
// Which contract to update - No need to change if you followed our instructions so far
let contractToUpdatePath = '/default-domain/workspaces/North America/awesome-tech/awesome-contract';
// In which document property we'll store the attachments
// Please DO NOT change or you would need to adapt the code in phase 2
let propertiesToUpdate = {
  'files:files': []
};

// Phase 1
// Look for attachments and upload them in an upload batch
// The upload batch's content can be attached to a document afterward
fs.readdir(filesPath, (err, files) => {
    if (err) {
        console.log(`Attachments folder cannot be found.\nPlease check the filesPath variable (currently set to ${filesPath}).`);
        return;
    }

    // Create an empty batch into which we will upload files
    let attachmentsBatch = nuxeo.batchUpload();
    files.forEach(file => {
            try {
                // Be sure to use statSync
                // By using a synchronous method we won't have to deal with the callback
                // and will prevent attaching the batch's content to the document too soon
                let stats = fs.statSync(`${filesPath}/${file}`);
                if (!stats.isFile()) {
                    console.log(`${file} is not a file. Aborting.`);
                    attachmentsBatch.cancel();
                    return;
                }

                // We create a blob that can be uploaded from the file
                let nxBlob = new Nuxeo.Blob({
                    'content': fs.createReadStream(`${filesPath}/${file}`),
                    'name': path.basename(`${filesPath}/${file}`),
                    'size': stats.size
                });

                // And upload it into the batch
                attachmentsBatch.upload(nxBlob)
                    .then(uploadedFile => {
                        console.log(`File ${file} has been uploaded.`);
                    })
                    .catch(error => {
                        console.log(`File ${file} could not be uploaded. Aborting.`);
                        console.log(error);
                        attachmentsBatch.cancel();
                        return;
                    });

            } catch(error) {
                console.log('Apologies, an error occurred while looking for attachments to upload. Aborting.');
                console.log(error);
                attachmentsBatch.cancel();
                return;
            }
        });

    // Phase 2
    // We attach the batch's content into a document once upload is finished
    attachmentsBatch.done()
        .then(uploadedFiles => {
            // Parsing the batch files
            // so that they can be added to the files:files property
            for (var uploadedFilesIndex = 0; uploadedFilesIndex < uploadedFiles.blobs.length; uploadedFilesIndex++) {
                var currentFile = uploadedFiles.blobs[uploadedFilesIndex];
                propertiesToUpdate['files:files'].push({
                    'file': {
                        'upload-batch': currentFile['upload-batch'],
                        'upload-fileId': currentFile['fileIdx']
                    }
                });
            }
            // Retrieving the contract to update it
            return nuxeo.repository().fetch(contractToUpdatePath);
        })
        .then(contract => {
            // Contract has been retrieved
            // Let's update it with its new properties
            contract.set(propertiesToUpdate);
            return contract.save();
        })
        .then(contract => {
            console.log('Contract has been updated. It contains the following attachments:');
            console.log(contract.properties['files:files']);
        })
        .catch(error => {
            console.log('Apologies, an error occurred while updating the contract. Aborting.');
            attachmentsBatch.cancel();
            console.log(error);
            return;
        });
});