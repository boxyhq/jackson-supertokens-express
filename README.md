# SAML Jackson + SuperTokens Demo App

This demo app shows how to integrate [SAML Jackson](https://github.com/boxyhq/jackson) in a Node + React app that uses SuperTokens for user authentication.

You have to host a SAML Jackson instance on Docker.

You'll also need a SuperTokens instance. You can use a self hosted instance or purchase a subscription or use their demo instance.

## Demo Instructions

- The demo app is configured to use the SuperTokens demo instance `https://try.supertokens.io`
- The `api` server runs at `http://localhost:4000`
- The `app` (React) runs at `http://localhost:3000`

## Setup Demo

### Clone the repo

`git clone https://github.com/devkiran/jackson-supertokens.git`

`cd jackson-supertokens`

### Setup api

`cd api`

`npm install`

`npm start`

### Setup app

`cd app`

`npm install`

`npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
