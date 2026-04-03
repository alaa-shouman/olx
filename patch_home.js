const fs = require('fs');
const path = './src/Screen/Tabs/HomeScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the fallback categories logic inside loadHomeData to translate them
content = content.replace(
    /const FALLBACK_CATEGORIES: CategoryData\[\] = \[\s+\{ id: '1', name: 'Vehicles', icon: 'car-sport-outline' \},\s+\{ id: '16', name: 'Properties', icon: 'business-outline' \},\s+\{ id: '4', name: 'Electronics', icon: 'laptop-outline' \},\s+\{ id: '7', name: 'Jobs', icon: 'briefcase-outline' \},\s+\{ id: '6', name: 'Furniture', icon: 'bed-outline' \},\s+\{ id: '402', name: 'Mobiles', icon: 'phone-portrait-outline' \},\s+\];/g,
    `const FALLBACK_CATEGORIES_KEYS: any[] = [
    { id: '1', nameKey: 'mockCategories.vehicles', icon: 'car-sport-outline' },
    { id: '16', nameKey: 'mockCategories.properties', icon: 'business-outline' },
    { id: '4', nameKey: 'mockCategories.electronics', icon: 'laptop-outline' },
    { id: '7', nameKey: 'mockCategories.jobs', icon: 'briefcase-outline' },
    { id: '6', nameKey: 'mockCategories.furniture', icon: 'bed-outline' },
    { id: '402', nameKey: 'mockCategories.mobiles', icon: 'phone-portrait-outline' },
];`
);

content = content.replace(
    /const \[categories, setCategories\] = useState<CategoryData\[\]>\(FALLBACK_CATEGORIES\);/g,
    `const [categories, setCategories] = useState<CategoryData[]>([]);`
);

// We need to inject the translation of fallback categories at the start of loadHomeData
content = content.replace(
    /const categoriesToFetch = \(topCategories && topCategories\.length > 0\)\n\s+\? topCategories\n\s+: FALLBACK_CATEGORIES;/g,
    `const fallbackCategories = FALLBACK_CATEGORIES_KEYS.map(c => ({ id: c.id, name: t(c.nameKey), icon: c.icon }));
            const categoriesToFetch = (topCategories && topCategories.length > 0)
                ? topCategories
                : fallbackCategories;
            
            if (!topCategories || topCategories.length === 0) {
                setCategories(fallbackCategories);
            }`
);

fs.writeFileSync(path, content);
