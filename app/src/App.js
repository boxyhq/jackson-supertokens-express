import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SuperTokens, {
  getSuperTokensRoutesForReactRouterDom,
} from 'supertokens-auth-react';
import Session from 'supertokens-auth-react/recipe/session';
import { ThirdPartyAuth } from 'supertokens-auth-react/recipe/thirdparty';
import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import './App.css';
import Home from './Home';

export function getApiDomain() {
  const apiPort = process.env.REACT_APP_API_PORT || 4000;
  const apiUrl = process.env.REACT_APP_API_URL || `http://localhost:${apiPort}`;
  return apiUrl;
}

export function getWebsiteDomain() {
  const websitePort = process.env.REACT_APP_WEBSITE_PORT || 3000;
  const websiteUrl =
    process.env.REACT_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
  return websiteUrl;
}

SuperTokens.init({
  appInfo: {
    appName: 'Jackson',
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      signInAndUpFeature: {
        providers: [
          {
            id: 'saml-jackson',
            name: 'SAML Jackson',
          },
        ],
      },
    }),

    Session.init(),
  ],
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* This shows the login UI on "/auth" route */}
        {getSuperTokensRoutesForReactRouterDom(require('react-router-dom'))}

        <Route
          path="/"
          element={
            <ThirdPartyAuth>
              <Home />
            </ThirdPartyAuth>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
