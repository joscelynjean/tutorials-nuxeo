# Nuxeo tutorials

All the example are took from the official website, that you can find here : https://doc.nuxeo.com/nxdoc/getting-started/

# Quick start

Initialize your Nuxeo environment by running the setup script

    ./setup.sh

It is recommended to register your instance after the initialization. You can access your instance from http://localhost:8080

To start or stop your environment, you can use the following command :

    # To start
    docker-compose start

    # To stop
    docker-compose stop

# Tutorials

## Discover Nuxeo Platform APIs

Description of the tutorial can be found here : https://doc.nuxeo.com/nxdoc/discover-nuxeo-platform-apis/

To run a specific script, you must run it from the root of the project :

    node ./src/discover-apis/{FILE_NAME}

Files can be found under the *data/discover-apis-files* directory. The temporary directory (/tmp) can be found under the *data/tmp* directory.

