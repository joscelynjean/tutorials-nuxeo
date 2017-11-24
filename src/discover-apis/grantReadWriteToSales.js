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

var whichPermission = {
  'permission': 'ReadWrite',
  'username': 'sales'
};
var onWhichDoc = '/default-domain/workspaces/North America';
nuxeo.repository()
  .fetch(onWhichDoc)
  .then(function(doc) {
    return doc.addPermission(whichPermission);
  })
  .then(function(doc) {
    console.log('Permission has been added on the document!');
  })
  .catch(function(error) {
    console.log('Apologies, an error occurred while adding the permission.');
    console.log(error);
  });