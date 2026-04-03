import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getCategories } from "../services/categories";

const CategoryListScreen = ({ navigation, route }: any) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const parentCategory = route.params?.category;

    const [children, setChildren] = useState<any[]>(parentCategory?.children || []);
    const [loading, setLoading] = useState(!parentCategory?.children);

    useEffect(() => {
        if (!parentCategory || !children.length) {
            fetchCategories();
        }
    }, [parentCategory]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res: any = await getCategories();
            const categoriesArray = Array.isArray(res) ? res : (res.data || []);

            if (!parentCategory) {
                const rootCats = categoriesArray.filter((c: any) => !c.parent_id) || [];
                setChildren(rootCats);
            } else {
                const findCategory = (cats: any[], id: string): any => {
                    for (const c of cats) {
                        if (String(c.id) === id) return c;
                        if (c.children) {
                            const found = findCategory(c.children, id);
                            if (found) return found;
                        }
                    }
                    return null;
                };

                const found = findCategory(categoriesArray, String(parentCategory.id));
                setChildren(found?.children || []);
            }
        } catch (e) {
            console.log("Error checking subcategories:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (category: any) => {
        if (category.children && category.children.length > 0) {
            navigation.push("CategoryListScreen", { category });
        } else {
            navigation.navigate("SearchScreen", {
                categoryId: String(category.id),
                categoryName: category.name
            });
        }
    };

    const parentName = parentCategory
        ? parentCategory.name
        : t("home.allCategories", "All Categories");

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name={isArabic ? "arrow-forward" : "arrow-back"} size={28} color="#212121" />
                </TouchableOpacity>
                <Text style={styles.title}>{parentName}</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#00BCD4" />
                </View>
            ) : (
                <FlatList
                    data={children}
                    keyExtractor={(item) => String(item.id)}
                    ListHeaderComponent={() => (
                        <TouchableOpacity
                            style={styles.seeAllBtn}
                            onPress={() => navigation.navigate("SearchScreen", {
                                categoryId: parentCategory ? String(parentCategory.id) : null,
                                categoryName: parentName
                            })}
                        >
                            <Text style={styles.seeAllText}>
                                {t('categories.seeAllIn', { name: parentName })}
                            </Text>
                        </TouchableOpacity>
                    )}
                    renderItem={({ item }) => {
                        const name = item.name; // The API returns the localized name in 'name' based on Accept-Language
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <TouchableOpacity style={styles.item} onPress={() => handleCategoryPress(item)}>
                                <Text style={styles.itemText}>{name}</Text>
                                {hasChildren && (
                                    <Ionicons name={isArabic ? "chevron-back" : "chevron-forward"} size={20} color="#212121" />
                                )}
                            </TouchableOpacity>
                        );
                    }}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: "#EEEEEE",
    },
    backBtn: { padding: 4, marginStart: -4 },
    title: { fontSize: 18, fontWeight: "bold", color: "#212121" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },

    seeAllBtn: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "#EEEEEE",
    },
    seeAllText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#00BCD4",
    },

    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    itemText: {
        fontSize: 16,
        color: "#424242",
    },
    separator: {
        height: 1,
        backgroundColor: "#FAFAFA",
        marginHorizontal: 16,
    }
});

export default CategoryListScreen;