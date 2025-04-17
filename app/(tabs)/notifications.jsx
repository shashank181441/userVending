import { View, Text, FlatList } from "react-native";
import { Image } from "expo-image";
import { BadgeIndianRupee, Dot, HandCoins, ShieldAlert, SquareX, WifiOff } from "lucide-react-native";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";

const titlesAndIconByType = {
  "item-sold": {
    title: "Vending Product just got sold!",
    icon: BadgeIndianRupee,
  },
  "out-of-stock": {
    title: "Out of Stock",
    icon: SquareX,
  },
  "machine-error": {
    title: "Machine Error",
    icon: ShieldAlert,
  },
  "network-error": {
    title: "Network Error",
    icon: WifiOff,
  },
  "payment-failure": {
    title: "Payment Failed",
    icon: ShieldAlert,
  },
  "door-open": {
    title: "Vending Machine Door Open",
    icon: ShieldAlert,
  },
  "offer": {
    title: "!!! Offer Offer Offer !!!",
    icon: HandCoins,
  },
};

export function NotificationCard({ notification }) {
  const { type, products, productNumber, machine, date, message } = notification;
  const { title, icon: IconComponent } = titlesAndIconByType[type] || {};
  const formattedDate = dayjs(date).format("DD MMM, YYYY [•] hh:mm A");

  return (
    <View className="bg-[#FFD1C3] p-4 px-5 rounded-xl mt-4 mx-4">
      {/* Title */}
      <View className="flex-row items-center gap-2 mb-1">
        {IconComponent && <IconComponent size={20} stroke={"black"} className="mr-1" />}
        <Text className="font-semibold text-lg">{title || "Notification"}</Text>
      </View>

      {/* Product Details */}
      {products && products.length > 0 ? (
        products.map((product, index) => (
          <View key={index} className="flex-row items-center gap-4 mb-2">
            <Image
              className="rounded-md"
              style={{ width: 50, height: 50, borderRadius: 6 }}
              contentFit="contain"
              transition={1000}
              source={{ uri: product.image_url }}
            />
            <Text className="flex-1 text-gray-800 font-semibold">
              {product.product} <Dot size={11} strokeWidth={6} stroke="black" /> {machine}
            </Text>
          </View>
        ))
      ) : productNumber ? (
        <Text className="text-gray-800 font-semibold mb-1">
          {productNumber} products are out of stock <Dot size={10} strokeWidth={6} stroke="black" /> {machine}
        </Text>
      ) : (
        <Text className="text-gray-800 font-semibold mb-1">{machine || message}</Text>
      )}

      {/* Date & Time */}
      <Text className="text-gray-700 text-xs">{formattedDate}</Text>
    </View>
  );
}

const notifications = [
    {
      type: "item-sold",
      products: [{ image_url: "https://res.cloudinary.com/dwujpumwu/image/upload/v1737620541/rqaduii7eh7hflzxmnc5.png", product: "Amul Lassi" }],
      machine: "Labim Mall, Pulchowk [A012MG70]",
      date: "2024-10-29T10:35:11.590Z",
    },
    {
      type: "item-sold",
      products: [
        { image_url: "https://res.cloudinary.com/dwujpumwu/image/upload/v1737620541/rqaduii7eh7hflzxmnc5.png", product: "Amul Lassi" },
        { image_url: "https://res.cloudinary.com/dwujpumwu/image/upload/v1737620541/rqaduii7eh7hflzxmnc5.png", product: "Amul Lassi" },
        ],
      machine: "Labim Mall, Pulchowk [A012MG70]",
      date: "2024-10-29T10:35:11.590Z",
    },
  { type: "out-of-stock", productNumber: 21, machine: "Labim Mall, Pulchowk [A012MG70]", date: "2025-02-18T08:12:19.628Z" },
  { type: "machine-error", machine: "Labim Mall, Pulchowk [A012MG70]", date: "2025-02-18T08:12:19.628Z" },
  { type: "network-error", machine: "Labim Mall, Pulchowk [A012MG70]", date: "2025-02-18T08:12:19.628Z" },
  { type: "payment-failure", machine: "Labim Mall, Pulchowk [A012MG70]", date: "2025-02-18T08:12:19.628Z" },
  { type: "door-open", machine: "Labim Mall, Pulchowk [A012MG70]", date: "2025-02-18T08:12:19.628Z" },
  { type: "offer", message: "Beverage lphavend vending is off 15% for the first 10 users. Grab the offer before it's too late.", date: "2025-02-18T08:12:19.628Z" },
];

export default function Notifications() {
  return (
    <View className="mb-8">
      <View className={`pt-14 bg-orange-600 px-6 pb-4 rounded-2xl`}>
    <Text className="pt-4 rounded-b-xl text-white" style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "white" }}>
      Notification
    </Text>
    </View>
      <FlatList
        data={notifications.sort((a,b)=>b.date.localeCompare(a.date))}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        showsVerticalScrollIndicator={false}
        className="mb-32"
      />
    </View>
  );
}