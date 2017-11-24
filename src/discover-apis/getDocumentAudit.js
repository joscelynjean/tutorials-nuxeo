#!/usr/bin/env node
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
let docToFetch = '/default-domain/workspaces/North America/awesome-tech/skynet-ai-maintenance';
nuxeo.repository()
    .fetch(docToFetch)
    .then(doc => {
        return doc.fetchAudit();
    })
    .then(audit => {
        console.log(`Document's audit log is as follows:`);
        console.log(audit);
    })
    .catch(error => {
        console.log(`Apologies, an error occurred while retrieving the document's audit log.`);
        console.log(error);
    });