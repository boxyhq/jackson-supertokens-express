export default function UsersList({ users }) {
  return (
    <div
      className="fill"
      style={{
        width: "100%",
        alignItems: "center",
        fontWeight: "bold",
        color: "#333333",
      }}
    >
      <h2>Users list fetched via GraphQL (Hasura)</h2>
      <ul>
        {users.map((user, idx) => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.company}
          </li>
        ))}
      </ul>

      <div />
    </div>
  );
}
