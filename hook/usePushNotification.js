import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";

import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification");
      return;
    }

    token = await Notifications.getExpoPushTokenAsync();
  } else {
    alert("Must be using a physical device for Push notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export const usePushNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState();

  const [notification, setNotification] = useState();

  const notificationListener = useRef;
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     console.log(response);
    //   });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );

      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
