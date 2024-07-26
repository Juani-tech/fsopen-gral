import React from "react";
import { Text, View } from "react-native";

const RepositoryItem = (props) => {
  console.log("Me llega: ", props);
  return (
    <View>
      <Text>{props.data.id}</Text>
      <Text>{props.data.fullName}</Text>
      <Text>{props.data.language}</Text>
      <Text>{props.data.forksCount}</Text>
      <Text>{props.data.stargazersCount}</Text>
      <Text>{props.data.ratingAverage}</Text>
      <Text>{props.data.reviewCount}</Text>
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
