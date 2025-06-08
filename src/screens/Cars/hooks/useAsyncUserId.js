import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function useAsyncUserId(initialId) {
    const [userId, setUserId] = useState(initialId || null)
    useEffect(() => {
        if (!userId) {
            AsyncStorage.getItem('userId').then(setUserId)
        }
    }, [])
    return userId
}
