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

## Configure SAML Identity Provider
Follow the [doc](https://boxyhq.com/docs/jackson/configure-saml-idp). You will then need to download the SAML metadata file after configuring the SAML app with your Identity Provider. Okta is a good place and offers a free Developer Account. Feel free to contact us if you need any help with this.

## Add SAML Config

Replace `<Metadata>` with the your metadata content.

```bash
curl --location --request POST 'http://localhost:5225/api/v1/saml/config' \
  --header 'Authorization: Api-Key secret' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'rawMetadata= <Metadata>' \
  --data-urlencode 'defaultRedirectUrl=http://localhost:3366' \
  --data-urlencode 'redirectUrl=["http://localhost:3366/*"]' \
  --data-urlencode 'tenant=boxyhq.com' \
  --data-urlencode 'product=supertokens'
```

## Try the Demo
Open [http://localhost:3366](http://localhost:3366) to try the demo. Click on the button `Continue with SAML Jackson`.

# Demo Information

- The demo app is configured to use the SuperTokens self-hosted instance running on postgres `http://localhost:3567`
- The `app` (React): `http://localhost:3366`
- The `api` (Express) server: `http://localhost:4000`
- Jackson self-hosted instance server: `http://localhost:5225`
- Jackson uses `Postgres` as database engine
