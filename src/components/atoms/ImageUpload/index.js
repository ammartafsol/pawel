"use client";
import { imageUrl, mergeClass } from "@/resources/utils/helper";
import Image from "next/image";
import { FaUpload } from "react-icons/fa6";
import { IoCloseCircle } from "react-icons/io5";
import classes from "./ImageUpload.module.css";

/**
 * ImageUpload component for uploading and displaying an image.
 *
 * @param {Object} props
 * @param {File|string|null} [props.image=null] - The image file or URL to display.
 * @param {function} [props.setImage=() => {}] - Function to update the image value.
 * @param {string} [props.label=""] - Label text for the upload field.
 * @param {string} [props.error=""] - Error message to display.
 * @returns {JSX.Element}
 */
export default function ImageUpload({
  image = null,
  setImage = () => {},
  label = "",
  error = "",
}) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // set file object directly
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    document.getElementById("upload-input").value = null;
  };

  const getImageSrc = (img) => {
    if (typeof img === "string") {
      return imageUrl(img);
    }
    return URL.createObjectURL(img);
  };

  return (
    <div>
      <p className={classes.labelText}>{label}</p>
      <div className={classes.mainDiv}>
        {image ? (
          <Image
            src={getImageSrc(image)}
            alt="image"
            width={64}
            height={64}
            style={{
              borderRadius: "10px",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            className={mergeClass(classes.upload, "pointer")}
            onClick={() => document.getElementById("upload-input").click()}
          >
            <FaUpload size={24} />
          </div>
        )}
        {image && (
          <div className={classes.btnDiv}>
            <IoCloseCircle
              className="pointer"
              size={36}
              onClick={handleRemoveImage}
              color="var(--error-v1)"
            />
          </div>
        )}
      </div>
      <input
        id="upload-input"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      {error && <p className={`${classes.error}`}>*{error}</p>}
    </div>
  );
}
