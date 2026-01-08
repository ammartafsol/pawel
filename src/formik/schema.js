import { emailRegex } from "@/resources/utils/regex";
import * as Yup from "yup";

export const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test(
      "no-special-chars",
      "Email contains invalid characters",
      (value) => !value || emailRegex.test(value)
    ),
  password: Yup.string().required("Password is required"),
});

export const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test(
      "no-special-chars",
      "Email contains invalid characters",
      (value) => !value || emailRegex.test(value)
    ),
});

export const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const CreateNewCaseSchema = Yup.object({
  caseType: Yup.string().required("Case Type is required"),
  clientName: Yup.string().required("Client Name is required"),
  reference: Yup.string().required("Reference is required"),
  trademarkName: Yup.string().required("Trademark Name is required"),
  trademarkNumber: Yup.string().required("Trademark Number is required"),
  jurisdiction: Yup.string().required("Jurisdiction is required"),
  deadlines: Yup.array().of(
    Yup.object({
      internalDeadline: Yup.string().required("Internal deadline date is required"),
      officeDeadline: Yup.string().required("Office deadline date is required"),
    })
  ).min(1, "At least one deadline is required"),
  primaryStaff: Yup.string().required("Primary Staff is required"),
});

export const AddNoteSchema = Yup.object({
  noteTitle: Yup.string().required("Note Title is required"),
  description: Yup.string().required("Description is required"),
  permissible: Yup.string().required("Permissible is required"),
});

export const ReplySupportSchema = Yup.object({
  message: Yup.string().required("Message is required"),
});

export const GenerateTicketSchema = Yup.object({
  issue: Yup.string().required("Please select an issue"),
  description: Yup.string().when("issue", {
    is: (value) => value && value !== "",
    then: (schema) => schema.required("Description is required"),
    otherwise: (schema) => schema,
  }),
});

export const ChangePasswordFormSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});