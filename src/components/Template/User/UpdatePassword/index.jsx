"use client";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import RenderToast from "@/components/atoms/RenderToast";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoLockClosedOutline } from "react-icons/io5";
import classes from "./UpdatePassword.module.css";
import { usePathname } from "next/navigation";


const UpdatePasswordTemplate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState("");

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters"),
    reEnterNewPassword: Yup.string()
      .required("Please re-enter your password")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const updatePasswordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      reEnterNewPassword: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, { resetForm });
    },
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading("loading");
    
    // Simulate API delay
    setTimeout(() => {
      RenderToast({
        type: "success",
        message: "Password Updated Successfully",
      });
      resetForm();
      setLoading("");
    }, 1000);
    
    // API call commented out for now
    // const obj = {
    //   currentPassword: values.oldPassword,
    //   password: values.newPassword,
    //   confirmPassword: values.reEnterNewPassword,
    // };
    // const {response} = await Patch({ route: "auth/update/password", data: obj });
    // if (response) {
    //   RenderToast({
    //     type: "success",
    //     message: "Password Updated Successfully",
    //   });
    //   resetForm();
    // }
    // setLoading("");
  };

  return (
    <div className="p24">
      <Wrapper
        contentClassName={classes.contentClassName}
        headerComponent={
          <div className={classes.headerContainer}>
            <Button
              className={classes.backButton}
              variant="outlined"
              leftIcon={<IoChevronBack color="#151529" />}
              label="Back"
              onClick={() => router.back()}
            />
            <h4 className={classes.heading}>Update Password</h4>
          </div>
        }
      >
        <div className={classes.passwordContainer}>
          <div className={classes.passwordCard}>
            <div className={classes.iconSection}>
              <div className={classes.iconWrapper}>
                <IoLockClosedOutline size={32} />
              </div>
              <h5 className={classes.sectionTitle}>Change Your Password</h5>
              <p className={classes.sectionDescription}>
                For your security, please enter your current password and choose a new one.
              </p>
            </div>

            <div className={classes.formSection}>
              <div className={classes.form}>
                <div className={classes.inputGroup}>
                  <Input
                    label="Current Password"
                    setValue={(e) =>
                      updatePasswordFormik.setFieldValue("oldPassword", e)
                    }
                    error={
                      updatePasswordFormik.touched.oldPassword &&
                      updatePasswordFormik.errors.oldPassword
                    }
                    value={updatePasswordFormik.values.oldPassword}
                    type="password"
                    placeholder="Enter your current password"
                    className={classes.inputField}
                  />
                </div>

                <div className={classes.inputGroup}>
                  <Input
                    label="New Password"
                    setValue={(e) =>
                      updatePasswordFormik.setFieldValue("newPassword", e)
                    }
                    error={
                      updatePasswordFormik.touched.newPassword &&
                      updatePasswordFormik.errors.newPassword
                    }
                    value={updatePasswordFormik.values.newPassword}
                    type="password"
                    placeholder="Enter your new password"
                    className={classes.inputField}
                  />
                  <p className={classes.passwordHint}>
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className={classes.inputGroup}>
                  <Input
                    label="Confirm New Password"
                    setValue={(e) =>
                      updatePasswordFormik.setFieldValue("reEnterNewPassword", e)
                    }
                    error={
                      updatePasswordFormik.touched.reEnterNewPassword &&
                      updatePasswordFormik.errors.reEnterNewPassword
                    }
                    value={updatePasswordFormik.values.reEnterNewPassword}
                    type="password"
                    placeholder="Re-enter your new password"
                    className={classes.inputField}
                  />
                </div>
              </div>

              <div className={classes.buttonContainer}>
                <Button
                  onClick={updatePasswordFormik.handleSubmit}
                  disabled={loading === "loading"}
                  label={loading === "loading" ? "Updating..." : "Update Password"}
                  className={classes.updateButton}
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default UpdatePasswordTemplate;
