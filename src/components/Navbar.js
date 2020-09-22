import React from "react";
import { Menu as Nav, Icon, Button } from "element-react";
import { NavLink } from "react-router-dom";

function Navbar({ user, handleSignOut }) {
  console.log("user in nav bar", user);

  return (
    <Nav mode="horizontal" theme="dark" defaultActive="1">
      <div className="nav-container">
        <Nav.Item index="1">
          <NavLink to="/" className="nav-link">
            <span className="app-title">
              <img
                src="https://img.icons8.com/nolan/64/merchant-account.png"
                className="app-icon"
                alt=""
              ></img>
              freebie
            </span>
          </NavLink>
        </Nav.Item>
        <div className="nav-items">
          <Nav.Item index="2">
            <span className="app-user"> Hello , {user.attributes.email}</span>
          </Nav.Item>
          <Nav.Item index="3">
            <NavLink to="/profile" className="nav-link">
              <Icon name="setting"></Icon>
              profile
            </NavLink>
          </Nav.Item>
          <Nav.Item index="4">
            <Button type="warning" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Nav.Item>
        </div>
      </div>
    </Nav>
  );
}

export default Navbar;
