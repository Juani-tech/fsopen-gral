import React from "react";
import Constants from "expo-constants";
import { Text, StyleSheet, View } from "react-native";
import RepositoryList from "./RepositoryList";
import AppBar from "./AppBar";
import { Route, Routes, Redirect } from "react-router-native";
import SignIn from "./SignIn";

const styles = StyleSheet.create({
  main: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: "#e1e4e8",
  },
});

const Main = () => {
  return (
    <View style={styles.main}>
      <AppBar></AppBar>
      <Routes>
        <Route path="/" element={<RepositoryList />} exact></Route>
        <Route path="/signIn" element={<SignIn />}></Route>
      </Routes>
    </View>
  );
};

export default Main;
