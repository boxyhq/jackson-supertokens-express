import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Logout from "./Logout";
import UsersList from "./UsersList";

export default function Home(props) {
  const { userId, accessTokenPayload } = useSessionContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const query = gql`
    query fetchUsers {
      users {
        id
        name
        email
        company
      }
    }
  `;

  const client = new ApolloClient({
    uri: `http://localhost:8080/v1/graphql`,
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${accessTokenPayload?.jwt}`,
      "Content-Type": "application/json",
    },
  });

  async function fetchUsers() {
    const { data } = await client.query({ query });
    setUsers(data.users);
  }

  async function logoutClicked() {
    await signOut();
    navigate("/auth");
  }

  return (
    <div className="fill">
      <Logout logoutClicked={logoutClicked} />
      {/* <SuccessView userId={userId} /> */}
      <UsersList users={users} />
    </div>
  );
}
