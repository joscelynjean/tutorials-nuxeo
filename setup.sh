#!/bin/bash

# Start container of Nuxeo
docker-compose up

# Stop the server
docker exec nuxeo bin/nuxeoctl stop

# Initialize local Nuxeo addons
docker exec nuxeo bin/nuxeoctl mp-init

# Get the list of local Nuxeo addons
docker exec nuxeo bin/nuxeoctl mp-list

# Install the addonds required for the tutorial
docker exec -ti nuxeo bin/nuxeoctl mp-install nuxeo-dam nuxeo-jsf-ui nuxeo-web-ui nuxeo-platform-getting-started

# Check the Nuxeo addons were correctly installed
docker exec nuxeo bin/nuxeoctl mp-list

# Start the server
docker exec nuxeo bin/nuxeoctl start 