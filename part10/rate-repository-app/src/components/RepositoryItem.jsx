import React from "react";
import { View, Image, StyleSheet } from "react-native";

import Text from "./Text";

import theme from "../theme";

const styles = StyleSheet.create({
  repository: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: "white",
    fontSize: theme.fontSizes.body,
    padding: 10,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  repoDescription: {
    display: "flex",
    gap: 3,
  },
  languageContainer: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
    borderRadius: 6,
    marginTop: 3,
  },
  repoStats: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    marginHorizontal: 20,
  },
});

const formatNumber = (number) => {
  if (number < 1000) {
    return `${number}k`;
  } else if (number >= 1000) {
    let roundedNumber = (number / 1000).toFixed(1);
    return `${roundedNumber}k`;
  } else {
    throw Error("Error, not a valid number");
  }
};

const RepositoryItem = (props) => {
  return (
    <View style={styles.repository}>
      <View style={styles.header}>
        <Image
          style={styles.image}
          source={{
            uri: props.data.ownerAvatarUrl,
          }}
        ></Image>
        <View style={styles.repoDescription}>
          <Text fontWeight="bold">{props.data.fullName}</Text>
          <Text color="textSecondary">{props.data.description}</Text>
          <View style={styles.languageContainer}>
            <Text color="header">{props.data.language}</Text>
          </View>
        </View>
      </View>
      <View style={styles.repoStats}>
        <View>
          <Text fontWeight="bold">
            {formatNumber(props.data.stargazersCount)}
          </Text>
          <Text color="textSecondary">Stars</Text>
        </View>
        <View>
          <Text fontWeight="bold">{formatNumber(props.data.forksCount)}</Text>
          <Text color="textSecondary">Forks</Text>
        </View>
        <View>
          <Text fontWeight="bold">{formatNumber(props.data.reviewCount)}</Text>
          <Text color="textSecondary">Reviews</Text>
        </View>
        <View>
          <Text fontWeight="bold">
            {formatNumber(props.data.ratingAverage)}
          </Text>
          <Text color="textSecondary">Rating</Text>
        </View>
      </View>
    </View>
  );
};

//  id: "jaredpalmer.formik",
//     fullName: "jaredpalmer/formik",
//     description: "Build forms in React, without the tears",
//     language: "TypeScript",
//     forksCount: 1589,
//     stargazersCount: 21553,
//     ratingAverage: 88,
//     reviewCount: 4,
//     ownerAvatarUrl: "https://avatars2.githubusercontent.com/u/4060187?v=4",

export default RepositoryItem;
