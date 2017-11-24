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
getContractsQuery = "SELECT * FROM BCContract " +
  " WHERE ecm:isVersion = 0 " +
  " AND ecm:currentLifeCycleState != 'deleted' " +
  " AND ecm:fulltext = 'limit%' " + // % will act as a joker
  " AND bccontract:expirationDate < DATE '2016-01-01' ";
nuxeo
  .repository()
  .query({
    query: getContractsQuery
  })
  .then(function(contracts) {
    console.log('The following contracts have been retrieved:');
    console.log(contracts);
  })
  .catch(function(error) {
    console.log('Apologies, an error occurred while launching the query.');
    console.log(error);
  });