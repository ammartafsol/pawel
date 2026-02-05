"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import IconInput from "@/components/molecules/IconInput/IconInput";
import UploadFiles from "@/components/molecules/UploadFiles/UploadFiles";
import DropDown from "@/components/molecules/DropDown/DropDown";
import Button from "@/components/atoms/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import { MdKey } from "react-icons/md";
import classes from "./UploadDocumentToCaseModal.module.css";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";
import { auditTrackingOptions } from "@/developementContent/Enums/enum";

/**
 * Modal to upload document(s) directly to a case with permission selection.
 * Same upload flow as UploadDocumentModal: UploadFiles uses media/upload;
 * on submit we call case-document/bulk-upload with { documents: [{ key, fileName }] },
 * then assign-case per created document for this case and permissions.
 */
const UploadDocumentToCaseModal = ({
  show,
  setShow,
  caseSlug,
  setDocuments,
  documents = [],
  maxFiles = 10,
  accept = "application/pdf,image/*",
}) => {
  const { Post } = useAxios();
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileKeys, setFileKeys] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) {
      setFiles([]);
      setDragActive(false);
      setFileKeys({});
      setPermissions([]);
      setError("");
      setUploading(false);
    }
  }, [show]);

  const handleClose = () => {
    setFiles([]);
    setFileKeys({});
    setPermissions([]);
    setError("");
    setShow(false);
  };

  const handleSubmit = async () => {
    setError("");

    if (!caseSlug) {
      RenderToast({ message: "Case slug is required", type: "error" });
      return;
    }

    if (!files.length) {
      setError("Please select at least one file to upload.");
      return;
    }

    // Same as UploadDocumentModal: check all files have keys (uploaded via media/upload)
    const uploadedCount = files.filter((_, idx) => fileKeys[idx]).length;
    if (uploadedCount !== files.length) {
      setError("Please wait for all files to finish uploading.");
      return;
    }

    if (!permissions || permissions.length === 0) {
      setError("Please select at least one permission.");
      return;
    }

    setUploading(true);

    try {
      // Same as UploadDocumentModal: build documents from files + fileKeys, call bulk-upload with { documents }
      const documentsToUpload = files.map((file, idx) => ({
        key: fileKeys[idx],
        fileName: file.name,
      }));

      const { response: bulkResponse } = await Post({
        route: "case-document/bulk-upload",
        data: { documents: documentsToUpload },
      });

      const createdDocs = Array.isArray(bulkResponse?.data)
        ? bulkResponse.data
        : bulkResponse?.documents || [];

      const newDocsForList = [];

      for (const doc of createdDocs) {
        const documentId = doc._id || doc.id;
        if (!documentId) continue;

        const { response: assignResponse } = await Post({
          route: `case-document/assign-case/${documentId}`,
          data: { caseSlug, permissions },
          showAlert: false,
        });

        if (assignResponse?.data) {
          newDocsForList.push({
            id: assignResponse.data._id,
            title:
              assignResponse.data.fileName ||
              assignResponse.data.documentName ||
              "Untitled Document",
            dateTime: assignResponse.data.createdAt,
            visibilityText: assignResponse.data.permissions?.includes(
              "visible-to-client"
            )
              ? "Visible to client"
              : "Visible to staff",
            fileKey: assignResponse.data.key,
          });
        }
      }

      if (newDocsForList.length > 0 && setDocuments) {
        setDocuments([...newDocsForList, ...documents]);
      }

      RenderToast({
        message:
          newDocsForList.length > 0
            ? "Document(s) uploaded and assigned successfully"
            : "Upload completed",
        type: "success",
      });
      handleClose();
    } catch (err) {
      RenderToast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      heading="Upload Document to Case"
      drawer
      showCloseIcon
      modalMainClass={classes.modalMain}
      footerClass={classes.footerClass}
      footerData={
        <div className={classes.footerDiv}>
          <Button
            variant="outlined"
            disabled={uploading}
            leftIcon={<RiDeleteBinLine color="var(--red)" size={24} />}
            onClick={handleClose}
          />
          <Button
            label={uploading ? "Uploading..." : "Upload"}
            variant="outlined"
            loading={uploading}
            disabled={uploading}
            leftIcon={<IoMdCheckmark color="var(--midnight-black)" />}
            onClick={handleSubmit}
          />
        </div>
      }
    >
      <div className={classes.iconInputContainer}>
        <IconInput title="Permissions" icon={<MdKey size={22} />}>
          <DropDown
            className={classes.dropdown}
            options={auditTrackingOptions}
            placeholder="Select permissions"
            multi
            closeOnSelect={false}
            values={
              permissions?.length > 0
                ? auditTrackingOptions.filter((opt) =>
                    permissions.includes(opt.value)
                  )
                : []
            }
            onChange={(selectedOptions) => {
              const selectedValues =
                selectedOptions?.length > 0
                  ? selectedOptions.map((opt) => opt.value)
                  : [];
              setPermissions(selectedValues);
            }}
          />
          {error && error.includes("permission") && (
            <div className={classes.errorText}>{error}</div>
          )}
        </IconInput>

        <UploadFiles
          files={files}
          setFiles={setFiles}
          dragActive={dragActive}
          setDragActive={setDragActive}
          error={error && !error.includes("permission") ? error : ""}
          label="Upload your documents"
          maxFiles={maxFiles}
          accept={accept}
          onFileKeysChange={setFileKeys}
        />
      </div>
    </ModalSkeleton>
  );
};

UploadDocumentToCaseModal.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func.isRequired,
  caseSlug: PropTypes.string.isRequired,
  setDocuments: PropTypes.func,
  documents: PropTypes.array,
  maxFiles: PropTypes.number,
  accept: PropTypes.string,
};

UploadDocumentToCaseModal.defaultProps = {
  show: false,
  setDocuments: null,
  documents: [],
  maxFiles: 10,
  accept: "application/pdf,image/*",
};

export default UploadDocumentToCaseModal;
