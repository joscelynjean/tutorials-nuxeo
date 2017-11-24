#!/usr/bin/env node
let config = require('./config.js');
let Nuxeo = require('nuxeo');
let nuxeo = new Nuxeo({
    baseURL: config.baseURL,
    auth: {
        method: 'basic',
        username: 'sconnor',
        password: 'sconnor'
    }
});
// Fetch the current user's contract validation tasks
nuxeo.workflows().fetchTasks({
        'workflowModelName': 'BCContractValidationWf'
    })
    .then(function(tasks) {
        // Display tasks
        if (tasks.length === 0) {
            console.log('No task to do! Cool!\n');
            return;
        }
        tasks.entries.forEach(currentTask => {
            console.log('Name: ' + currentTask.name);
            console.log('Status: ' + currentTask.state);
            console.log('What to do: ' + currentTask.directive);
            console.log('Before: ' + currentTask.dueDate);
            console.log('On document id: ' + currentTask.targetDocumentIds[0].id);
            console.log('Task form can be downloaded at: ' + currentTask.taskInfo.layoutResource.url);
            console.log('\nPossible actions for this task:\n');
            currentTask.taskInfo.taskActions.forEach(currentAction => {
                console.log('Name: ' + currentAction.name + '\nCan be triggered using code or by following this link:\n' + currentAction.url);
            });
            // Validate contract(s)
            currentTask.complete('validate')
                .then(completedTask => {
                    console.log('\nWe will validate the contract.');
                    console.log('Task ' + completedTask.name + ' is now ' + completedTask.state + '.');
                    // Check contract state now that the task is completed
                    nuxeo.repository().fetch(completedTask.targetDocumentIds[0].id, {
                            schemas: ['bccontract']
                        })
                        .then(contract => {
                            console.log('Contract ' + contract.title + ' is now in the following state: ' + contract.state + '.');
                            console.log('Contract\'s expiration date has automatically been set to one year from now: ' + contract.properties['bccontract:expirationDate'] + '.');
                        });
                })
                .catch(error => {
                    console.log('Apologies, an error occurred while completing a task.');
                    console.log(error);
                });
        })
    })
    .catch(error => {
        console.log('Apologies, an error occurred while fetching the tasks.');
        console.log(error);
    });