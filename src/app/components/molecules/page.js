"use client";

import DropDown from "@/components/molecules/DropDown/DropDown";
import Pagination from "@/components/molecules/Pagination/Pagination";
import Link from "next/link";
import classes from "./styles.module.css";
import UploadFiles from "@/components/molecules/UploadFiles/UploadFiles";
import Tabs from "@/components/molecules/Tabs/Tabs";
import CaseProgressCard from "@/components/molecules/CaseProgressCard/CaseProgressCard";
import ActionCard from "@/components/molecules/ActionCard/ActionCard";
import ActivityLog from "@/components/molecules/ActivityLog/ActivityLog";
import { mergeClass } from "@/resources/utils/helper";
import AppTable from "@/components/organisms/AppTable/AppTable";
import { staffDashboardTableHeader } from "@/developementContent/TableHeader/StaffDashboardTableHeader";
import { staffDashboardTableBody } from "@/developementContent/TableBody/StaffDashboardTableBody";

export default function MoleculesPage() {
  return (
    <div className={classes.container}>
      <Link href="/components">Back</Link>
      <h1 className={classes.title}>Molecules Page</h1>
      {/* <div className={classes.content}>
        <h3 className={classes.subtitle}>ActivityLog</h3>
        <ActivityLog />
      </div> */}
      <div className={classes.content}>
        <h3 className={mergeClass(classes.subtitle, "mb-4")}>
          CaseProgressCard-3
        </h3>
        <AppTable
          tableHeader={staffDashboardTableHeader}
          data={staffDashboardTableBody}
        />
      </div>
      <div className={classes.content}>
        <h3 className={mergeClass(classes.subtitle, "mb-4")}>
          CaseProgressCard-3
        </h3>
        <CaseProgressCard
          isStatusVariant
          data={{
            tabLabel: "EU TM OPPO",
            userName: "Darlene Steuber",
            progress: 100,
            status: "File Observations",
            trademarkName: "A and Sons",
            trademarkNo: "R-3526",
            referenceLink: "#",
            primaryStaff: "Roxanne Gleichner",
            secondaryStaff: "Roxanne Gleichner",
            jurisdiction: "EUIPO",
            deadline: "Nov 20, 24",
            clientName: "Dana Auer",
          }}
        />
      </div>
      <div className={classes.content}>
        <h3 className={mergeClass(classes.subtitle, "mb-4")}>
          CaseProgressCard-1
        </h3>
        <CaseProgressCard
          data={{
            tabLabel: "EU TM OPPO",
            userName: "Assigned Staff",
            progress: 80,
            status: "Decision",
            trademarkName: "A and Sons",
            trademarkNo: "R-3526",
            referenceLink: "#",
            primaryStaff: "Roxanne Gleichner",
            secondaryStaff: "Roxanne Gleichner",
            jurisdiction: "EUIPO",
          }}
          isAssignedStaffVariant
        />
      </div>
      <div className={classes.content}>
        <h3 className={mergeClass(classes.subtitle, "mb-4")}>
          CaseProgressCard-2
        </h3>
        <CaseProgressCard
          data={{
            tabLabel: "EU TM OPPO",
            userName: "Assigned Staff",
            progress: 80,
            status: "Decision",
            trademarkName: "A and Sons",
            trademarkNo: "R-3526",
            referenceLink: "#",
          }}
        />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>ActionCard</h3>
        <ActionCard label={"create new case"} />
        <ActionCard label={"add a document"} />
        <ActionCard label={"export audit logs"} />
        <ActionCard label={"export data"} />
      </div>
      <div className={classes.content}>
        <h3 className={classes.subtitle}>DropDown</h3>
        <DropDown
          label={"DropDown"}
          placeholder={"Select an option"}
          // multi={true}
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
        <h3 className={classes.subtitle}>DropDown2</h3>
        <DropDown
          centeredLabel={"DropDown"}
          placeholder={"Select an option"}
          // multi={true}
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
