var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let supertokens = require('supertokens-node');
let Session = require('supertokens-node/recipe/session');
let cors = require('cors');
let { middleware } = require('supertokens-node/framework/express');
let { errorHandler } = require('supertokens-node/framework/express');
let {
  verifySession,
} = require('supertokens-node/recipe/session/framework/express');
let ThirdPartyEmailPassword = require('supertokens-node/recipe/thirdpartyemailpassword');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const oauth = {
  clientId: '8958e13053832b5af58fdf2ee83f35f5d013dc74',
  clientSecret: 'a1f508136cd39a4817ff3f52d871ec61115d86b33a25c89e',
  jacksonBaseUrl: 'http://localhost:5000/oauth',
};

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
            console.log(redirectURI, authCodeFromRequest);

            return {
              accessTokenAPI: {
                url: `${oauth.jacksonBaseUrl}/token`,
                params: {
                  client_id: oauth.clientId,
                  client_secret: oauth.clientSecret,
                  grant_type: 'authorization_code',
                  redirect_uri: redirectURI,
                  code: authCodeFromRequest,
                },
              },
              authorisationRedirect: {
                url: `${oauth.jacksonBaseUrl}/authorize`,
                params: {
                  client_id: oauth.clientId,
                  response_type: 'code',
                },
              },
              getClientId: () => {
                return oauth.clientId;
              },
              getProfileInfo: async (accessTokenAPIResponse) => {
                return {
                  id: '1212122121',
                  email: {
                    id: 'demo1212122121@google.com',
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
