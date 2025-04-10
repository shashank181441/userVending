import { View, FlatList } from "react-native";
import { Image } from "expo-image";
import { BadgeIndianRupee, Dot, HandCoins, ShieldAlert, SquareX, WifiOff } from "lucide-react-native";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";

const titlesAndIconByType = {
  "item-sold": {
    title: "Vending Product just got sold!",
    icon: BadgeIndianRupee,
    variant: "primary",
  },
  "out-of-stock": {
    title: "Out of Stock",
    icon: SquareX,
    variant: "warning",
  },
  "machine-error": {
    title: "Machine Error",
    icon: ShieldAlert,
    variant: "error",
  },
  "network-error": {
    title: "Network Error",
    icon: WifiOff,
    variant: "info",
  },
  "payment-failure": {
    title: "Payment Failed",
    icon: ShieldAlert,
    variant: "error",
  },
  "door-open": {
    title: "Vending Machine Door Open",
    icon: ShieldAlert,
    variant: "warning",
  },
  "offer": {
    title: "!!! Offer Offer Offer !!!",
    icon: HandCoins,
    variant: "success",
  },
};

const getVariantColors = (theme, variant) => {
  const variants = {
    primary: {
      background: theme.colors.primaryContainer,
      text: theme.colors.onPrimaryContainer,
    },
    warning: {
      background: theme.colors.tertiaryContainer,
      text: theme.colors.onTertiaryContainer,
    },
    error: {
      background: theme.colors.errorContainer,
      text: theme.colors.onErrorContainer,
    },
    info: {
      background: theme.colors.secondaryContainer,
      text: theme.colors.onSecondaryContainer,
    },
    success: {
      background: theme.colors.surfaceVariant,
      text: theme.colors.onSurfaceVariant,
    },
  };
  return variants[variant] || variants.primary;
};

function NotificationCard({ notification }) {
  const theme = useTheme();
  const { type, products, productNumber, machine, date, message } = notification;
  const { title, icon: IconComponent, variant } = titlesAndIconByType[type] || {};
  const formattedDate = dayjs(date).format("DD MMM, YYYY [•] hh:mm A");
  const variantColors = getVariantColors(theme, variant);

  return (
    <View 
      style={{ 
        backgroundColor: variantColors.background,
        borderRadius: 16,
        marginTop: 16,
        padding: 16,
        paddingHorizontal: 20,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
      className="mx-4"
    >
      {/* Title */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {IconComponent && (
          <IconComponent 
            size={20} 
            color={variantColors.text}
          />
        )}
        <Text variant="titleMedium" style={{ color: variantColors.text, fontWeight: 'bold' }}>
          {title || "Notification"}
        </Text>
      </View>

      {/* Product Details */}
      {products && products.length > 0 ? (
        products.map((product, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 8 }}
              contentFit="contain"
              transition={1000}
              source={{ uri: product.image_url }}
            />
            <Text variant="bodyMedium" style={{ flex: 1, color: theme.colors.onSurface }}>
              {product.product} 
              <Dot size={11} strokeWidth={6} color={theme.colors.onSurface} /> 
              {machine}
            </Text>
          </View>
        ))
      ) : productNumber ? (
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
          {productNumber} products are out of stock 
          <Dot size={10} strokeWidth={6} color={theme.colors.onSurface} /> 
          {machine}
        </Text>
      ) : (
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, marginBottom: 4 }}>
          {machine || message}
        </Text>
      )}

      {/* Date & Time */}
      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {formattedDate}
      </Text>
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
  const theme = useTheme();

  return (
    <View className="pb-4" style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View className="mb-32">
        
      <View className={`pt-14 bg-orange-600 px-6 pb-4 rounded-2xl`}>
      <Text className="pt-4 rounded-b-xl text-white" style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "white" }}>
        Notification
      </Text>
      </View>
        <FlatList
        // className="mt-4"
          data={notifications.sort((a,b) => b.date.localeCompare(a.date))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <NotificationCard notification={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}