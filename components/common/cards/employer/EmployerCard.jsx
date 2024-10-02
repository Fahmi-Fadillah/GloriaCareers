import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Logo from '../../../../assets/logo.png';
import styles from './EmployerCard.style';
const EmployerCard = ({ job }) => {
    const router = useRouter();
    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            router.push(`/employer/${job.id}`);
        }
        }
        >
            <View style={styles.cardsContainer}>
                <TouchableOpacity style={styles.logoContainer}>
                    <Image
                        source={Logo}
                        style={styles.logoImage}
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <View>
                    <Text style={styles.companyName} numberOfLines={1}>
                        {job.companyName}
                    </Text>
                    <View style={styles.infoContainer}>
                        <Text style={styles.jobRole} numberOfLines={1}>
                            {job.jobRole}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default EmployerCard;