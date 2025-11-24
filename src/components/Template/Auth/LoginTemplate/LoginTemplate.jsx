import React from "react";
import classes from "./LoginTemplate.module.css";
import AuthWrapper from "@/components/atoms/AuthWrapper/AuthWrapper";
import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";

const LoginTemplate = () => {
  return (
    <AuthWrapper
      title="Login to your account"
      description="Enter your details to login"
    >
      <div className={classes.loginForm}>
        <div className={classes.inputContainer}>
          <Input type="email" label="Email" placeholder="Enter your email" />
          <Input label="Password" placeholder="Enter your password" />
        <div className={classes.buttonContainer}> 
          <div className={classes.forgotPasswordContainer}>
            <Checkbox label="Keep me logged in" />
            <div className={classes.forgotPassword}>Forgot password?</div>
          </div>
          <Button
            variant="primary"
            label="Sign In"
            className={classes.loginButton}
          />
        </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default LoginTemplate;
