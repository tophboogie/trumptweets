#!/usr/bin/env bash

# nodeJS
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs

# mongoDB
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
apt-get update
apt-get install -y mongodb-org

# npm-check-updates auto-updater
npm install -g npm-check-updates

# nodejs pm2 server module
npm install -g pm2

# install yarn so we can use that if we want
npm install -g yarn

# set up environment variables
cp /vagrant/system/credentials.sh /etc/profile.d/credentials.sh

# disable THP for mongoDB
cp /vagrant/system/disable-thp /etc/init.d/disable-thp
update-rc.d disable-thp defaults

# remove unneeded packages
apt-get autoremove -y
