import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SIZES } from '../../../constants';
import { showToast } from '../../../utils';
import { fetchJobs } from '../../../utils/firebaseAuth';
import EmployerCard from '../../common/cards/employer/EmployerCard';
import styles from './employerjobs.style';

const EmployerJobs = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const loadJobs = async () => {
            setIsLoading(true);
            try {
                const jobsData = await fetchJobs();
                setJobs(jobsData);
            } catch (err) {
                setError(err.message);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Employer Jobs </Text>
                <TouchableOpacity onPress={() => showToast('Coming Soon')}>
                    <Text style={styles.headerBtn}>Show all</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.cardsContainer}>
                {isLoading ? (
                    <ActivityIndicator size='large' color={COLORS.primary} />
                ) : error ? (
                    <Text>{error}</Text>
                ) : (
                    <FlatList
                        data={jobs}
                        contentContainerStyle={{ columnGap: SIZES.medium }}
                        horizontal
                        keyExtractor={(item, index) => item.id.toString()}
                        renderItem={({ item }) => <EmployerCard job={item} />}
                    />
                )}
            </View>
        </View>
    );
};

export default EmployerJobs;