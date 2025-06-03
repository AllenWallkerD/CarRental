import React from 'react';
import {
    Modal,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChoiceModal({
                                        visible,
                                        title,
                                        data,
                                        search,
                                        setSearch,
                                        onSelect,
                                        onClose,
                                    }) {
    const filtered = data.filter((d) =>
        d.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalWrap}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modal}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{title}</Text>
                                <TouchableOpacity onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#1E2B3B" />
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                placeholder="Search…"
                                value={search}
                                onChangeText={setSearch}
                                style={styles.searchInput}
                            />
                            <FlatList
                                data={filtered}
                                keyExtractor={(i) => i}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.item}
                                        onPress={() => onSelect(item)}
                                    >
                                        <Text style={styles.itemTxt}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                                ListFooterComponent={<View style={{ height: 24 }} />}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalWrap: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modal: {
        height: '80%',
        backgroundColor: '#FFF',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E2B3B',
    },
    searchInput: {
        backgroundColor: '#F0F3F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 20,
        marginBottom: 8,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    itemTxt: {
        fontSize: 16,
        color: '#1E2B3B',
    },
});
