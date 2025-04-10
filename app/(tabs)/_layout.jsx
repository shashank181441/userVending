import { View, Text } from "react-native";
import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Home, Server, Bell, Settings, LayoutTemplate } from "lucide-react-native";
import { Badge } from "react-native-paper";
import App from ".";
import { MachineCard } from "./machines";

export default function _layout() {
  // Dummy Notification Data
  const [notifications] = useState([
    { id: 1, title: "New order received", read: false },
    { id: 2, title: "Machine maintenance due", read: false },
    { id: 3, title: "Payment processed", read: false },
  ]);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Tabs
    style={{paddingBottom: "4rem"}}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF7043",
        tabBarInactiveTintColor: "gray",
        tabBarItemStyle: {
          alignItems: "center",
          marginTop: 5
        },
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingVertical: 5,
          height: 70,
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="machines"
        options={{
          tabBarLabel: "Machines",
          tabBarIcon: ({ color }) => <Server size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color }) => (
            <View>
              <Bell size={24} color={color} />
              {unreadCount > 0 && (
                <Badge
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "#FF7043",
                  }}
                  size={16}
                //   color="white"
                >
                  <Text className="text-white text-xs font-bold ">{unreadCount}</Text>
                </Badge>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color }) => <LayoutTemplate size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
