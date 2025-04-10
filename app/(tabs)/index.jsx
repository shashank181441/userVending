import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Searchbar, Avatar } from "react-native-paper";
import { Bell } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  Home,
  IceCream,
  Heart,
  Gift,
  Gamepad2,
  Package,
  Map,
  Settings,
} from "lucide-react-native";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load theme mode from AsyncStorage on mount
    const loadTheme = async () => {
      const storedMode = await AsyncStorage.getItem("isDarkMode");
      if (storedMode !== null) {
        setIsDarkMode(storedMode === "true"); // Convert string to boolean
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("isDarkMode", newMode.toString()); // Store as string
  };

  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  const menuItems = [
    { title: "Home", icon: Home, route: "/home/machines" },
    { title: "Desserts", icon: IceCream, route: "DessertsScreen" },
    { title: "Favorites", icon: Heart, route: "FavoritesScreen" },
    { title: "Gifts", icon: Gift, route: "GiftsScreen" },
    { title: "Games", icon: Gamepad2, route: "GamesScreen" },
    { title: "Orders", icon: Package, route: "OrdersScreen" },
    { title: "Map", icon: Map, route: "MapScreen" },
    { title: "Settings", icon: Settings, route: "/home/menu" },
  ];

  const posts = Array(8).fill({
    title: "Menu Item",
    onPress: () => console.log("Menu item pressed"),
  });

  return (
    <PaperProvider theme={theme}>
      <View className={`flex-1 ${isDarkMode ? "bg-white" : "bg-white"}`}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />

        {/* Header */}
        <View className={`pt-14 rounded-b-2xl mb-4 ${isDarkMode ? "bg-orange-600" : "bg-orange-600"}`}>
          <View className="flex-row justify-between items-center p-4">
            <Image
              source={{ uri: "https://files.catbox.moe/h25igo.png" }}
              className="h-10 w-40 float-start"
              resizeMode="contain"
            />
            <View className="flex-row items-center gap-4">
              <View className="relative">
                <Bell color={"#fff"} size={24} />
                <View className="absolute -top-1 -right-1 bg-blue-500 w-5 h-5 rounded-full justify-center items-center">
                  <Text className="text-white text-xs font-bold">4</Text>
                </View>
              </View>

              {/* Dark Mode Toggle Switch */}
              {/* <Switch value={isDarkMode} onValueChange={toggleDarkMode} /> */}
            </View>
          </View>

          {/* Search Bar */}
          <View className="mb-4 mx-4">
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              className="rounded-full bg-white"
              inputStyle={{ fontSize: 14 }}
              style={{
                elevation: 0,
                backgroundColor: "white",
                borderRadius: 12,
                paddingVertical: -4,
              }}
            />
          </View>
        </View>

        <ScrollView className="flex-1 p-4 bg-white">
          {/* Welcome Card */}
          <View className={`rounded-2xl p-5 flex-row justify-between items-center mb-8 ${isDarkMode ? "bg-gray-800" : "bg-yellow-400"}`}>
            <View>
              <Text className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-black"}`}>Hi Shashank Pandey</Text>
              <Text className={`text-sm opacity-70 tracking-widest font-semibold ${isDarkMode ? "text-gray-300" : "text-black"}`}>
                Welcome back!
              </Text>
            </View>
            <Avatar.Image size={48} source={{ uri: "https://files.catbox.moe/m70k7i.png" }} />
          </View>

          {/* Quick Menu */}
          <View className="w-full mb-12">
            <Text className={`mb-6 tracking-widest font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Quick Menu</Text>
            <View className="flex-row flex-wrap max-w-lg justify-center gap-8 mx-auto">
              {menuItems.map((item, index) => (
                <TouchableOpacity key={index} className="w-[16%] aspect-square" onPress={() => router.push(item.route)}>
                  <View className={`flex-1 rounded-2xl items-center justify-center ${isDarkMode ? "bg-gray-700" : "bg-gray-200/80"}`}>
                    <item.icon size={36} color={isDarkMode ? "#FFB74D" : "#FF7043"} strokeWidth={2} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sponsored Content */}
          <Text className={`mb-4 tracking-widest font-bold ${isDarkMode ? "text-white" : "text-black"}`}>Sponsored Content</Text>
          <View className="flex flex-col gap-6 mt-4">
            {posts.map((post, index) => (
              <View key={index} className={`h-48 gap-3 rounded-2xl px-3 py-2 flex-row items-center ${isDarkMode ? "bg-gray-800" : "bg-yellow-200"}`}>
                <View className="h-40">
                  <Image className="h-full w-auto aspect-[3/4]" resizeMode="contain" source={{ uri: "https://files.catbox.moe/d1cii8.png" }} />
                </View>

                {/* Text and QR Section */}
                <View className="flex-1 px-3 py-2 justify-between gap-4">
                  <Text className={`font-bold text-md ${isDarkMode ? "text-white" : "text-black"}`}>Title</Text>
                  <View className="flex-row justify-between items-center mr-2">
                    <Text className={`w-[75%] text-sm ${isDarkMode ? "text-gray-300" : "text-black"}`}>
                      A convenient, on-demand solution for dispensing your goto snacks anytime.
                    </Text>

                    {/* QR Code */}
                    <View className="flex flex-col gap-2">
                      <Image source={{ uri: "https://files.catbox.moe/8xzha7.png" }} className="w-20 h-20" />
                      <Text className={`text-[0.50rem] ${isDarkMode ? "text-gray-300" : "text-black"}`}>Scan for more info</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}
