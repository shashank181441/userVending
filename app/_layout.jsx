import { Slot, SplashScreen, Stack, Tabs, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MD3LightTheme, MD3DarkTheme, PaperProvider } from "react-native-paper";
import { Text, useColorScheme } from "react-native";
import { Provider } from "react-redux";
import store from "@/store/store";
import { Loader2 } from "lucide-react-native";
import { useAuth } from "../hooks/useAuth";
import { getCurrentUser } from "@/components/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/store/authSlice";
import "../global.css"
import { useFonts } from "expo-font";
import { setStatusBarBackgroundColor } from "expo-status-bar";
import { DarkTheme, DefaultTheme, NavigationContext, ThemeProvider } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


SplashScreen.preventAutoHideAsync();

export default function App() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  // const theme = colorScheme === "dark" ? MD3LightTheme : MD3DarkTheme;
  // const theme = MD3LightTheme
  console.log(colorScheme)

  const [loaded] = useFonts({
    "normal": require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    "bold": require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    "light": require('../assets/fonts/Poppins/Poppins-Light.ttf'),
    "semibold": require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [loaded]);
  

  return ( 
      // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
            <MyStack />
        </QueryClientProvider>
      </PaperProvider>
    </Provider>
    // {/* </ThemeProvider> */}
  );
}

const MyStack = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const userData = useSelector(state=>state.auth.userData)
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser();
        setTimeout(() => {
          if (userData) {
            dispatch(login({ userData: userData.data }));
          } else {
            dispatch(logout());
          }
        }, 0);
      } catch (error) {
        setTimeout(() => dispatch(logout()), 0);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);
  

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (!isAuthenticated) {
          router.replace("/login");
        }
      }, 0);
    }
  }, [isAuthenticated, loading]);
  

  if (loading) return <Loader2 />;

  return (
    // <Slot />
    <SafeAreaProvider style={{ backgroundColor: '#FF7043' }}>
    <Stack 
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FF7043' }
      }}
    />
    </SafeAreaProvider>
);
};
