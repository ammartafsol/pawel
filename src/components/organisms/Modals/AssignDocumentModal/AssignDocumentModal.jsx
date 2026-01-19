"use client";
import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import classes from "./AssignDocumentModal.module.css";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import IconInput from "@/components/molecules/IconInput/IconInput";
import DropDown from "@/components/molecules/DropDown/DropDown";
import Button from "@/components/atoms/Button";
import RenderToast from "@/components/atoms/RenderToast";
import { GrDocumentText } from "react-icons/gr";
import { MdKey } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import { useFormik } from "formik";
import { assignDocumentFormValues } from "@/formik/initialValues";
import useAxios from "@/interceptor/axios-functions";
import { auditTrackingOptions } from "@/developementContent/Enums/enum";
import { AssignDocumentSchema } from "@/formik/schema";

const AssignDocumentModal = ({
  show,
  setShow,
  caseSlug,
  setDocuments,
  documents,
}) => {
  const { Get, Post } = useAxios();
  const [documentList, setDocumentList] = useState([]);
  const [fetchingDocuments, setFetchingDocuments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: assignDocumentFormValues,
    validationSchema: AssignDocumentSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  /* -------------------- Fetch Documents -------------------- */
  const fetchDocuments = useCallback(async () => {
    if (!show) return;

    setFetchingDocuments(true);
      const { response } = await Get({
        route: "case-document/all",
        showAlert: false,
      });

      if (response) {
        setDocumentList(
          response.data.map((doc) => ({
            label: doc.fileName || doc.documentName || "Untitled Document",
            value: doc._id || doc.id,
          }))
        );
        setFetchingDocuments(false);
      }
    
  }, [show]);

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    if (show) {
      fetchDocuments();
    } else {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  /* -------------------- Handlers -------------------- */
  const handleSubmit = async (values) => {
    if (!caseSlug) {
      RenderToast({ message: "Case slug is required", type: "error" });
      return;
    }

    setSubmitting(true);
      const documentId = values.document?.value || values.document;
      const permissions = values.permissions; // Already strings from onChange handler

      const { response } = await Post({
        route: `case-document/assign-case/${documentId}`,
        data: { caseSlug, permissions },
      });

      if (response) {
        const newDocument = {
          id: response.data._id,
          title: response.data.fileName || response.data.documentName || "Untitled Document",
          dateTime: response.data.createdAt,
          visibilityText: response.data.permissions?.includes("visible-to-client")
            ? "Visible to client"
            : "Visible to staff",
        };
        setDocuments?.([newDocument, ...documents]);
        RenderToast({
          message: "Document assigned successfully",
          type: "success",
        });
        formik.resetForm();
        setShow(false);      
      }
      setSubmitting(false);

    
  };

  /* -------------------- Render -------------------- */
  return (
    <ModalSkeleton
      heading="Assign Document to Case"
      show={show}
      setShow={setShow}
      drawer
      modalMainClass={classes.modalMain}
      footerClass={classes.footerClass}
      footerData={
        <div className={classes.footerDiv}>
          <Button
            variant="outlined"
            disabled={submitting}
            leftIcon={<RiDeleteBinLine color="var(--red)" size={24} />}
            onClick={() => {
              formik.resetForm();
              setShow(false);
            }}
          />
          <Button
            label={submitting ? "Assigning..." : "Assign Document"}
            variant="outlined"
            loading={submitting}
            disabled={submitting}
            leftIcon={<IoMdCheckmark color="var(--midnight-black)" />}
            onClick={() => formik.handleSubmit()}
          />
        </div>
      }
    >
      <div className={classes.iconInputContainer}>
        <IconInput title="Document" icon={<GrDocumentText size={22} />}>
          <DropDown
            className={classes.dropdown}
            options={documentList}
            placeholder="Select a document"
            values={formik.values.document ? [formik.values.document] : []}
            loading={fetchingDocuments}
            closeOnSelect
            error={formik.touched.document && formik.errors.document}
            onChange={(selectedOptions) => {
              formik.setFieldValue(
                "document",
                selectedOptions && selectedOptions.length > 0
                  ? selectedOptions[0]
                  : null
              );
            }}
          />
        </IconInput>

        <IconInput title="Permissions" icon={<MdKey size={22} />}>
          <DropDown
            className={classes.dropdown}
            options={auditTrackingOptions}
            placeholder="Select permissions"
            multi
            closeOnSelect={false}
            values={
              formik.values.permissions && formik.values.permissions.length > 0
                ? auditTrackingOptions.filter((opt) =>
                    formik.values.permissions.includes(opt.value)
                  )
                : []
            }
            error={formik.touched.permissions && formik.errors.permissions}
            onChange={(selectedOptions) => {
              const selectedValues =
                selectedOptions && selectedOptions.length > 0
                  ? selectedOptions.map((opt) => opt.value)
                  : [];
              formik.setFieldValue("permissions", selectedValues);
            }}
          />
        </IconInput>
      </div>
    </ModalSkeleton>
  );
};

AssignDocumentModal.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func.isRequired,
  caseSlug: PropTypes.string.isRequired,
  setDocuments: PropTypes.func,
  documents: PropTypes.array,
};

AssignDocumentModal.defaultProps = {
  show: false,
  setDocuments: null,
  documents: [],
};

export default AssignDocumentModal;
