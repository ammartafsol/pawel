import React from "react";
import classes from "./UserLayout.module.css";
import Header from "@/components/molecules/Header/Header";
import { Container } from "react-bootstrap";

const UserLayout = ({ children }) => {
  return (
    <div className={classes.userLayout}>
      <Header />
      <div className={classes.content}>
        <Container>
          <div className={classes.contentContainer}>{children}</div>
        </Container>
      </div>
    </div>
  );
};

export default UserLayout;
