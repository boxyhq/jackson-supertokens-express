import React from "react";
import Logout from "./Logout";
import SuccessView from "./SuccessView";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

export default function Home() {
    const navigate = useNavigate();
    const sessionInfo = useSessionContext();
    if (sessionInfo.loading) {
        return null;
    }
    let userId = sessionInfo.userId;

    async function logoutClicked() {
        await signOut();
        navigate("/auth");
    }

    return (
        <div className="fill">
            <Logout logoutClicked={logoutClicked} />
            <SuccessView userId={userId} />
        </div>
    );
}
