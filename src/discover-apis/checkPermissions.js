const config = require('./config.js');
const Nuxeo = require('nuxeo');
const nuxeo = new Nuxeo({
    baseURL: config.baseURL,
    auth: {
        method: 'basic',
        username: 'Administrator',
        password: 'Administrator'
    }
});

var onWhichDoc = '/default-domain/workspaces/North America';

nuxeo.repository()
  // We add the ACLs enricher to obtain current permissions on the doc
  .enricher('document', 'acls')
  // Then fetch the document
  .fetch(onWhichDoc)
  .then(function(doc) {
    console.log('Permissions defined on ' + doc.title + ':')
    for (var indexAcls = 0; indexAcls < doc.contextParameters.acls.length; indexAcls++) {
      console.log(doc.contextParameters.acls[indexAcls]);
    }
  })
  .catch(function(error) {
    console.log('Apologies, an error occurred while retrieving the permissions.');
    console.log(error);
  });