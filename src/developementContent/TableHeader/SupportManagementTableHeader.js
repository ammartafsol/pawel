import Status from "@/components/atoms/Status/Status";

export const supportManagementTableHeader = [
  {
    title: "Client Name",
    key: "clientName",
    style: { width: "20%" },
  },
  {
    title: "Category",
    key: "category",
    style: { width: "20%" },
  },
  {
    title: "Message",
    key: "message",
    style: { width: "20%" },
  },
  {
    title: "Status",
    key: "status",
    style: { width: "15%" },
    renderItem: ({ item, data }) => {
      return <Status label={item}/>;
    },
  },
  {
    title: "Received",
    key: "received",
    style: { width: "15%" },
  },
];

