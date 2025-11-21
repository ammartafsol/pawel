import React from "react";
import config from "@/config";
import { formRegEx, formRegExReplacer } from "./regex";

export const mergeClass = (...classes) => {
  return classes.join(" ");
};

// Formatters
export const getFormattedParams = (label) => {
  return capitalizeEachWord(label.replace(formRegEx, formRegExReplacer));
};

export const getFormattedPrice = (price, currency = "$", toFixed) => {
  return `${currency}${parseFloat(price).toFixed(
    toFixed !== undefined ? toFixed : 2
  )}`;
};

export const capitalizeEachWord = (str) => {
  return str?.replace(/\w\S*/g, (w) =>
    w.replace(/^\w/, (c) => c.toUpperCase())
  );
};

// API/URL Helpers
export const baseURL = (link) => `${config.apiBaseUrl}/api/v1/${link}`;

export const imageUrl = (url, defaultUrl = null) => {
  if (!url)
    return defaultUrl || "/images/app-images/default-fallback-image.png";

  if (url.startsWith("/")) return url;

  const match = url.match(/\/d\/([^/]+)\//); // Remove this, Just for showing the image from google drive
  if (!(!match || match.length < 2)) {
    // Remove this
    const fileId = match[1]; // Remove this
    return `https://drive.google.com/uc?export=view&id=${fileId}`; // Remove this
  } // Remove this

  const result = url.indexOf("http");

  const imageRenderUrl = result === -1 ? `${config.awsBaseUrl}/${url}` : url;

  return imageRenderUrl;
};

export const createFormData = (data) => {
  const formData = new FormData();
  for (let key in data) {
    if (Array.isArray(data[key])) {
      for (let d in data[key]) {
        if (typeof data[key][d] == "string") {
          formData.append(key, data[key][d]);
        } else if (
          data[key][d] instanceof File ||
          data[key][d] instanceof Date
        ) {
          formData.append(key, data[key][d]);
        } else {
          formData.append(key, JSON.stringify(data[key][d]));
        }
      }
    } else if (typeof data[key] == "object") {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, JSON.stringify(data[key]));
      }
    } else {
      formData.append(key, data[key]);
    }
  }

  return formData;
};

export const apiHeader = (token, isFormData) => {
  if (token && !isFormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }

  if (token && isFormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
  }
  if (!token && !isFormData) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  if (!token && isFormData) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  }
};

// Media Helpers
export const uploadImages = async (images, token) => {
  if (!images.length) return null;
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("photos", image);
  });

  const res = await Post(
    baseURL("media/upload"),
    formData,
    apiHeader(token, true)
  );

  if (res) {
    return res.data?.data?.photos?.map((item) => item?.key);
  }
  return null;
};

export const uploadImagesHelper = async ({
  images,
  setIsLoading,
  setImages,
  token,
}) => {
  if (images.length === 0) return;
  setIsLoading(true);
  uploadImages(images, token)
    .then((res) => {
      if (res) {
        setImages((prev) => [...prev, ...res]);
      }
      setIsLoading(false);
    })
    .finally(() => {
      setIsLoading(false);
    });
};

export const deleteMedia = async ({
  slug,
  key,
  setIsLoading,
  token,
  setImages,
  entity,
}) => {
  const url = baseURL("media/delete");
  const params = { slug: slug, key, type: "image", entity };
  setIsLoading(true);
  const res = await Patch(url, params, apiHeader(token));
  if (res) {
    setImages((prev) => prev.filter((item) => item !== key));
  }
  setIsLoading(false);
};

// Browser Helpers
export const getUniqueBrowserId = () => {
  const uniqueBrowserId = localStorage?.getItem("uniqueBrowserId");
  if (uniqueBrowserId) {
    return uniqueBrowserId;
  }

  if (window.navigator) {
    var navigator_info = window.navigator;
    var screen_info = window.screen;
    var uid = navigator_info.mimeTypes.length;
    uid += navigator_info.userAgent.replace(/\D+/g, "");
    uid += navigator_info.plugins.length;
    uid += screen_info.height || "";
    uid += screen_info.width || "";
    uid += screen_info.pixelDepth || "";

    localStorage.setItem("uniqueBrowserId", uid);
    return uid;
  } else {
    const theId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem("uniqueBrowserId", theId);
    return theId;
  }
};

export function splitTextIntoTags(text, tag, wordsPerLine) {
  const words = text.split(" ");
  const lines = [];

  for (let i = 0; i < words.length; i += wordsPerLine) {
    const line = words.slice(i, i + wordsPerLine).join(" ");
    lines.push(line);
  }

  return lines?.map((line, index) =>
    React.createElement(tag, { key: index }, line)
  );
}
