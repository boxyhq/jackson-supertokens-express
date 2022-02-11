# SAML Jackson + SuperTokens Demo App

This demo app shows how to integrate [SAML Jackson](https://github.com/boxyhq/jackson) in a Node + React app that uses SuperTokens for user authentication. Both SAML Jackson and Supertokens are self-hosted but can also work with hosted versions.

A docker-compose file is provided to ease testing.

## Setup

```bash
git clone https://github.com/boxyhq/jackson-supertokens-express.git
```

```bash
cd jackson-supertokens-express
```

```bash
npm run dev
```

## Add SAML Config

Replace `<Metadata>` with the your metadata content.

```bash
curl --location --request POST 'http://localhost:5000/api/v1/saml/config' \
  --header 'Authorization: Api-Key secret' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'rawMetadata= <Metadata>' \
  --data-urlencode 'defaultRedirectUrl=http://localhost:3000' \
  --data-urlencode 'redirectUrl=["http://localhost:3000/*"]' \
  --data-urlencode 'tenant=boxyhq.com' \
  --data-urlencode 'product=demo'
```

## Configure SAML Identity Provider
Follow the [doc](https://boxyhq.com/docs/jackson/configure-saml-idp) 

## Try the Demo
Open [http://localhost:3000](http://localhost:3000) to try the demo.

# Demo Information

- The demo app is configured to use the SuperTokens self-hosted instance running on postgres `http://localhost:3567`
- The `app` (React): `http://localhost:3000`
- The `api` (Express) server: `http://localhost:4000`
- Jackson self-hosted instance server: `http://localhost:5000`
- Jackson uses `Postgres` as database engine

## Setup Demo

### Add SAML Metadata for a client

Replace the `<Metadata XML>` with IdP Metadata XML.

```bash
curl --location --request POST 'http://localhost:6000/api/v1/saml/config' \
--header 'Authorization: Api-Key secret' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'rawMetadata=<Metadata XML>' \
--data-urlencode 'defaultRedirectUrl=http://localhost:3000/auth/callback/saml-jackson' \
--data-urlencode 'redirectUrl=["http://localhost:3000/*"]' \
--data-urlencode 'tenant=boxyhq.com' \
--data-urlencode 'product=demo'
```

The response returns a JSON with `client_id` and `client_secret`. We'll need it in the next step.

Open [http://localhost:3000/auth](http://localhost:3000/auth) to view it in your browser. The page will reload when you make changes. Click on the button `Continue with SAML Jackson`
