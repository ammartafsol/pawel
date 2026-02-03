export const loginFormValues = {
  email: "",
  password: "",
  checkbox: false,
};

export const signUpFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export const updatePasswordValues = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

export const forgotPasswordValues = {
  email: "",
};

export const resetPasswordValues = {
  password: "",
  confirmPassword: "",
};

export const createNewCaseFormValues = {
  jurisdiction: "",
  caseType: "",
  clientName: "",
  primaryStaff: "",
  secondaryStaff: null,
  reference: "",
  trademarkName: "",
  trademarkNumber: "",
  deadlines: [{ internalDeadline: "", officeDeadline: "" }],
};
export const addNoteFormValues = {
  noteTitle: "",
  description: "",
  permissible: [],
};

export const replySupportFormValues = {
  message: "",
};


export const generateTicketFormValues = {
  categorySlug: "",
  message: "",
};


export const assignDocumentFormValues = {
  document: null,
  permissions: [],
};