import Status from "@/components/atoms/Status/Status";
import Link from "next/link";

export const staffDashboardTableHeader = [
  {
    title: "Client",
    key: "client",
    style: { width: "25%" },
  },
  {
    title: "Type of Case",
    key: "typeOfCase",
    style: { width: "25%" },
  },
  {
    title: "Trademark Name",
    key: "trademarkName",
    style: { width: "28%" },
  },
  {
    title: "Trademark Number",
    key: "trademarkNumber",
    style: { width: "25%" },
    renderItem: ({ item }) => {
      return (
        <Link href="#" style={{ color: "#1F5CAE", textDecoration: "none" }}>
          {item}
        </Link>
      );
    },
  },
  {
    title: "Status",
    key: "status",
    style: { width: "20%" },
    renderItem: ({ item, data }) => {
      return <Status label={item} variant={data.statusVariant} />;
    },
  },
  {
    title: "Next Task",
    key: "nextTask",
    style: { width: "20%" },
    renderItem: ({ item, data }) => {
      return <Status label={item} variant={data.nextTaskVariant} />;
    },
  },
  {
    title: "Attorney",
    key: "attorney",
    style: { width: "55%" },
  },
];

