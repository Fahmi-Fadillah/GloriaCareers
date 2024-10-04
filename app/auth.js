import { Formik } from "formik";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import AppTextInput from "../components/AppTextInput";
import ErrorMessage from "../components/ErrorMessage";

import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/logo.png";
import AppButton from "../components/AppButton";
import { COLORS } from "../constants";
import { usePushNotifications } from "../hook/usePushNotification";
import { globalStyles } from "../styles/styles";
import {
  handleEmployerSignUp,
  handleSignIn,
  handleUserSignUp,
  savePushToken,
} from "../utils/firebaseAuth";
import { auth } from "./firebase";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  companyName: Yup.string().when("isEmployer", {
    is: true,
    then: Yup.string().required().label("Company Name"),
  }),
  companyLocation: Yup.string().when("isEmployer", {
    is: true,
    then: Yup.string().required().label("Company Location"),
  }),
  name: Yup.string().when("isEmployer", {
    is: false,
    then: Yup.string().required().label("Name"),
  }),
});

export default function SignInScreen() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { expoPushToken } = usePushNotifications();
  const onSignIn = async (email, password) => {
    setLoading(true);
    try {
      const { userType, userData } = await handleSignIn(email, password);
      if (userType === "employer") {
        router.replace("employer/employerHome");
      } else {
        if (expoPushToken) {
          await savePushToken(auth.currentUser.uid, expoPushToken.data);
        }
        router.replace("home");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (values) => {
    setLoading(true);
    try {
      if (isEmployer) {
        await handleEmployerSignUp(
          values.email,
          values.password,
          values.companyName,
          values.companyLocation
        );
        router.replace("employer/employerHome");
      } else {
        await handleUserSignUp(values.email, values.password, values.name);
        await savePushToken(auth.currentUser.uid, expoPushToken.data);
      }
      router.replace("home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.containerStyle}>
      <ScrollView contentContainerStyle={globalStyles.scrollViewContent}>
        <Image style={styles.logoImg} resizeMode="contain" source={Logo} />
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              isEmployer && styles.activeUserTypeButton,
            ]}
            onPress={() => setIsEmployer(true)}
          >
            <Text
              style={[
                styles.userTypeText,
                isEmployer && styles.activeUserTypeText,
              ]}
            >
              Employer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              !isEmployer && styles.activeUserTypeButton,
            ]}
            onPress={() => setIsEmployer(false)}
          >
            <Text
              style={[
                styles.userTypeText,
                !isEmployer && styles.activeUserTypeText,
              ]}
            >
              Job Seeker
            </Text>
          </TouchableOpacity>
        </View>

        <Formik
          initialValues={{
            email: "",
            password: "",
            name: "",
            companyName: "",
            companyLocation: "",
          }}
          onSubmit={(values, actions) => {
            try {
              isSignUpMode
                ? onSignUp(values)
                : onSignIn(values.email, values.password);
              actions.resetForm();
            } catch (e) {
              console.log(e);
            }
          }}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleSubmit,
            errors,
            values,
            setFieldTouched,
            touched,
          }) => (
            <>
              <AppTextInput
                iconName={"mail-outline"}
                placeholder={"Enter your Email"}
                textContentType={"emailAddress"}
                onChangeText={handleChange("email")}
                onBlur={() => setFieldTouched("email")}
                value={values.email}
                autoCapitalize={"none"}
                accessibilityLabel="email"
                keyboardType="email-address"
              />
              <ErrorMessage visible={touched.email} error={errors.email} />
              <AppTextInput
                iconName={"lock-closed-outline"}
                placeholder={"Enter your Password"}
                textContentType={"password"}
                onChangeText={handleChange("password")}
                onBlur={() => setFieldTouched("password")}
                value={values.password}
                secureTextEntry
                autoCapitalize={"none"}
                accessibilityLabel="password"
              />
              <ErrorMessage
                error={errors.password}
                visible={touched.password}
              />
              {isEmployer && isSignUpMode && (
                <>
                  <AppTextInput
                    iconName={"business-outline"}
                    placeholder={"Enter your Company Name"}
                    onChangeText={handleChange("companyName")}
                    onBlur={() => setFieldTouched("companyName")}
                    value={values.companyName}
                    autoCapitalize={"none"}
                  />
                  <ErrorMessage
                    error={errors.companyName}
                    visible={touched.companyName}
                  />
                  <AppTextInput
                    iconName={"location-outline"}
                    placeholder={"Enter your Company Location"}
                    onChangeText={handleChange("companyLocation")}
                    onBlur={() => setFieldTouched("companyLocation")}
                    value={values.companyLocation}
                    autoCapitalize={"none"}
                    accessibilityLabel="Location"
                  />
                  <ErrorMessage
                    error={errors.companyLocation}
                    visible={touched.companyLocation}
                  />
                </>
              )}
              {!isEmployer && isSignUpMode && (
                <>
                  <AppTextInput
                    iconName={"person-outline"}
                    placeholder={"Enter your Name"}
                    onChangeText={handleChange("name")}
                    onBlur={() => setFieldTouched("name")}
                    value={values.name}
                    autoCapitalize={"true"}
                    accessibilityLabel="name"
                  />
                  <ErrorMessage error={errors.name} visible={touched.name} />
                </>
              )}
              <AppButton
                title={isSignUpMode ? "Sign Up" : "Sign in"}
                onPress={handleSubmit}
                loading={loading}
              />
              <TouchableOpacity
                style={styles.inlineText}
                onPress={() => setIsSignUpMode(!isSignUpMode)}
              >
                <Text style={styles.switchText2}>
                  {isSignUpMode ? "Already registered? " : "Not registered? "}
                </Text>
                <Text style={styles.switchText}>
                  {isSignUpMode ? " Sign in instead" : " Sign up instead"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  userTypeButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  activeUserTypeButton: {
    backgroundColor: COLORS.primary,
  },
  activeUserTypeText: {
    color: COLORS.white,
  },
  userTypeText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  logoImg: {
    width: 250,
    height: 250,
    alignSelf: "center",
  },
  inlineText: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  empText: {
    textAlign: "center",
    fontSize: 20,
  },
  switchText: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  switchText2: {
    color: "black",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
});
