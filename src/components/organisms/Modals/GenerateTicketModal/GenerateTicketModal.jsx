"use client";
import React from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import Image from "next/image";
import classes from "./GenerateTicketModal.module.css";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { ticketIssues } from "@/developementContent/Enums/enum";
import { useFormik } from "formik";
import { GenerateTicketSchema } from "@/formik/schema";
import { generateTicketFormValues } from "@/formik/initialValues";

const GenerateTicketModal = ({ show, setShow }) => {
  const formik = useFormik({
    initialValues: generateTicketFormValues,
    validationSchema: GenerateTicketSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    console.log("Form submitted:", values);
    // Add your API call here
    // setShow(false);
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
          label="Send Message"
          className={classes.sendMessageButton}
          onClick={() => formik.handleSubmit()}
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
            options={ticketIssues}
            values={formik.values.issue ? ticketIssues.filter(opt => opt.value.toString() === formik.values.issue) : []}
            placeholder="Select an issue"
            closeOnSelect={true}
            onChange={(value) => {
              const selectedValue = value && value.length > 0 ? value[0]?.value?.toString() : "";
              formik.setFieldValue("issue", selectedValue);
              // Clear description when issue changes
              if (selectedValue !== formik.values.issue) {
                formik.setFieldValue("description", "");
              }
            }}
            label={"I have issue with "}
          />
          {formik.touched.issue && formik.errors.issue && (
            <div className={classes.errorText}>{formik.errors.issue}</div>
          )}
          {formik.values.issue && (
            <TextArea 
              placeholder="Please briefly describe your issue here..." 
              value={formik.values.description}
              setValue={(value) => formik.setFieldValue("description", value)}
              error={formik.touched.description && formik.errors.description}
            />
          )}
        </div>
      </div>
    </ModalSkeleton>
  );
};

export default GenerateTicketModal;
