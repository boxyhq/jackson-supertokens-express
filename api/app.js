var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let cors = require('cors');
const axios = require('axios');
let supertokens = require('supertokens-node');
let Session = require('supertokens-node/recipe/session');
let { middleware } = require('supertokens-node/framework/express');
let { errorHandler } = require('supertokens-node/framework/express');
let ThirdPartyEmailPassword = require('supertokens-node/recipe/thirdpartyemailpassword');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// OAuth client
const oauth = {
  clientId: '8958e13053832b5af58fdf2ee83f35f5d013dc74',
  clientSecret: 'a1f508136cd39a4817ff3f52d871ec61115d86b33a25c89e',
  url: 'http://localhost:5000/oauth',
};

supertokens.init({
  framework: 'express',
  supertokens: {
    connectionURI: 'https://try.supertokens.io',
  },
  appInfo: {
    appName: 'SAML Jackson',
    apiDomain: 'http://localhost:4000',
    websiteDomain: 'http://localhost:3000',
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      override: {
        apis: (originalImplementation) => {
          return {
            ...originalImplementation,
            authorisationUrlGET: async ({ options }) => {
              const tenant = options.req.getKeyValueFromQuery('tenant');
              const product = options.req.getKeyValueFromQuery('product');

              const url = new URL(`${oauth.url}/authorize`);

              url.searchParams.append(
                'client_id',
                encodeURI(`tenant=${tenant}&product=${product}`)
              );

              return {
                status: 'OK',
                url: url.href,
              };
            },
          };
        },
      },

      providers: [
        {
          id: 'saml-jackson',
          get: (redirectURI, authCodeFromRequest) => {
            return {
              // Return access token
              accessTokenAPI: {
                url: `${oauth.url}/token`,
                params: {
                  client_id: oauth.clientId,
                  client_secret: oauth.clientSecret,
                  grant_type: 'authorization_code',
                  redirect_uri: redirectURI,
                  code: authCodeFromRequest,
                },
              },

              // Return authorize URL (Default implementation)
              authorisationRedirect: {
                url: `${oauth.url}/authorize`,
                params: {
                  client_id: oauth.clientId,
                  response_type: 'code',
                },
              },

              // Return client id
              getClientId: () => {
                return oauth.clientId;
              },

              // Get the profile info
              getProfileInfo: async (accessTokenAPIResponse) => {
                const { data } = await axios({
                  method: 'get',
                  url: `${oauth.url}/userinfo`,
                  headers: {
                    Authorization: `Bearer ${accessTokenAPIResponse.access_token}`,
                  },
                });

                return {
                  id: data.id,
                  email: {
                    id: data.email,
                    isVerified: true,
                  },
                };
              },
            };
          },
        },
      ],
    }),

    Session.init(),
  ],
});

app.use(
  cors({
    origin: 'http://localhost:3000',
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
);

app.use(middleware());
app.use(errorHandler());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {});

module.exports = app;
