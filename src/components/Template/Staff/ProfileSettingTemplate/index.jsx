"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import PhoneInput from "@/components/atoms/PhoneInput/PhoneInput";
import UploadImageBox from "@/components/molecules/UploadImageBox";
import Wrapper from "@/components/atoms/Wrapper/Wrapper";
import RenderToast from "@/components/atoms/RenderToast";
import { IoChevronBack } from "react-icons/io5";
import classes from "./ProfileSettingTemplate.module.css";

const ProfileSettingTemplate = () => {
  const router = useRouter();
  const [loading, setLoading] = useState("");
const pathname = usePathname();


  const initialValues = {
    photo: null,
    fullName: "",
    email: "",
    phoneNumber: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full Name is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .max(16, "Phone number must not exceed 16 digits"),
  });

  const profileFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    // Set default values for demo
    profileFormik.setValues({
      photo: null,
      fullName: "Admin User",
      email: "admin@admin.com",
      phoneNumber: "+92 343 243432",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values) => {
    setLoading("loading");
    
    // Simulate API delay
    setTimeout(() => {
      RenderToast({
        message: "Profile updated successfully",
        type: "success",
      });
      setLoading("");
    }, 1000);
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
            <h4 className={classes.heading}>Profile Settings</h4>
          </div>
        }
      >
        <div className={classes.profileContainer}>
          <div className={classes.profileSection}>
            <div className={classes.photoSection}>
              <h5 className={classes.sectionTitle}>Profile Photo</h5>
              <div className={classes.photoWrapper}>
                <UploadImageBox
                  containerClass={classes.uploadImageContainerClass}
                  hideDeleteIcon={true}
                  state={profileFormik.values.photo}
                  uploadImageBox={classes.uploadImageBox}
                  setter={(file) => profileFormik.setFieldValue("photo", file)}
                  onDelete={() => profileFormik.setFieldValue("photo", null)}
                  imgClass={classes.uploadImage}
                  label={""}
                />
              </div>
              <p className={classes.photoHint}>
                Recommended: Square image, at least 200x200 pixels
              </p>
            </div>

            <div className={classes.formSection}>
              <h5 className={classes.sectionTitle}>Personal Information</h5>
              <div className={classes.form}>
                <div className={classes.formRow}>
                  <Input
                    label="Full Name"
                    placeholder="Enter full name"
                    value={profileFormik.values.fullName}
                    setValue={(value) => profileFormik.setFieldValue("fullName", value)}
                    error={profileFormik.touched.fullName && profileFormik.errors.fullName}
                    className={classes.inputField}
                  />
                </div>

                <div className={classes.formRow}>
                  <Input
                    label="Email"
                    placeholder="Enter email"
                    value={profileFormik.values.email}
                    disabled={true}
                    className={classes.disabledInput}
                  />
                </div>

                <div className={classes.formRow}>
                  <PhoneInput
                    label="Phone Number"
                    value={profileFormik.values.phoneNumber || ""}
                    setValue={(value) => profileFormik.setFieldValue("phoneNumber", value)}
                    error={profileFormik.touched.phoneNumber && profileFormik.errors.phoneNumber}
                    className={classes.inputField}
                  />
                </div>

                <div className={classes.buttonContainer}>
                  <Button
                    label="Update Password"
                    variant="outlined"
                    className={classes.updatePasswordButton}
                    onClick={() => {pathname.includes('/staff') ? router.push("/staff/update-password") : router.push("/user/update-password")}}
                  />
                  <Button
                    label={loading === "loading" ? "Please wait..." : "Save Changes"}
                    className={classes.saveButton}
                    disabled={loading === "loading"}
                    onClick={() => profileFormik.handleSubmit()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default ProfileSettingTemplate;
