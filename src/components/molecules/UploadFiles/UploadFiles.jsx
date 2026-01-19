"use client";
import React, { useState } from "react";
import { BiUpload } from "react-icons/bi";
import { BiX } from "react-icons/bi";
import { HiOutlineEye } from "react-icons/hi";
import classes from "./UploadFiles.module.css";
import useAxios from "@/interceptor/axios-functions";
import { uploadMedia, getSupportedImageTypes } from "@/resources/utils/mediaUpload";
import RenderToast from "@/components/atoms/RenderToast";
import Spinner from "react-bootstrap/Spinner";

/**
 * UploadFiles component for uploading files via drag-and-drop or file picker.
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
  accept = "*",
  onFileKeysChange, // Callback to notify parent when file keys are updated
}) {
  const internalFileInputRef = React.useRef();
  const inputRef = fileInputRef || internalFileInputRef;
  const { Post, Patch } = useAxios();
  const [uploadingIndices, setUploadingIndices] = useState(new Set()); // Track which files are currently uploading
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [fileKeys, setFileKeys] = useState({}); // Track uploaded file keys: { fileIndex: key }

  const triggerUpload = async (selectedFiles, startIndex) => {
    if (!selectedFiles?.length) return;
    
    // Mark files as uploading
    const uploadingSet = new Set();
    selectedFiles.forEach((_, idx) => {
      uploadingSet.add(startIndex + idx);
    });
    setUploadingIndices(new Set(uploadingSet));
    
    try {
      const response = await uploadMedia({ files: selectedFiles, Post, route: "media/upload" });
      if (response) {
        // Extract keys from response structure: { images: [{ key: "..." }], docs: [{ key: "..." }], etc }
        // Note: uploadMedia returns response?.data, so response is already the data object
        const keys = [];
        
        // Extract from images array
        if (response.images && Array.isArray(response.images)) {
          response.images.forEach((item) => {
            if (item.key) keys.push(item.key);
          });
        }
        // Extract from docs array
        if (response.docs && Array.isArray(response.docs)) {
          response.docs.forEach((item) => {
            if (item.key) keys.push(item.key);
          });
        }
        // Extract from audio array
        if (response.audio && Array.isArray(response.audio)) {
          response.audio.forEach((item) => {
            if (item.key) keys.push(item.key);
          });
        }
        // Extract from other arrays if they exist
        if (response.other && Array.isArray(response.other)) {
          response.other.forEach((item) => {
            if (item.key) keys.push(item.key);
          });
        }
        
        // Store file keys for deletion
        if (keys.length > 0) {
          const newKeys = {};
          keys.forEach((key, idx) => {
            if (idx < selectedFiles.length) {
              newKeys[startIndex + idx] = key;
            }
          });
          setFileKeys((prev) => {
            const updated = { ...prev, ...newKeys };
            // Notify parent component about updated file keys
            if (onFileKeysChange) {
              onFileKeysChange(updated);
            }
            return updated;
          });
        }
      }
    } catch (err) {
      RenderToast({ message: "Failed to upload files", type: "error" });
      console.error("Upload error:", err);
    } finally {
      // Remove uploaded files from uploading set
      setUploadingIndices((prev) => {
        const newSet = new Set(prev);
        selectedFiles.forEach((_, idx) => {
          newSet.delete(startIndex + idx);
        });
        return newSet;
      });
    }
  };

  const handleFileChange = (e) => {
    if (disabled || readonly) return;
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles?.length) return;

    // Validate file types
    const validFiles = selectedFiles.filter((file) => {
      if (!isValidFileType(file)) {
        RenderToast({
          message: `File type not supported: ${file.name}`,
          type: "error",
        });
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    if (single) {
      setFiles([validFiles[0]]);
      triggerUpload([validFiles[0]], 0);
    } else {
      const availableSlots = maxFiles - files?.length;
      const filesToAdd = validFiles.slice(0, availableSlots);
      if (filesToAdd.length) {
        const newFiles = [...files, ...filesToAdd];
        setFiles(newFiles);
        triggerUpload(filesToAdd, files.length);
      }
    }
    e.target.value = "";
  };

  const handleDrop = (e) => {
    if (disabled || readonly) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (!droppedFiles.length) return;

    // Validate file types
    const validFiles = droppedFiles.filter((file) => {
      if (!isValidFileType(file)) {
        RenderToast({
          message: `File type not supported: ${file.name}`,
          type: "error",
        });
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    if (single) {
      setFiles([validFiles[0]]);
      triggerUpload([validFiles[0]], 0);
    } else {
      const availableSlots = maxFiles - files.length;
      const filesToAdd = validFiles.slice(0, availableSlots);
      if (filesToAdd.length) {
        const newFiles = [...files, ...filesToAdd];
        setFiles(newFiles);
        triggerUpload(filesToAdd, files.length);
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

  const handleRemoveFile = async (idx) => {
    if (disabled || readonly) return;
    
    const fileKey = fileKeys[idx];
    const file = files[idx];

    // If file was uploaded, delete from server first
    if (fileKey) {
      setDeletingIndex(idx);
      try {
        const { response } = await Patch({
          route: "media/delete",
          data: { key: fileKey },
        });
        
        // Only remove from UI if API call was successful
        if (response) {
          RenderToast({ message: "File deleted successfully", type: "success" });
          
          // Remove from local state after successful deletion
          if (single) {
            setFiles([]);
            setFileKeys({});
          } else {
            setFiles(files.filter((_, i) => i !== idx));
            const newKeys = { ...fileKeys };
            delete newKeys[idx];
            // Reindex keys
            const reindexed = {};
            files.forEach((_, i) => {
              if (i < idx && fileKeys[i]) reindexed[i] = fileKeys[i];
              if (i > idx && fileKeys[i]) reindexed[i - 1] = fileKeys[i];
            });
            setFileKeys(reindexed);
          }
        } else {
          RenderToast({ message: "Failed to delete file", type: "error" });
        }
      } catch (err) {
        RenderToast({ message: "Failed to delete file", type: "error" });
        console.error("Delete error:", err);
      } finally {
        setDeletingIndex(null);
      }
    } else {
      // If file was not uploaded (no key), just remove from local state
      if (single) {
        setFiles([]);
        setFileKeys({});
      } else {
        setFiles(files.filter((_, i) => i !== idx));
        const newKeys = { ...fileKeys };
        delete newKeys[idx];
        // Reindex keys
        const reindexed = {};
        files.forEach((_, i) => {
          if (i < idx && fileKeys[i]) reindexed[i] = fileKeys[i];
          if (i > idx && fileKeys[i]) reindexed[i - 1] = fileKeys[i];
        });
        setFileKeys(reindexed);
      }
    }
  };

  const handleOpenFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || "download";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reachedMaxFiles = !single && files?.length >= maxFiles;
  const isImage = (file) => file?.type?.startsWith("image/");

  // Get supported file types and convert to accept string
  const getAcceptString = () => {
    if (accept === "*") {
      // Use getSupportedImageTypes to get all supported types
      const supportedTypes = getSupportedImageTypes(["all"]);
      return Object.keys(supportedTypes).join(",");
    }
    return accept;
  };

  // Validate file type
  const isValidFileType = (file) => {
    if (accept === "*") {
      const supportedTypes = getSupportedImageTypes(["all"]);
      return Object.keys(supportedTypes).some((mimeType) => {
        if (mimeType.endsWith("/*")) {
          const baseType = mimeType.split("/")[0];
          return file.type?.startsWith(`${baseType}/`);
        }
        return file.type === mimeType;
      });
    }
    // If accept is specified, browser handles validation
    return true;
  };

  return (
    <div className={classes.uploadContainer}>
      {label && <h2>{label}</h2>}
      
      <div className={classes.main}>
        <div
          className={`${classes.dragAndDropContainer} ${
            dragActive ? classes.dragActive : ""
          } ${disabled || reachedMaxFiles ? classes.disabled : ""}`}
          onClick={() => !disabled && !reachedMaxFiles && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {single && files?.length > 0 ? (
            <div className={classes.singleFilePreview}>
              {uploadingIndices.has(0) ? (
                <div className={classes.loadingWrapper}>
                  <Spinner animation="border" variant="primary" />
                  <p>Uploading...</p>
                </div>
              ) : isImage(files[0]) && fileKeys[0] ? (
                <div className={classes.imageWrapper}>
                  <img
                    src={URL.createObjectURL(files[0])}
                    alt="Preview"
                    className={classes.previewImage}
                  />
                </div>
              ) : !isImage(files[0]) ? (
                <div className={classes.fileInfoCard}>
                  <div className={classes.fileIcon}>📄</div>
                  <div className={classes.fileDetails}>
                    <span className={classes.fileName}>{files[0]?.name}</span>
                    <span className={classes.fileSize}>
                      {(files[0]?.size / 1024)?.toFixed(2)} KB
                    </span>
                  </div>
                </div>
              ) : null}
              <div className={classes.fileActions}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenFile(files[0]);
                  }}
                  className={classes.actionButton}
                  disabled={disabled || readonly}
                >
                  <HiOutlineEye size={18} />
                  View
                </button>
                {!readonly && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(0);
                    }}
                    className={`${classes.actionButton} ${classes.deleteButton}`}
                    disabled={deletingIndex === 0}
                  >
                    {deletingIndex === 0 ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <BiX size={18} />
                    )}
                    {deletingIndex === 0 ? "Deleting..." : "Remove"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className={classes.dragAndDropMessage}>
              <BiUpload color="var(--sky-blue)" size={48} />
              <p>Drag & drop your files here</p>
              <p>or click to browse</p>
            </div>
          )}

          <input
            type="file"
            hidden
            multiple={!single}
            ref={inputRef}
            onChange={handleFileChange}
            disabled={disabled || readonly || reachedMaxFiles}
            accept={getAcceptString()}
          />
        </div>
      </div>

      {!single && files?.length > 0 && (
        <div className={classes.filePreview}>
          {files?.map((file, idx) => (
            <div key={`${file.name}-${idx}`} className={classes.fileCard}>
              {uploadingIndices.has(idx) ? (
                <div className={classes.loadingWrapper}>
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : isImage(file) && fileKeys[idx] ? (
                <div className={classes.imageWrapper}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className={classes.thumbnailImage}
                  />
                </div>
              ) : !isImage(file) ? (
                <div className={classes.fileInfoCard}>
                  <div className={classes.fileIcon}>📄</div>
                  <div className={classes.fileDetails}>
                    <span className={classes.fileName}>{file.name}</span>
                    <span className={classes.fileSize}>
                      {(file.size / 1024)?.toFixed(2)} KB
                    </span>
                  </div>
                </div>
              ) : null}
              <div className={classes.fileActions}>
                <button
                  type="button"
                  onClick={() => handleOpenFile(file)}
                  className={classes.actionButton}
                  disabled={disabled || readonly}
                >
                  <HiOutlineEye size={16} />
                </button>
                {!readonly && !disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className={`${classes.actionButton} ${classes.deleteButton}`}
                    disabled={deletingIndex === idx}
                  >
                    {deletingIndex === idx ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <BiX size={16} />
                    )}
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
