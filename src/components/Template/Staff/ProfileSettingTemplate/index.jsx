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
import useAxios from "@/interceptor/axios-functions";
import { uploadMedia } from "@/resources/utils/mediaUpload";
import { useDispatch } from "react-redux";
import classes from "./ProfileSettingTemplate.module.css";
import { updateUser } from "@/store/auth/authSlice";

const ProfileSettingTemplate = () => {
  const router = useRouter();
  const [loading, setLoading] = useState("");
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { Post, Patch } = useAxios();


  const initialValues = {
    photo: null,
    fullName: "",
    email: "",
    phoneValue: "",
    countryCode: "",
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
      // react-phone-input-2 expects digits including dial code (no '+')
      phoneValue: "92343243432",
      countryCode: "+92",
      phoneNumber: "343243432",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values) => {
    setLoading("loading");
      let photoKey = null;
      
      // Upload image first if a new photo is selected
      if (values.photo && values.photo instanceof File) {
        const uploadResponse = await uploadMedia({
          files: [values.photo],
          Post,
          route: "media/upload",
        });
        
        if (uploadResponse) {
          // Extract key from response
          if (uploadResponse.images && Array.isArray(uploadResponse.images) && uploadResponse.images.length > 0) {
            photoKey = uploadResponse.images[0].key;
          } else if (uploadResponse.photo && Array.isArray(uploadResponse.photo) && uploadResponse.photo.length > 0) {
            photoKey = uploadResponse.photo[0].key;
          }
        }
      }
      
      // Prepare update payload
      const updatePayload = {
        fullName: values.fullName,
        countryCode: values.countryCode,
        phoneNumber: values.phoneNumber,
      };
      
      // Add photo key if image was uploaded
      if (photoKey) {
        updatePayload.photo = photoKey;
      }
      
      // Update user profile
      const { response } = await Patch({
        route: "users/update/me",
        data: updatePayload,
      });
      
      if (response) {
        RenderToast({
          message: "Profile updated successfully",
          type: "success",
        });
        dispatch(updateUser(response?.data));
      setLoading("");
    } 
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
                    value={profileFormik.values.phoneValue || ""}
                    setValue={(value, meta) => {
                      const dialCode = meta?.dialCode ? String(meta.dialCode) : "";
                      const raw = (value || "").toString().replaceAll(/\D/g, "");
                      const national =
                        dialCode && raw.startsWith(dialCode)
                          ? raw.slice(dialCode.length)
                          : raw;

                      profileFormik.setFieldValue("phoneValue", raw);
                      profileFormik.setFieldValue("countryCode", meta?.countryCode || "");
                      profileFormik.setFieldValue("phoneNumber", national);
                    }}
                    error={profileFormik.touched.phoneNumber && profileFormik.errors.phoneNumber}
                    className={classes.inputField}
                  />
                </div>

                <div className={classes.buttonContainer}>
                  <Button
                    label="Update Password"
                    variant="outlined"
                    className={classes.updatePasswordButton}
                    onClick={() => {router.push("/update-password")}}
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
