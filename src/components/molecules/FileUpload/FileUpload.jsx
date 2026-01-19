"use client";
import Button from "@/components/atoms/Button";
import RenderToast from "@/components/atoms/RenderToast";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import useAxios from "@/interceptor/axios-functions";
import { imageUrl } from "@/resources/utils/helper";
import { getMediaType } from "@/resources/utils/mediaUpload";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { BiXCircle } from "react-icons/bi";
import { FaFileAudio, FaFileContract } from "react-icons/fa6";
import { HiOutlineUpload } from "react-icons/hi";
import classes from "./FileUpload.module.css";
import { useTranslations } from "next-intl";

/**
 * FileUpload component for uploading files via drag-and-drop or file picker.
 *
 * @param {Object} props
 * @param {File[]} props.files - Array of selected files.
 * @param {Function} props.setFiles - Function to update files.
 * @param {React.RefObject} [props.fileInputRef] - Optional ref for file input.
 * @param {string} [props.error] - Error message to display.
 * @param {string} [props.label] - Label for the upload area.
 * @param {boolean} [props.single=false] - If true, only one file can be uploaded.
 * @param {boolean} [props.disabled=false] - If true, disables upload.
 * @param {boolean} [props.readonly=false] - If true, makes upload read-only.
 * @param {number} [props.maxFiles=5] - Maximum number of files allowed.
 * @param {Function} [props.onRemove=null] - Callback for removing files.
 * @param {string} [props.accept="*"] - File types accepted. Use "*" for any file type, or a comma-separated list (e.g. "image/*,application/pdf").
 */
export default function FileUpload({
  files,
  setFiles = () => {},
  fileInputRef = null,
  error = "",
  label = "",
  single = false,
  disabled = false,
  readonly = false,
  maxFiles = 5,
  onRemove = null,
  accept = "*",
  title = "Upload Certificate",
  maxFileSizeTitle = "",
  maxSize = 2,
  supportedFormats = "",
  required = false,
  uploadButtonLabel = "Browse",
  icon = <HiOutlineUpload size={43} color="var(--blue-1)" />,
}) {
  // Use internal ref if not provided
  const internalFileInputRef = useRef();
  const inputRef = fileInputRef || internalFileInputRef;
  const [dragActive, setDragActive] = useState(false);
  const [isDeleteApiCalling, setIsDeleteApiCalling] = useState(false);
  const { Patch } = useAxios();
  const commonTranslations = useTranslations("common");
  const handleFileChange = (e) => {
    if (disabled || readonly) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles?.length > 0) {
      if (single) {
        const first = selectedFiles[0];
        setFiles([first]);
      } else {
        const availableSlots = maxFiles - (files?.length || 0);
        const filesToAdd = selectedFiles.slice(0, availableSlots);
        setFiles([...files, ...filesToAdd]);
      }
    }
    inputRef.current.value = null;
  };

  const handleDrop = (e) => {
    if (disabled || readonly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const filesArray = Array.from(droppedFiles);

      if (single) {
        const first = filesArray[0];
        setFiles([first]);
      } else {
        const availableSlots = maxFiles - (files?.length || 0);
        const filesToAdd = filesArray.slice(0, availableSlots);
        setFiles([...files, ...filesToAdd]);
      }
      inputRef.current.value = null;
    }
  };

  const handleDragOver = (e) => {
    if (disabled || readonly) return;
    e.preventDefault();
    e.stopPropagation();
    if (!dragActive) {
      setDragActive(true);
    }
  };

  const handleDragEnter = (e) => {
    if (disabled || readonly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    if (disabled || readonly) return;
    e.preventDefault();
    e.stopPropagation();
    // Only set dragActive to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragActive(false);
    }
  };

  // Disable upload if maxFiles reached (for multi mode)
  const reachedMaxFiles = !single && files?.length >= maxFiles;

  const handleClickUpload = () => {
    if (disabled || readonly || reachedMaxFiles) return;
    inputRef.current && inputRef.current.click();
  };

  const removeFile = async (idx) => {
    if (disabled || readonly) return;
    const keyOrObj = files[idx];
    // If it's a local file object, remove from front only
    if (typeof keyOrObj === "object") {
      if (single) {
        onRemove ? onRemove(files[0]) : setFiles([]);
      } else {
        onRemove
          ? onRemove(files, idx)
          : setFiles(files.filter((_, i) => i !== idx));
      }
      return;
    }

    // Otherwise call backend to delete by key and then update front
    try {
      setIsDeleteApiCalling(true);
      const { response } = await Patch({
        route: "media/delete",
        data: {
          key: keyOrObj,
        },
      });
      if (response) {
        if (single) {
          onRemove ? onRemove(files[0]) : setFiles([]);
        } else {
          onRemove
            ? onRemove(files, idx)
            : setFiles(files.filter((_, i) => i !== idx));
        }
        RenderToast({ message: "File deleted successfully", type: "success" });
      }
    } finally {
      setIsDeleteApiCalling(false);
    }
  };

  const renderFileComponent = (file, idx) => {
    const isLocalFile = file?.name ? true : false;
    const fileType = getMediaType(
      isLocalFile ? file?.type : file?.split(".").pop()
    );

    let iconComponent = ["images", "photo"].includes(fileType) ? (
      <div className={classes?.imageContainer}>
        <Image
          src={isLocalFile ? URL.createObjectURL(file) : imageUrl(file)}
          alt={file?.name || "Image"}
          fill
        />
      </div>
    ) : fileType === "docs" ? (
      <FaFileContract
        title="View File"
        size={35}
        className={classes.file}
        onClick={() =>
          window.open(
            isLocalFile ? URL.createObjectURL(file) : imageUrl(file),
            "_blank"
          )
        }
      />
    ) : fileType === "audio" ? (
      <FaFileAudio title="View Audio" size={35} className={classes.file} />
    ) : undefined;

    return (
      <div className={classes.filePreview}>
        {iconComponent}
        {!single && (
          <div className={classes.removeIconContainer}>
            <div className={classes.removeIcon}>
              <BiXCircle
                size={24}
                color="var(--error)"
                onClick={() => removeFile(idx)}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classes.uploadContainer}>
      {label && <h2 className={classes.label}>{label}</h2>}
      <div className={classes.main}>
        <div
          className={`${classes.dragAndDropContainer} ${
            dragActive ? classes.dragActive : ""
          } ${disabled ? classes.disabled : ""} ${
            reachedMaxFiles ? classes.disabled : ""
          }`}
          onClick={handleClickUpload}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            cursor:
              disabled || reachedMaxFiles
                ? "not-allowed"
                : readonly
                ? "default"
                : "pointer",
            opacity: disabled || reachedMaxFiles ? 0.6 : 1,
          }}
        >
          {single && files?.length > 0 ? (
            <div className={classes.fileItem}>
              {renderFileComponent(files[0], 0)}
            </div>
          ) : (
            <div className={classes.dragAndDropMessage}>
              <div className={classes.uploadIcon}>{icon}</div>
              <div className={classes.uploadTextWrapper}>
                <h3 className={classes.uploadTitle}>
                  {title}
                  {required && ` *`}
                </h3>
                {maxFileSizeTitle && (
                  <p className={classes.fileSizeAndSupportingFormatsText}>
                    {maxFileSizeTitle}: {maxSize} MB
                  </p>
                )}
                {supportedFormats && (
                  <p className={classes.fileSizeAndSupportingFormatsText}>
                    {commonTranslations("fileUpload.supportedFormats")}:{" "}
                    {supportedFormats}
                  </p>
                )}
                <Button
                  label={uploadButtonLabel}
                  disabled={disabled || readonly || reachedMaxFiles}
                  className={classes.uploadButton}
                />
              </div>
            </div>
          )}

          <input
            type="file"
            hidden
            multiple={!single}
            ref={inputRef}
            onChange={handleFileChange}
            disabled={disabled || readonly || reachedMaxFiles}
            readOnly={readonly}
            accept={accept === "*" ? undefined : accept}
          />
        </div>
      </div>
      {!single && files?.length > 0 && (
        <div className={classes.filePreview}>
          {files?.map((file, idx) => (
            <div key={idx} className={classes.fileItem} data-single={single}>
              {renderFileComponent(file, idx)}
            </div>
          ))}
        </div>
      )}

      {reachedMaxFiles && (
        <p className={classes.error}>
          {commonTranslations("fileUpload.maximum")} {maxFiles}{" "}
          {commonTranslations("fileUpload.filesAllowed")}.
        </p>
      )}
      {error && <p className={clsx("errorText")}>*{error}</p>}

      {isDeleteApiCalling && <SpinnerLoading type="page" />}
    </div>
  );
}
