"use client";

import DropDown from "@/components/molecules/DropDown/DropDown";
import Pagination from "@/components/molecules/Pagination/Pagination";
import Link from "next/link";
import classes from "./styles.module.css";
import UploadFiles from "@/components/molecules/UploadFiles/UploadFiles";
import Tabs from "@/components/molecules/Tabs/Tabs";

export default function MoleculesPage() {
  return (
    <div className={classes.container}>
      <Link href="/components">Back</Link>
      <h1 className={classes.title}>Molecules Page</h1>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>DropDown</h3>
        <DropDown
          label={"DropDown"}
          placeholder={"Select an option"}
          multi={true}
          options={[
            {
              label: "Option 1",
              value: "option1",
            },
            {
              label: "Option 2",
              value: "option2",
            },
            {
              label: "Option 3",
              value: "option3",
            },
          ]}
        />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Pagination</h3>
        <Pagination
          currentPage={1}
          limit={10}
          totalRecords={100}
          maxVisiblePages={3}
          onPageChange={(e) => {
            console.log("onPageChange", e);
          }}
        />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Upload Files</h3>
        <UploadFiles />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>Tabs</h3>
        <Tabs
          tabs={[
            {
              label: "Tab 1",
              value: "Tab 1 content",
            },
            {
              label: "Tab 2",
              value: "Tab 2 content",
            },
          ]}
        />
      </div>
    </div>
  );
}
