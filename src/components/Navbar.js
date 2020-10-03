import React from "react";
import { Menu as Nav, Icon, Button } from "element-react";
import { NavLink } from "react-router-dom";

function Navbar({ user, handleSignOut }) {
  return (
    <Nav mode="horizontal" theme="light" defaultActive="1">
      <div className="nav-container">
        <Nav.Item index="1">
          <NavLink to="/" className="nav-link">
            <span className="app-title">
              <img src="https://img.icons8.com/plasticine/50/000000/like--v1.png" />
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
            <Button type="warning" color="" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Nav.Item>
        </div>
      </div>
    </Nav>
  );
}

export default Navbar;
