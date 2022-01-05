# SAML Jackson + SuperTokens Demo App

This demo app shows how to integrate [SAML Jackson](https://github.com/boxyhq/jackson) in a Node + React app that uses SuperTokens for user authentication.

You have to host a SAML Jackson instance on Docker.

You'll also need a SuperTokens instance. You can use a self hosted instance or purchase a subscription or use their demo instance.

## Demo Instructions

- The demo app is configured to use the SuperTokens demo instance `https://try.supertokens.io`
- The `api` server runs at `http://localhost:4000`
- The `app` (React) runs at `http://localhost:3000`

## Setup Demo

### Install SAML Jackson

`git clone https://github.com/boxyhq/jackson.git`

`cd jackson`

`npm run dev-dbs`

`docker run --network=dev_default -p 5000:5000 -p 6000:6000 -e JACKSON_API_KEYS='secret' -e DB_URL='postgres://postgres:postgres@dev-postgres-1:5432/postgres' boxyhq/jackson:40706fd`

### Add SAML Metadata for a client

Replace the `<Metadata XML>` with IdP Metadata XML.

```sh
curl --location --request POST 'http://localhost:6000/api/v1/saml/config' \
--header 'Authorization: Api-Key secret' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rawMetadata=<Metadata XML>' \
--data-urlencode 'defaultRedirectUrl=http://localhost:3000/oauth/callback/saml-jackson' \
--data-urlencode 'redirectUrl=["http://localhost:3000/*"]' \
--data-urlencode 'tenant=boxyhq.com' \
--data-urlencode 'product=demo'
```

The response returns a JSON with `client_id` and `client_secret`. We'll need it in the next step.

### Clone this repo

`git clone https://github.com/devkiran/jackson-supertokens.git`

`cd jackson-supertokens`

### Setup app

`cd app`

`npm install`

`npm start`

Open [http://localhost:3000/auth](http://localhost:3000/auth) to view it in your browser. The page will reload when you make changes.

### Setup api

`cd api`

`npm install`

Replace the OAuth client details on the line #21

```javascript
const oauth = {
  clientId: '<client_id>',
  clientSecret: '<client_secret>',
  url: 'http://localhost:5000/oauth', // Jackson OAuth server
};
```

`npm start`
