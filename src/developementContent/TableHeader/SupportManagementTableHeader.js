import Status from "@/components/atoms/Status/Status";

export const supportManagementTableHeader = (onPendingClick) => [
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
      const isPending = item?.toLowerCase() === 'pending';
      return (
        <Status 
          label={item}
          isPending={isPending}
          onClick={isPending ? (e) => {
            e.stopPropagation();
            onPendingClick?.(data);
          } : undefined}
        />
      );
    },
  },
  {
    title: "Received",
    key: "received",
    style: { width: "15%" },
  },
];

