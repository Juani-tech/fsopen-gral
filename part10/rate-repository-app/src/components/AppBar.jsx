import React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import theme from "../theme";
import { Link } from "react-router-native";

import Text from "./Text";
import { ScrollView } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.header,
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: 50,
  },
  scroll: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View style={{ display: "flex", flexDirection: "row", gap: 20 }}>
          <Text color="header" fontSize="title" fontWeight="bold">
            Repositories
          </Text>
          <Link to={"/signIn"}>
            <Text color="header" fontSize="title" fontWeight="bold">
              Sign in
            </Text>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
};

export default AppBar;
