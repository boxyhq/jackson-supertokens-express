import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionContext } from 'supertokens-auth-react/recipe/session';
import { signOut } from 'supertokens-auth-react/recipe/thirdparty';
import Logout from './Logout';
import SuccessView from './SuccessView';

export default function Home() {
  const { userId } = useSessionContext();
  const navigate = useNavigate();

  async function logoutClicked() {
    await signOut();
    navigate('/auth');
  }

  return (
    <div className="fill">
      <Logout logoutClicked={logoutClicked} />
      <SuccessView userId={userId} />
    </div>
  );
}
