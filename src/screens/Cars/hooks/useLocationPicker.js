import { useState, useEffect, useCallback } from 'react'
import * as Location from 'expo-location'

export default function useLocationPicker(defaultRegion) {
    const [region, setRegion] = useState(defaultRegion)
    const [marker, setMarker] = useState(null)

    useEffect(() => {
        ;(async () => {
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync()
                setRegion(r => ({
                    ...r,
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                }))
            }
        })()
    }, [])

    const pickLocation = useCallback(coord => {
        setMarker(coord)
    }, [])

    return { region, marker, setRegion, pickLocation }
}
