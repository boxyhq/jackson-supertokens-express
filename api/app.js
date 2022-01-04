var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let supertokens = require('supertokens-node');
let Session = require('supertokens-node/recipe/session');
let EmailPassword = require('supertokens-node/recipe/emailpassword');
let cors = require('cors');
let { middleware } = require('supertokens-node/framework/express');
let { errorHandler } = require('supertokens-node/framework/express');
let ThirdParty = require('supertokens-node/recipe/thirdparty');
let { Google, Github, Apple } = ThirdParty;
let {
  verifySession,
} = require('supertokens-node/recipe/session/framework/express');
let ThirdPartyEmailPassword = require('supertokens-node/recipe/thirdpartyemailpassword');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const jacksonBaseUrl = 'https://boxyhq.com/';
const clientId = '123';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

supertokens.init({
  framework: 'express',
  supertokens: {
    connectionURI: 'https://try.supertokens.io',
  },
  appInfo: {
    appName: 'Jackson',
    apiDomain: 'http://localhost:4000',
    websiteDomain: 'http://localhost:3000',
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      providers: [
        {
          id: 'saml-jackson',
          get: (redirectURI, authCodeFromRequest) => {
            return {
              accessTokenAPI: {
                url: 'https://oauth.example.com/token',
                params: {
                  client_id: clientId,
                  client_secret: '<CLIENT SECRET>',
                  grant_type: 'authorization_code',
                  redirect_uri: redirectURI,
                  code: authCodeFromRequest,
                },
              },
              authorisationRedirect: {
                url: 'https://oauth.example.com',
                params: {
                  client_id: clientId,
                  response_type: 'code',
                },
              },
              getClientId: () => {
                return clientId;
              },
              getProfileInfo: async (accessTokenAPIResponse) => {},
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

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/me', verifySession(), async (req, res) => {
  const { userId } = req.session;

  // const userInfo = await EmailPassword.getUserById(userId);

  res.send({
    userId,
  });
});

app.use(errorHandler());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
