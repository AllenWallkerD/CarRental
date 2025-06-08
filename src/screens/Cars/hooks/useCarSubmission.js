import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import { addCar } from '../../../api/CarRental'

export default function useCarSubmission({ userId, formValues, marker, images, onSuccess }) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const clearError = useCallback(field => {
        setErrors(prev => ({ ...prev, [field]: null }))
    }, [])

    const saveCar = useCallback(async () => {
        const { brand, model, year, color, pricePerDay, country, city, description } = formValues
        if (!brand || !model || !year || !color || !pricePerDay || !country || !city) {
            Alert.alert('Fill all required fields')
            return
        }
        if (!marker) {
            Alert.alert('Please pick a location on the map')
            return
        }
        if (!userId) {
            Alert.alert('Error', 'User ID not available')
            return
        }
        try {
            setLoading(true)
            const data = new FormData()
            data.append('brand', brand)
            data.append('model', model)
            data.append('year', year)
            data.append('color', color)
            data.append('pricePerDay', pricePerDay)
            data.append('country', country)
            data.append('city', city)
            data.append('latitude', marker.latitude.toString())
            data.append('longitude', marker.longitude.toString())
            data.append('description', description)
            images.forEach((img, i) =>
                data.append('images', {
                    uri: img.uri,
                    name: `car_${i}.jpg`,
                    type: 'image/jpeg',
                })
            )
            await addCar(userId, data)
            onSuccess()
        } catch (err) {
            if (err.response?.data) {
                setErrors({ year: err.response.data })
            } else {
                Alert.alert('Error', 'Unable to save car')
            }
        } finally {
            setLoading(false)
        }
    }, [userId, formValues, marker, images, onSuccess])

    return { loading, errors, saveCar, clearError }
}
