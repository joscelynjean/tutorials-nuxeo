#!/usr/bin/env node
let config = require('./config.js');
let Nuxeo = require('nuxeo');
let nuxeo = new Nuxeo({
    baseURL: config.baseURL,
    auth: {
        method: 'basic',
        username: 'afraser',
        password: 'afraser'
    }
});
let contractToFetch = '/default-domain/workspaces/North America/awesome-tech/skynet-ai-maintenance';
nuxeo.repository()
    .fetch(contractToFetch)
    .then(contract => {
        if (contract.state !== 'draft') {
            console.log('\nSorry, the contract needs to be in the draft state to launch a validation workflow on it.\nCurrent state is: ' + contract.state + '\n');
            return;
        }
        contract.startWorkflow('BCContractValidationWf')
            .then(wf => {
                console.log('Workflow is now started!');
                console.log('id: ' + wf.id);
                console.log('workflow state: ' + wf.state);
                console.log('initiated by: ' + wf.initiator);
            })
            .catch(error => {
                console.log('Apologies, an error occurred while starting the workflow.');
                console.log(error);
            });
        return;
    })
    .catch(error => {
        console.log('Apologies, an error occurred while fetching the contract.');
        console.log(error);
    });