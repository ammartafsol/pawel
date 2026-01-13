"use client";
import React, { useState, useEffect } from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import classes from "./GenerateTicketModal.module.css";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { useFormik } from "formik";
import { GenerateTicketSchema } from "@/formik/schema";
import { generateTicketFormValues } from "@/formik/initialValues";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";

const GenerateTicketModal = ({ show, setShow }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState('');
  const { Get, Post } = useAxios();

  const formik = useFormik({
    initialValues: generateTicketFormValues,
    validationSchema: GenerateTicketSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });


  const fetchCategories = async () => {
    setLoading('categories');
    const { response } = await Get({ route: "category/all" });
    if (response?.status === "success" && response?.data) {
      const categoryOptions = response.data.map((category) => ({
        label: category.name,
        value: category._id,
      }));
      setCategories(categoryOptions);
    }
    setLoading('');
  };


  useEffect(() => {
 
    if (show) {
      fetchCategories();
    }
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const handleSubmit = async (values) => {
    setLoading('submitting');
    const { response } = await Post({
      route: "support/create",
      data: {
        message: values.message,
        categorySlug: values.categorySlug,
      },
    });

    if (response) {
      RenderToast({
        type: "success",
        message: "Ticket created successfully",
      });
      formik.resetForm();
      setShow(false);
    }
    setLoading('');
  };

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      heading="Generate Ticket"
      showCloseIcon={true}
      footerClass={classes.footerContainer}
      footerData={
        <Button
          variant="outlined"
          label={loading === 'submitting' ? 'please wait...' : 'Send Message'}
          className={classes.sendMessageButton}
          onClick={() => formik.handleSubmit()}
          disabled={loading === 'submitting'}
        />
      }
    >
      <div className={classes.mainContainer}>
        <div className={classes.headingContainer}>
          <div className={classes.imageContainer}>
            <Image src={"/app-images/ticket.png"} fill alt="logo" />
          </div>
          <h4>How can we help you?</h4>
        </div>
        <div className={classes.dropdownContainer}>
          <DropDown
            options={categories}
            values={formik.values.categorySlug ? categories.filter(opt => opt.value === formik.values.categorySlug) : []}
            placeholder="Select a category"
            closeOnSelect={true}
            loading={loading === 'categories'}
            onChange={(value) => {
              const selectedValue = value && value.length > 0 ? value[0]?.value : "";
              formik.setFieldValue("categorySlug", selectedValue);
            }}
            label={"Category"}
          />
          {formik.touched.categorySlug && formik.errors.categorySlug && (
            <div className={classes.errorText}>{formik.errors.categorySlug}</div>
          )}
          <TextArea 
            placeholder="Please briefly describe your issue here..." 
            value={formik.values.message}
            setValue={(value) => formik.setFieldValue("message", value)}
            error={formik.touched.message && formik.errors.message}
          />
        </div>
      </div>
    </ModalSkeleton>
  );
};

export default GenerateTicketModal;
