import Input from "@/components/atoms/Input/Input";
import { changePasswordFormValues } from "@/formik/initialValues";
import { ChangePasswordFormSchema } from "@/formik/schema";
import { useFormik } from "formik";
import { Col, Container, Row } from "react-bootstrap";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import classes from "./UpdatePasswordModal.module.css";
import Button from "@/components/atoms/Button";

export default function UpdatePasswordModal({ show, setShow }) {
  const form = useFormik({
    initialValues: changePasswordFormValues,
    validationSchema: ChangePasswordFormSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <ModalSkeleton
      variant="secondary"
      show={show}
      setShow={setShow}
      heading="Update Password"
      showCloseIcon={true}
      footerData={
        <div className={classes.footerContainer}>
          <Button
            label="Update Password"
            variant="secondary"
            onClick={() => form.handleSubmit()}
          />
          <Button
            label="Cancel"
            variant="secondary-outline"
            onClick={() => setShow(false)}
          />
        </div>
      }
    >
      <Container fluid>
        <Row className={classes.rowGap}>
          <Col md={12}>
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter your current password"
              value={form.values.currentPassword}
              setValue={(val) => form.setFieldValue("currentPassword", val)}
              error={
                form.touched.currentPassword && form.errors.currentPassword
              }
              onEnterClick={() => {
                form.handleSubmit();
              }}
            />
          </Col>
          <Col md={12}>
            <Input
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              value={form.values.password}
              setValue={(val) => form.setFieldValue("password", val)}
              error={form.touched.password && form.errors.password}
            />
          </Col>
          <Col md={12}>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Enter your confirm password"
              value={form.values.confirmPassword}
              setValue={(val) => form.setFieldValue("confirmPassword", val)}
              error={
                form.touched.confirmPassword && form.errors.confirmPassword
              }
            />
          </Col>
        </Row>
      </Container>
    </ModalSkeleton>
  );
}
