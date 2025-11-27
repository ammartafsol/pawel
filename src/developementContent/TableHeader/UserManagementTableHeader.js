import Status from "@/components/atoms/Status/Status";

export const userManagementTableHeader = [
  {
    title: "Client Name",
    key: "clientName",
    style: { width: "20%" },
  },
  {
    title: "Email",
    key: "email",
    style: { width: "25%" },
  },
  {
    title: "Number of Cases",
    key: "numberOfCases",
    style: { width: "18%" },
  },
  {
    title: "Status",
    key: "status",
    style: { width: "18%" },
    renderItem: ({ item, data }) => {
      return <Status label={item} variant={data.statusVariant} />;
    },
  },
  {
    title: "Created",
    key: "created",
    style: { width: "19%" },
  },
];




