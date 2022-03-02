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

app.use('/hello', (req, res) => {
  res.send('Hello there')
})

const jacksonApiUrl = 'http://jackson:5225';
const jacksonAuthUrl = 'http://localhost:5225';

const supertokenUrl = 'http://supertoken:3567';
const apiUrl = 'http://localhost:4000';
const appUrl = 'http://localhost:3366';

supertokens.init({
  framework: 'express',
  supertokens: {
    connectionURI: supertokenUrl,
  },
  appInfo: {
    appName: 'SAML Jackson',
    apiDomain: apiUrl,
    websiteDomain: appUrl,
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      override: {
        apis: (originalImplementation) => {
          return {
            ...originalImplementation,
            authorisationUrlGET: async (input) => {
              input.userContext.request = input.options.req.original
              return originalImplementation.authorisationUrlGET(input);
            },
            thirdPartySignInUpPOST: async (input) => {
              input.userContext.request = input.options.req.original
              return originalImplementation.thirdPartySignInUpPOST(input);
            },
          };
        },
      },
      providers: [
        {
          id: "saml-jackson",
          get: (redirectURI, authCodeFromRequest, userContext) => {
            let request = userContext.request;
            let tenant = request === undefined ? "" : request.query.tenant;
            let product = request === undefined ? "" : request.query.product;
            let client_id = encodeURI(`tenant=${tenant}&product=${product}`)
            return {
              accessTokenAPI: {
                url: `${jacksonApiUrl}/api/oauth/token`,
                params: {
                  client_id,
                  client_secret: "dummy",
                  grant_type: "authorization_code",
                  redirect_uri: redirectURI,
                  code: authCodeFromRequest,
                }
              },
              authorisationRedirect: {
                url: `${jacksonAuthUrl}/api/oauth/authorize`,
                params: {
                  client_id
                }
              },
              getClientId: () => {
                return client_id;
              },
              getProfileInfo: async (accessTokenAPIResponse) => {
                const profile = await axios({
                  method: 'get',
                  url: `${jacksonApiUrl}/api/oauth/userinfo`,
                  headers: {
                    Authorization: `Bearer ${accessTokenAPIResponse.access_token}`,
                  },
                });
                return {
                  id: profile.data.id,
                  email: {
                    id: profile.data.email,
                    isVerified: true
                  }
                };
              }
            }
          }
        }
      ]
    }),
    Session.init(),
  ],
});

app.use(
  cors({
    origin: 'http://localhost:3366',
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
app.use(function (err, req, res, next) { });

module.exports = app;