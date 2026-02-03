"use client";
import React, { useState, useEffect } from "react";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import UploadFiles from "@/components/molecules/UploadFiles/UploadFiles";
import Button from "@/components/atoms/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import classes from "./UploadDocumentModal.module.css";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";

/**
 * UploadDocumentModal
 *
 * Reusable modal for uploading one or more documents using the UploadFiles component.
 *
 * @param {Object} props
 * @param {boolean} props.show - Whether the modal is visible.
 * @param {Function} props.setShow - Setter to control modal visibility.
 * @param {Function} [props.onUpload] - Callback invoked with selected files on successful upload.
 * @param {number} [props.maxFiles=10] - Maximum number of files allowed.
 * @param {string} [props.accept="application/pdf,image/*"] - Accepted mime types.
 */
const UploadDocumentModal = ({
  show,
  setShow,
  onUpload,
  maxFiles = 10,
  accept = "application/pdf,image/*",
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [fileKeys, setFileKeys] = useState({}); // Track uploaded file keys: { fileIndex: key }
  const [uploading, setUploading] = useState(false);
  const { Post } = useAxios();

  const resetState = () => {
    setFiles([]);
    setError("");
    setDragActive(false);
    setFileKeys({});
  };

  const handleClose = () => {
    resetState();
    setShow(false);
  };

  // Reset state when modal is closed (e.g. via header X icon or backdrop) so it's empty when reopened
  useEffect(() => {
    if (!show) {
      resetState();
    }
  }, [show]);

  const handleUploadSubmit = async () => {
    if (!files.length) {
      setError("Please select at least one file to upload.");
      return;
    }

    // Check if all files have been uploaded (have keys)
    const uploadedFiles = files.filter((_, idx) => fileKeys[idx]);
    if (uploadedFiles.length !== files.length) {
      setError("Please wait for all files to finish uploading.");
      return;
    }

    setUploading(true);

    // Prepare documents array with key and fileName
    const documents = files.map((file, idx) => ({
      key: fileKeys[idx],
      fileName: file.name,
    }));

    const { response } = await Post({
      route: "case-document/bulk-upload",
      data: { documents },
    });

    if (response) {
      RenderToast({
        message: "Documents uploaded successfully",
        type: "success",
      });
      if (onUpload) {
        onUpload(files);
      }
      handleClose();
    }
    setUploading(false);
  };

  return (
    <ModalSkeleton
      show={show}
      setShow={setShow}
      heading="Upload Documents"
      showCloseIcon
      modalBodyClass={classes.modalBody}
      footerData={
        <div className={classes.modalFooterButtons}>
          <Button
            label=""
            variant="outlined"
            onClick={handleClose}
            leftIcon={<RiDeleteBinLine color="var(--red)" size={24} />}
          />
          <Button
            label={uploading ? "Uploading..." : "Upload"}
            variant="outlined"
            leftIcon={<IoMdCheckmark color="var(--midnight-black)" />}
            onClick={handleUploadSubmit}
            disabled={uploading}
            loading={uploading}
          />
        </div>
      }
    >
      <UploadFiles
        files={files}
        setFiles={setFiles}
        dragActive={dragActive}
        setDragActive={setDragActive}
        error={error}
        label="Upload your documents"
        maxFiles={maxFiles}
        accept={accept}
        onFileKeysChange={setFileKeys}
      />
    </ModalSkeleton>
  );
};

export default UploadDocumentModal;
