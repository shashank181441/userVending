import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Avatar } from "react-native-paper";
import { ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const menuData = [
  {
    title: "Customizations",
    subMenu: [
      { title: "Notifications", slug: "notifications" },
      { title: "Theme", slug: "theme" },
    ],
  },
  {
    title: "Security",
    subMenu: [
      { title: "Change Password", slug: "change-password" },
      { title: "Change Phone No.", slug: "change-phone" },
    ],
  },
  {
    title: "App Settings",
    subMenu: [
      { title: "Language", slug: "language" },
      { title: "Contact Customer Service", slug: "customer-service" },
      { title: "FAQs", slug: "faqs" },
      { title: "Feedback and Suggestions", slug: "feedback" },
      { title: "Privacy Policy", slug: "privacy-policy" },
      { title: "App Info", slug: "app-info" },
      { title: "Logout", slug: "logout" },
    ],
  },
];

export default function Menu() {
  return (
    <View >
      {/* Profile Header */}
      <View className="flex-row justify-between bg-orange-600 rounded-b-2xl py-8 pt-16 px-8 items-center">
        <View className="flex-row gap-8 items-center">
          <Avatar.Image
            size={72}
            source={{ uri: "https://files.catbox.moe/m70k7i.png" }}
          />
          <View className="flex-col">
            <Text className="text-2xl text-white font-bold">Shashank Pandey</Text>
            <Text className="text-white mb-2">9864691673</Text>
            <TouchableOpacity className="bg-gray-800 p-1 px-2 rounded-md max-w-28">
              <Text className="text-white text-center">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView className="pt-4 px-4 mb-48">
        {menuData.map((section, index) => (
          <View key={index} className="mb-6">
            <Text className="mx-4 text-2xl font-bold">{section.title}</Text>
            <View className="mt-2 flex-col gap-3">
              {section.subMenu.map((item, subIndex) => (
                <TouchableOpacity
                  key={subIndex}
                  onPress={() => console.log(`Navigating to ${item.slug}`)}
                  className="bg-orange-200 rounded-lg mx-3 p-3 px-6 flex-row justify-between items-center"
                >
                  <Text className="font-[semibold]">{item.title}</Text>
                  <ChevronRight size={24} color={"#111"} strokeWidth={3} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
