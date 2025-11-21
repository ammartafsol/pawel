"use client";

import Breadcrumbs from "@/components/atoms/Breadcrumbs/Breadcrumbs";
import Button from "@/components/atoms/Button";
import DatePicker from "@/components/atoms/DatePicker/DatePicker";
import DynamicImage from "@/components/atoms/DynamicImage/DynamicImage";
import ImageUpload from "@/components/atoms/ImageUpload";
import Input from "@/components/atoms/Input/Input";
import { Loader } from "@/components/atoms/Loader";
import LoadingSkeleton from "@/components/atoms/LoadingSkeleton/LoadingSkeleton";
import NoDataFound from "@/components/atoms/NoDataFound/NoDataFound";
import NotFound from "@/components/atoms/NotFound/NotFound";
import PhoneInput from "@/components/atoms/PhoneInput/PhoneInput";
import PlacesInput from "@/components/atoms/PlacesInput/PlacesInput";
import SpinnerLoading from "@/components/atoms/SpinnerLoading/SpinnerLoading";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import Link from "next/link";
import { BiPen } from "react-icons/bi";
import classes from "./styles.module.css";

export default function AtomsPage() {
  return (
    <div className={classes.container}>
      <Link href="/components">Back</Link>
      <h1 className={classes.title}>Atoms Page</h1>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Button</h3>
        <Button label="Click Me" variant="primary" />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Input</h3>
        <Input leftIcon={<BiPen />} placeholder="Type here..." />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>TextArea</h3>
        <TextArea placeholder="Type here..." />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Loader</h3>
        <Loader />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Spinner</h3>
        <SpinnerLoading />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Loading Skeleton</h3>
        <LoadingSkeleton />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Phone Input</h3>
        <PhoneInput />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Places Input</h3>
        <PlacesInput />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>No Data Found</h3>
        <NoDataFound />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Not Found</h3>
        <NotFound />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Image Upload</h3>
        <ImageUpload />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Dynamic Image</h3>
        <DynamicImage
          src="/app-images/image-placeholder.png"
          alt="Sample Image"
          containerStyles={{
            height: "100px",
            width: "100px",
          }}
        />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>BreadCrumbs</h3>
        <Breadcrumbs />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Date Picker</h3>
        <DatePicker />
      </div>
    </div>
  );
}
