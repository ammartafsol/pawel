"use client";
import React from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./ReplySupportModal.module.css";
import { CgFileDocument } from "react-icons/cg";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { IoMdCheckmark } from "react-icons/io";
import Button from "@/components/atoms/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import { useFormik } from "formik";
import { ReplySupportSchema } from "@/formik/schema";
import { replySupportFormValues } from "@/formik/initialValues";

const ReplySupportModal = ({ show, setShow, clientName = "Herman Schoen" }) => {
  const formik = useFormik({
    initialValues: replySupportFormValues,
    validationSchema: ReplySupportSchema,
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
      heading={`Reply to ${clientName}`}
      showCloseIcon={true}
      drawer={true}
      modalMainClass={classes.modalMain}
      footerClass={classes.footerClass}
      footerData={
        <div className={classes.footerDiv}>
            <Button 
              label="" 
              variant="outlined" 
              leftIcon={<RiDeleteBinLine color="var(--red)" size={24}/>}
              onClick={() => {
                formik.resetForm();
                setShow(false);
              }}
            />
            <Button 
              label="Send Message" 
              variant="outlined" 
              leftIcon={<IoMdCheckmark color="var(--midnight-black)"/>}
              onClick={() => formik.handleSubmit()}
            />
        </div>
      }
    >
      <div className={classes.mainContainer}>
        <div className={classes.labelDiv}>
            <CgFileDocument color="var(--grey-icon2)" size={24}/>
            <h4 className={classes.title}>Message</h4>
        </div>
        <TextArea 
          placeholder="Add message here..." 
          value={formik.values.message}
          setValue={(value) => formik.setFieldValue("message", value)}
          error={formik.touched.message && formik.errors.message}
        />
      </div>
    </ModalSkeleton>
  );
};

export default ReplySupportModal;
