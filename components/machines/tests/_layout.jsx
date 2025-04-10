// import { Image } from "expo-image";
// import { Tabs } from "expo-router";
// import { Package, Settings as Gear } from "lucide-react-native";
// import { Text } from "react-native";
// import { useSelector } from "react-redux";


// export default function Layout() {
//   const isLoggedIn = useSelector((state) => state.auth.status);
//   const userData = useSelector((state) => state.auth.userData);

//   // const avatarUrl = userData?.data?.user?.avatar || ""; // Ensure avatar is a string

//   const blurhash =
//     '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

//     if(!isLoggedIn){
//         return <Text>Log in first</Text>
//     }
//     if (!userData) return ( <Text>Loading...</Text> )

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         // tabBarLabel: {position: "below-icon"},
//         tabBarActiveTintColor: "#4f46e5",
//         tabBarLabelPosition: "below-icon",
//         tabBarInactiveTintColor: "gray",
//         tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5, height: 60 },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
//         }}
//       />
//       <Tabs.Screen
//         name="create"
//         options={{
//           title: "Create",
//           tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//             title: "Profile",
//           tabBarIcon: ({ color, size }) =>
//             isLoggedIn ? (
//               <Image
//                 style={{ width: size, height: size, borderRadius: size / 2 }}
//                 source={{ uri: userData?.data?.avatar }}
//                 placeholder={{ blurhash }}
//                 contentFit="cover"
//                 transition={1000}
//               />
//             ) : (
//               <Gear color={color} size={size} />
//             ),
//         }}
//       />
//     </Tabs>
//   );
// }


// // import { View, Text } from 'react-native'
// // import React from 'react'

// // export default function _layout() {
// //   return (
// //     <View>
// //       <Text>_layout</Text>
// //     </View>
// //   )
// // }

import { View, Text } from 'react-native'
import React from 'react'

export default function _layout() {
  return (
    <View>
      <Text>_layout</Text>
    </View>
  )
}