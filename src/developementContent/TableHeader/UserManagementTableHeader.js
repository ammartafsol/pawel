import Status from "@/components/atoms/Status/Status";
import Link from "next/link";
import classes from "@/components/Template/Staff/UserManagementTemplate/UserManagementTemplate.module.css";

export const userManagementTableHeader = [
  {
    title: "Client Name",
    key: "clientName",
    style: { width: "18%" },
  },
  {
    title: "Email",
    key: "email",
    style: { width: "22%" },
  },
  {
    title: "Number of Cases",
    key: "numberOfCases",
    style: { width: "15%" },
  },
  {
    title: "Status",
    key: "status",
    style: { width: "15%" },
    renderItem: ({ item, data }) => {
      return <Status label={item} variant={data.statusVariant} />;
    },
  },
  {
    title: "Created",
    key: "created",
    style: { width: "15%" },
  },
  {
    title: "Actions",
    key: "viewDetails",
    style: { width: "15%" },
    renderItem: ({ data }) => {
      return (
        <Link 
          href={`/staff/user-management/${data.id}`}
          className={classes.viewDetailsLink}
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
      );
    },
  },
];




