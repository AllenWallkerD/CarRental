import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapPicker({
                                      region,
                                      onRegionChange,
                                      marker,
                                      onPick,
                                  }) {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={onRegionChange}
                onPress={e => onPick(e.nativeEvent.coordinate)}
            >
                {marker && <Marker coordinate={marker} />}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    map: {
        flex: 1,
    },
});
