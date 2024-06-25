import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Tabs, SplashScreen, router } from 'expo-router'; // Adjust imports as necessary
import Icons from '@/components/Icons';
import Colors from '@/components/Colors';
import { FIREBASE_AUTH } from '@/js/firebase';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null); // Initialize user state as null
  const [isNavigating, setIsNavigating] = useState(false); // State to track navigation

  useEffect(() => {
    const subscriber = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Clean up subscription
    return () => subscriber();
  }, []);

  // Effect to return to the landing page if user is not signed in.
  useEffect(() => {
    if (!initializing) {
      if (!user) {
        setIsNavigating(true); // Trigger navigation if user is not signed in
        router.navigate('landing'); // Navigate to landing page
      } else {
        setIsNavigating(false); // Reset navigation state if user is signed in
      }
    }
  }, [user, initializing]);

  // Loading screen while initializing or navigating
  if (initializing || isNavigating) return null;

  // Render tabs if user is signed in
  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.back} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            paddingTop: Platform.OS === 'android' ? 15 : 0,
            borderTopWidth: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: Colors.tabbar,
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontSize: 8,
            fontWeight: "bold",
            marginBottom: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Icons.Ionicons
                name={focused ? 'home' : 'home-outline'}
                color={focused ? Colors.accent : Colors.textlight}
                size={focused ? 28 : 20}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="garage"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Icons.MaterialCommunityIcons
                name={focused ? 'garage-open-variant' : 'garage-variant'}
                color={focused ? Colors.accent : Colors.textlight}
                size={focused ? 34 : 26}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Icons.Ionicons
                name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
                color={focused ? Colors.accent : Colors.textlight}
                size={focused ? 28 : 20}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <Icons.Ionicons
                name={focused ? 'settings-sharp' : 'settings-outline'}
                color={focused ? Colors.accent : Colors.textlight}
                size={focused ? 28 : 20}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
