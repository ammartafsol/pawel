export const notificationDummyData = [
  {
    _id: "1",
    title: "New Case Assigned",
    message: "You have been assigned a new case: EU TM OPPO - A and Sons",
    type: "info",
    isRead: false,
    seen: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    _id: "2",
    title: "Deadline Approaching",
    message: "Deadline for case R-3526 is approaching in 2 days",
    type: "warning",
    isRead: false,
    seen: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    _id: "3",
    title: "Case Completed",
    message: "Case R-3526 has been successfully completed",
    type: "success",
    isRead: true,
    seen: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
  {
    _id: "4",
    title: "Document Uploaded",
    message: "New document has been uploaded for case R-3526",
    type: "info",
    isRead: true,
    seen: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
  },
  {
    _id: "5",
    title: "Task Pending",
    message: "You have a pending task: Prepare Draft for case R-3526",
    type: "pending",
    isRead: false,
    seen: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
  },
  {
    _id: "6",
    title: "Client Response Required",
    message: "Client response is required for case R-3526",
    type: "warning",
    isRead: true,
    seen: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    _id: "7",
    title: "Case Status Updated",
    message: "Case status has been updated to 'File Observations'",
    type: "info",
    isRead: true,
    seen: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
  },
  {
    _id: "8",
    title: "New Message",
    message: "You have received a new message from the client",
    type: "info",
    isRead: false,
    seen: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
  },
];

