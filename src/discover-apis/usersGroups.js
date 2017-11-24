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

const groups = [
  // sales group
  {
    groupname: 'sales',
    grouplabel: 'Sales'
  },
  // managers group
  {
    groupname: 'managers',
    grouplabel: 'Managers'
  }
];

// Define the users
const users = [{
  properties: {
    'entity-type': 'user',
    username: 'jdoe',
    password: 'jdoe',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Big Corp',
    email: 'jdoe@example.com',
    groups: ['members']
  }
}, {
  properties: {
    'entity-type': 'user',
    username: 'afraser',
    password: 'afraser',
    firstName: 'Alicia',
    lastName: 'Fraser',
    company: 'Big Corp',
    email: 'afraser@example.something',
    groups: ['members', 'sales']
  }
}, {
  properties: {
    'entity-type': 'user',
    username: 'sconnor',
    password: 'sconnor',
    firstName: 'Sarah',
    lastName: 'Connor',
    company: 'Big Corp',
    email: 'sconnor@example.something',
    groups: ['members', 'sales', 'managers']
  }
}];

Promise.all(groups.map((group) => {
    return nuxeo.groups().create(group);
  }))
  .then(values => {
    values.forEach(group => {
      console.log(`Group ${group.groupname} has been created.`);
    });
  })
  .then(() => {
    return Promise.all(users.map(function(user) {
        return nuxeo.users().create(user);
      }));
  })
  .then(values => {
    values.forEach(user => {
      // Display the usernames that have been created
      console.log(`User ${user.properties.username} has been created.`);
    });
  })
  .catch(error => {
    console.log('Apologies, an error occurred.');
    console.log(error);
  });