"use client";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import classes from "./AddNoteModal.module.css";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import IconInput from "@/components/molecules/IconInput/IconInput";
import Input from "@/components/atoms/Input/Input";
import { MdKey, MdOutlineNotes } from "react-icons/md";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import { GrDocumentText } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import Button from "@/components/atoms/Button";
import { useFormik } from "formik";
import { AddNoteSchema } from "@/formik/schema";
import { addNoteFormValues } from "@/formik/initialValues";
import { auditTrackingOptions } from "@/developementContent/Enums/enum";

const AddNoteModal = ({ show, loading, setShow, handleSubmit, isEditMode = false, initialData = null }) => {
  const formik = useFormik({
    initialValues: isEditMode && initialData
      ? {
          noteTitle: initialData.title || "",
          description: initialData.description || "",
          permissible: initialData.permissions || initialData.permissible || [],
        }
      : addNoteFormValues,
    validationSchema: AddNoteSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  // Reset form when modal closes or after successful submission; reinit when initialData changes (edit)
  useEffect(() => {
    if (!show && loading !== "loading") {
      formik.resetForm();
    }
    if (show && isEditMode && initialData) {
      formik.setValues({
        noteTitle: initialData.title || "",
        description: initialData.description || "",
        permissible: initialData.permissions || initialData.permissible || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, loading, isEditMode, initialData]);



  return (
    <ModalSkeleton 
      heading={isEditMode ? "Edit note" : "Add a note"} 
      show={show} 
      setShow={setShow}
      drawer={true}
      modalMainClass={classes.modalMain}
      footerClass={classes.footerClass}
      footerData={
        <div className={classes.footerDiv}>
          <Button 
            label="" 
            variant="outlined" 
            disabled={loading === "loading"}
            leftIcon={<RiDeleteBinLine color="var(--red)" size={24}/>}
            onClick={() => {
              formik.resetForm();
              setShow(false);
            }}
          />
          <Button 
            label={loading === "loading" ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Note" : "Add Note")}
            variant="outlined" 
            disabled={loading === "loading"}
            loading={loading === "loading"}
            leftIcon={<IoMdCheckmark color="var(--midnight-black)"/>}
            onClick={() => formik.handleSubmit()}
          />
        </div>
      }
    >
      <div className={classes.iconInputContainer}>
        <IconInput title={"Note Title"} icon={<MdOutlineNotes size={22} />}>
          <Input
            className={classes.input}
            inputClass={classes.inputClassName}
            placeholder="Type here..."
            value={formik.values.noteTitle}
            setValue={(value) => formik.setFieldValue("noteTitle", value)}
            error={formik.touched.noteTitle && formik.errors.noteTitle}
          />
        </IconInput>
        <div>
          <div className={classes.descriptionContainer}>
            <GrDocumentText size={22} />
            <div className={classes.descriptionText}>Description</div>
          </div>
          <TextArea 
            placeholder="Add note points..." 
            value={formik.values.description}
            setValue={(value) => formik.setFieldValue("description", value)}
            error={formik.touched.description && formik.errors.description}
          />
        </div>
        <IconInput title={"Permissible"} icon={<MdKey size={22} />}>
          <DropDown
            className={classes.dropdown}
            options={auditTrackingOptions}
            placeholder="Select permissions"
            multi={true}
            values={formik.values.permissible && formik.values.permissible.length > 0 
              ? auditTrackingOptions.filter(opt => formik.values.permissible.includes(opt.value))
              : []}
            closeOnSelect={false}
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions && selectedOptions.length > 0 
                ? selectedOptions.map(opt => opt.value)
                : [];
              formik.setFieldValue("permissible", selectedValues);
            }}
          />
          {formik.touched.permissible && formik.errors.permissible && (
            <div className={classes.errorText}>{formik.errors.permissible}</div>
          )}
        </IconInput>
      </div>
    </ModalSkeleton>
  );
};

AddNoteModal.propTypes = {
  show: PropTypes.bool,
  loading: PropTypes.string,
  setShow: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
    permissible: PropTypes.arrayOf(PropTypes.string),
  }),
};

AddNoteModal.defaultProps = {
  show: false,
  loading: "",
  isEditMode: false,
  initialData: null,
};

export default AddNoteModal;
