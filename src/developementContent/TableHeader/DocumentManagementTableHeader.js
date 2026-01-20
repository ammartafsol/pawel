export const documentManagementTableHeader = [
  {
    title: "Client Name",
    key: "clientName",
    style: { width: "20%" },
  },
  {
    title: "Type of Case",
    key: "typeOfCase",
    style: { width: "20%" },
  },
  {
    title: "Document name",
    key: "documentName",
    style: { width: "25%" },
    renderItem: ({ item, data }) => {
      // If we have a pre-built fileUrl on the row, make the name clickable to download/open
      if (data?.fileUrl) {
        return (
          <a
            href={data.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1F5CAE", textDecoration: "none" }}
          >
            <RenderTextCell cellValue={item} />
          </a>
        );
      }
      return <RenderTextCell cellValue={item} />;
    },
  },
  {
    title: "Trade Mark no.",
    key: "tradeMarkNo",
    style: { width: "20%" },
  },
  {
    title: "Date Uploaded",
    key: "dateUploaded",
    style: { width: "15%" },
  },
];

