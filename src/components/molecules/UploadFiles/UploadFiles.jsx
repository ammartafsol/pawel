"use client";
import React from "react";
import { BiUpload } from "react-icons/bi";
import classes from "./UploadFiles.module.css";

/**
 * UploadFiles component for uploading files via drag-and-drop or file picker.
 *
 * @param {Object} props
 * @param {File[]} props.files - Array of selected files.
 * @param {Function} props.setFiles - Function to update files.
 * @param {React.RefObject} [props.fileInputRef] - Optional ref for file input.
 * @param {string} [props.error] - Error message to display.
 * @param {boolean} props.dragActive - Whether drag is active.
 * @param {Function} props.setDragActive - Function to set drag active state.
 * @param {string} [props.label] - Label for the upload area.
 * @param {boolean} [props.single=false] - If true, only one file can be uploaded.
 * @param {boolean} [props.disabled=false] - If true, disables upload.
 * @param {boolean} [props.readonly=false] - If true, makes upload read-only.
 * @param {number} [props.maxFiles=5] - Maximum number of files allowed.
 * @param {Function} [props.onRemove=null] - Callback for removing files.
 * @param {string} [props.accept="*"] - File types accepted. Use "*" for any file type, or a comma-separated list (e.g. "image/\*,application/pdf").
 *
 * @example
 * <UploadFiles
 *   files={files}
 *   setFiles={setFiles}
 *   accept="image/*,application/pdf"
 * />
 */
export default function UploadFiles({
  files,
  setFiles,
  fileInputRef,
  error,
  dragActive,
  setDragActive,
  label,
  single = false,
  disabled = false,
  readonly = false,
  maxFiles = 5,
  onRemove = null,
  accept = "*",
}) {
  // Use internal ref if not provided
  const internalFileInputRef = React.useRef();
  const inputRef = fileInputRef || internalFileInputRef;

  const handleFileChange = (e) => {
    if (disabled || readonly) return;
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles?.length > 0) {
      if (single) {
        setFiles([selectedFiles[0]]);
      } else {
        const availableSlots = maxFiles - files?.length;
        const filesToAdd = selectedFiles.slice(0, availableSlots);
        setFiles([...files, ...filesToAdd]);
      }
    }
  };

  const handleDrop = (e) => {
    if (disabled || readonly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files?.length > 0) {
      if (single) {
        setFiles([e.dataTransfer.files[0]]);
      } else {
        setFiles((prev) => {
          const availableSlots = maxFiles - prev.length;
          const filesToAdd = Array.from(e.dataTransfer.files).slice(
            0,
            availableSlots
          );
          return [...prev, ...filesToAdd];
        });
      }
    }
  };

  const handleDragOver = (e) => {
    if (disabled || readonly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    if (disabled || readonly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Disable upload if maxFiles reached (for multi mode)
  const reachedMaxFiles = !single && files?.length >= maxFiles;

  const handleClickUpload = () => {
    if (disabled || readonly || reachedMaxFiles) return;
    inputRef.current && inputRef.current.click();
  };

  const handleRemoveFile = (idx) => {
    if (disabled || readonly) return;
    if (single) {
      onRemove ? onRemove(files[0]) : setFiles([]);
    } else {
      onRemove
        ? onRemove(files, idx)
        : setFiles(files.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className={classes.uploadContainer}>
      {label && <h2>{label}</h2>}
      <div className={classes.main}>
        <div
          className={`${classes.dragAndDropContainer} ${dragActive ? classes.dragActive : ""
            } ${disabled ? classes.disabled : ""} ${reachedMaxFiles ? classes.disabled : ""
            }`}
          onClick={handleClickUpload}
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
            <div className={classes.imagePreviewWrapper}>
              {files[0]?.type?.startsWith("image/") ? (
                <img
                  src={files[0] ? URL.createObjectURL(files[0]) : ""}
                  alt="Uploaded"
                  className={`${classes.imagePreview} ${classes.previewImage}`}
                />
              ) : (
                <div
                  className={`${classes.fileInfo} ${classes.previewFileInfo}`}
                >
                  <span className={classes.previewFileName}>
                    {files[0]?.name}
                  </span>
                  <span className={classes.previewFileSize}>
                    {(files[0]?.size / 1024)?.toFixed(2)} KB
                  </span>
                </div>
              )}
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (files[0]) {
                      const url = URL.createObjectURL(files[0]);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = files[0].name || "download";
                      a.target = "_blank";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className={classes.openFileButton}
                >
                  Open
                </button>
                {!readonly && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(0);
                    }}
                    className={classes.removeFileButton}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={classes.dragAndDropMessage}>
              <BiUpload
                color="var(--primary)"
                size={43}
              />
              <p>Upload your files here</p>
              <p>Browse</p>
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
              {file?.type?.startsWith("image/") ? (
                <img
                  src={file ? URL.createObjectURL(file) : ""}
                  alt={file?.name}
                  className={`${classes.imagePreview} ${classes.previewImage}`}
                />
              ) : (
                <div
                  className={`${classes.fileInfo} ${classes.previewFileInfo}`}
                >
                  <span className={classes.previewFileName}>{file?.name}</span>
                  <span className={classes.previewFileSize}>
                    {(file?.size / 1024)?.toFixed(2)} KB
                  </span>
                </div>
              )}
              <div className={classes.btnWrapper}>
                <button
                  type="button"
                  onClick={() => {
                    if (file) {
                      const url = URL.createObjectURL(file);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = file.name || "download";
                      a.target = "_blank";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className={classes.openFileButton}
                  disabled={disabled || readonly}
                >
                  Open
                </button>
                {!readonly && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      handleRemoveFile(idx);
                    }}
                    className={classes.removeFileButton}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {reachedMaxFiles && (
        <p className={classes.error}>Maximum {maxFiles} files allowed.</p>
      )}
      {error && <p className={classes.error}>{error}</p>}
    </div>
  );
}
