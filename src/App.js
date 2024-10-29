import { useState } from "react"; //https://docs.github.com/fr/graphql/overview/explorer
import "./App.css";
import { gql, useLazyQuery } from "@apollo/client";

const GET_USER_REPOS = gql`
  query GetUserRepos($username: String!) {
    user(login: $username) {
      avatarUrl
      name
      repositories(first: 5) {
        nodes {
          id
          name
          description
          url
        }
      }
    }
  }
`;

function App() {
  const [username, setUsername] = useState("");
  const [getUserRepos, { loading, error, data }] = useLazyQuery(GET_USER_REPOS);

  const handleSearch = () => {
    if (username.trim() === "") return;
    getUserRepos({
      variables: { username },
    });
  };

  const handleKeePress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>GitHub Repositories</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        placeholder="Enter User"
        onKeyPress={handleKeePress}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && (
        <p>
          Error:{" "}
          {error.message.includes("404") ? "User not found." : error.message}
        </p>
      )}

      {data && data.user && (
        <div>
          <img
            src={data.user.avatarUrl}
            alt={data.user.name}
            width={100}
            style={{ borderRadius: "50%", marginTop: "20px" }}
          />
          <h1>{data.user.name}</h1>
          <h3>Repositories</h3>
          {data.user.repositories.nodes.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {data.user.repositories.nodes.map((repo) => {
                return (
                  <li key={repo.id} style={{ marginBottom: "10px" }}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <strong>{repo.name}</strong>
                    </a>
                    <p>{repo.description || "No description available."}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No repositories</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
