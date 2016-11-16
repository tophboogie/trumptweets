#!/usr/bin/env bash

# nodejs
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs

# database installs
apt-get -y install mongodb

# npm-check-updates auto-updater
npm install -g npm-check-updates

# nodejs pm2 module
# npm install -g pm2
