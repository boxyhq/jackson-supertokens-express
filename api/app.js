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

            // Return authorize URL
            authorisationUrlGET: async (input) => {
              const { options } = input;
              const { req } = options;

              const tenant = req.getKeyValueFromQuery('tenant');
              const product = req.getKeyValueFromQuery('product');

              const url = new URL(`${jacksonAuthUrl}/api/oauth/authorize`);

              url.searchParams.append(
                'client_id',
                encodeURI(`tenant=${tenant}&product=${product}`)
              );

              return {
                status: 'OK',
                url: url.href,
              };
            },

            // Signup
            thirdPartySignInUpPOST: async (input) => {
              const { code, redirectURI, options } = input;
              const { signInUp } = options.recipeImplementation;
              const { req, res } = options;

              const tenant = req.getKeyValueFromQuery('tenant');
              const product = req.getKeyValueFromQuery('product');

              // Code exchange
              const token = await axios({
                method: 'post',
                url: `${jacksonApiUrl}/api/oauth/token`,
                data: {
                  client_id: encodeURI(`tenant=${tenant}&product=${product}`),
                  client_secret: 'dummy',
                  grant_type: 'authorization_code',
                  redirect_uri: redirectURI,
                  code: code,
                },
              });

              // Get profile
              const profile = await axios({
                method: 'get',
                url: `${jacksonApiUrl}/api/oauth/userinfo`,
                headers: {
                  Authorization: `Bearer ${token.data.access_token}`,
                },
              });

              try {
                // Signup
                const result = await signInUp({
                  thirdPartyUserId: profile.data.id,
                  thirdPartyId: 'saml-jackson',
                  email: {
                    id: profile.data.email,
                    isVerified: true,
                  },
                });

                // Create session
                await Session.createNewSession(res, result.user.id);

                return result;
              } catch (e) {
                console.log(e)
              }
            },
          };
        },
      },

      providers: [
        {
          id: 'saml-jackson',
        },
      ],
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
app.use(function (err, req, res, next) {});

module.exports = app;
