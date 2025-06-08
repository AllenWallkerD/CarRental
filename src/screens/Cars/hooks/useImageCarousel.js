import { useState, useCallback } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

export default function useImageCarousel(maxImages = 4) {
    const [images, setImages] = useState([])
    const [page, setPage] = useState(0)

    const pickImages = useCallback(async () => {
        const left = maxImages - images.length
        if (left === 0) {
            Alert.alert('You can upload up to 4 images')
            return
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: left,
            quality: 0.85,
        })
        if (!result.canceled) {
            setImages(prev => [...prev, ...result.assets.slice(0, left)])
        }
    }, [images])

    const removeImage = useCallback(idx => {
        setImages(prev => prev.filter((_, i) => i !== idx))
        setPage(prev => Math.min(prev, images.length - 2))
    }, [images])

    return { images, page, setPage, pickImages, removeImage }
}
