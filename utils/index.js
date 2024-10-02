import Toast from "react-native-root-toast";

export const checkImageURL = (url) => {
  if (!url) return false;
  else {
    const pattern = new RegExp(
      "^https?:\\/\\/.+\\.(png|jpg|jpeg|bmp|gif|webp)$",
      "i"
    );
    return pattern.test(url);
  }
};

export const showToast = (message) => {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    containerStyle: {
      borderRadius: 9999999,
      padding: 10,
      margin: 10,
      paddingHorizontal: 20,
      backgroundColor: "white",
    },
    textStyle: { fontSize: 15, fontWeight: "400", color: "black" },
  });
};
