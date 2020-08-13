import React, { useState, useEffect } from "react";
import "./App.css";
import { Auth, Hub, Logger } from "aws-amplify";
import { Authenticator, AmplifyTheme } from "aws-amplify-react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import MarketPage from "./pages/MarketPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
export const UserContext = React.createContext();

function App() {
  const logger = new Logger("My-Logger");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserData();
    Hub.listen("auth", onAuthEvent);
  }, []);

  async function getUserData() {
    const user = await Auth.currentAuthenticatedUser();
    user ? setUser(user) : setUser(null);
  }

  function onAuthEvent(payload) {
    console.log("hereeee");
    switch (payload.payload.event) {
      case "signIn":
        console.log("signed in");
        getUserData();
        break;

      case "signUp":
        console.log("signed up");
        break;

      case "signOut":
        console.log("signed out");
        setUser(null);
        break;
      default:
        return;
    }
  }

  async function handleSignOut() {
    try {
      await Auth.signOut();
    } catch (err) {
      console.log("error signing out user", err);
    }
  }

  return !user ? (
    <Authenticator theme={theme} />
  ) : (
    <UserContext.Provider value={{ user }}>
      <Router>
        <>
          <Navbar user={user} handleSignOut={handleSignOut} />
          <div className="app-container">
            <Route exact path="/" component={HomePage} />
            <Route path="/profile" component={ProfilePage} />
            <Route
              path="/markets/:marketId"
              component={({ match }) => (
                <MarketPage marketId={match.params.marketId} />
              )}
            />
          </div>
        </>
      </Router>
    </UserContext.Provider>
  );
  // <div>app</div>
}
const theme = {
  ...AmplifyTheme,
  button: {
    ...AmplifyTheme.button,
    backgroundColor: "#f90"
  }
};

export default App;
