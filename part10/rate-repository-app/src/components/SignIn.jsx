import React from "react";
import Text from "./Text";
import FormikTextInput from "./FormikTextInput";
import { Formik } from "formik";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import * as yup from "yup";
import theme from "../theme";

const initialValues = {
  username: "",
  password: "",
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    display: "flex",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    color: "white",
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
    padding: 15,
  },
});

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const SignInForm = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      <FormikTextInput
        name="username"
        placeholder="Username"
        style={styles.input}
      ></FormikTextInput>

      <FormikTextInput
        name="password"
        placeholder="password"
        secureTextEntry
        style={styles.input}
      ></FormikTextInput>

      <TouchableWithoutFeedback onPress={onSubmit}>
        <Text style={styles.submitButton}>Sign in</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const SignIn = () => {
  const onSubmit = (values) => {
    console.log("Values: ", values);
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit}></SignInForm>}
    </Formik>
  );
};

export default SignIn;
