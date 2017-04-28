# TrumpTweets
A Twitter scraper that logs Trump's emotional state via IBM Watson API

- Install VirtualBox and Vagrant
- Install Vagrant Plugins
    - `vagrant plugin install vagrant-vbguest` (to sync guest-additions installation automatically)
    - `vagrant plugin install vagrant-notify-forwarder` (to ensure file updates are registered by the box)
- Rename 'credentials-example.sh' to 'credentials.sh' and fill in OAuth keys
- Run:
    - `vagrant up`
    - `vagrant ssh`
    - `cd /vagrant`
- Install nodejs dependencies:
    - `yarn install`
- Grab all available tweets (for initializing the tweets db)
    - `node backend/populateTweetDB.js`
- Create wordmap database
    - `node backend/populateWordDB.js`
- Start new tweet scraper
    - `yarn run startScraper`
- Start API
    - `yarn run startApi`
- Webpack server
    - `yarn start`
    - connect at `http://localhost:3000`
- Compile front end
    - `yarn build`
