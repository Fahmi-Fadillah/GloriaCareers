import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { icons, SIZES } from "../../../constants";
import { fetchUserName } from "../../../utils/firebaseAuth";
import styles from "./welcome.style";

const jobTypes = ["Full-time", "Part-time", "Remote"];

const Welcome = ({ searchTerm, setSearchTerm, handleClick }) => {
  const router = useRouter();
  const [activeJobType, setActiveJobType] = useState("Full-time");
  const [userName, setUserName] = useState("User");
  const [userType, setUserType] = useState("");
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { userName, userType } = await fetchUserName();
        setUserName(userName);
        setUserType(userType);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    getUserData();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.userName}>Hello {userName}</Text>
        <Text style={styles.welcomeMessage}>{userType === "employer" ? "Post a Job Opportunity" : "Find your perfect job"}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            placeholder='What are you looking for?'
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleClick}>
          <Image
            source={icons.search}
            resizeMode='contain'
            style={styles.searchBtnImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          data={jobTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(activeJobType, item)}
              onPress={() => {
                setActiveJobType(item);
                if (item === "Remote") {
                  router.push(`/search/${item}?remote_jobs_only=true`);
                }
                else {
                  router.push(`/search/${item} India`);
                }
              }}
            >
              <Text style={styles.tabText(activeJobType, item)}>{item}</Text>
            </TouchableOpacity>
            // /------------------------------------------

          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
        />
      </View>
    </View>
  );
};

export default Welcome;
