import { BrowserRouter, Routes } from 'react-router-dom';
import SuperTokens, {
  getSuperTokensRoutesForReactRouterDom,
} from 'supertokens-auth-react';
import Session from 'supertokens-auth-react/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import './App.css';

SuperTokens.init({
  appInfo: {
    appName: 'Jackson',
    apiDomain: 'http://localhost:4000',
    websiteDomain: 'http://localhost:3000',
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
        {getSuperTokensRoutesForReactRouterDom(require('react-router-dom'))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
