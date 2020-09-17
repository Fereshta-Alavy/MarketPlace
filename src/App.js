import React, { useState, useEffect } from "react";
import "./App.css";
import { Auth, Hub, Logger, API, graphqlOperation } from "aws-amplify";
import { getUser } from "./graphql/queries";
import { registerUser } from "./graphql/mutations";
import { Authenticator, AmplifyTheme } from "aws-amplify-react";
import { Router, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import MarketPage from "./pages/MarketPage";
import ProfilePage from "./pages/ProfilePage";
import MapContainer from "./components/MapContainer";
import Navbar from "./components/Navbar";
import createBrowserHistory from "history/createBrowserHistory";

export const UserContext = React.createContext();

export const history = createBrowserHistory();

function App() {
  const logger = new Logger("My-Logger");
  const [user, setUser] = useState(null);
  const [userAttributes, setUserAttributes] = useState(null);

  useEffect(() => {
    getUserData();
    Hub.listen("auth", onAuthEvent);
  }, []);

  useEffect(() => {
    if (user) {
      getUserAttributes(user);
    }
  }, [user]);

  async function getUserData() {
    const authUser = await Auth.currentAuthenticatedUser();
    authUser ? setUser(authUser) : setUser(null);
  }

  async function getUserAttributes(authUserData) {
    const attributesArr = await Auth.userAttributes(authUserData);
    const attributeObj = Auth.attributesToObject(attributesArr);
    setUserAttributes(attributeObj);
  }

  function onAuthEvent(payload) {
    switch (payload.payload.event) {
      case "signIn":
        console.log("signed in");
        getUserData();
        registerNewUser(payload.payload.data);
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

  async function registerNewUser(signInData) {
    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub
    };

    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput));

    if (!data.getUser) {
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.signInUserSession.idToken.payload.email,
          registered: true
        };

        const newUser = await API.graphql(
          graphqlOperation(registerUser, { input: registerUserInput })
        );
        console.log(newUser);
      } catch (err) {
        console.error("error registering user", err);
      }
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
    <UserContext.Provider value={{ user, userAttributes }}>
      <Router history={history}>
        <>
          <Navbar user={user} handleSignOut={handleSignOut} />
          <div className="app-container">
            <Route exact path="/" component={HomePage} />
            <Route
              path="/profile"
              component={() => (
                <ProfilePage user={user} userAttributes={userAttributes} />
              )}
            />
            <Route
              path="/markets/:marketId"
              component={({ match }) => (
                <MarketPage
                  user={user}
                  marketId={match.params.marketId}
                  userAttributes={userAttributes}
                />
              )}
            />
            <Route
              path="/map"
              component={() => (
                <MapContainer user={user} userAttributes={userAttributes} />
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
