const fs = require('fs');
const path = './src/Screen/FilterScreen.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    /case '23': return \{ name: 'Cars for sale', icon: 'car-sport' \};/g,
    `case '23': return { name: t('mockCategories.carsForSale', 'Cars for sale'), icon: 'car-sport' };`
);
content = content.replace(
    /case '402': return \{ name: 'Mobile Phones', icon: 'phone-portrait' \};/g,
    `case '402': return { name: t('mockCategories.mobilePhones', 'Mobile Phones'), icon: 'phone-portrait' };`
);
content = content.replace(
    /case '1426': return \{ name: 'Apartments for sale', icon: 'business' \};/g,
    `case '1426': return { name: t('mockCategories.apartmentsForSale', 'Apartments for sale'), icon: 'business' };`
);
content = content.replace(
    /default: return \{ name: 'All Categories', icon: 'grid' \};/g,
    `default: return { name: t('mockCategories.allCategories', 'All Categories'), icon: 'grid' };`
);

content = content.replace(
    /placeholder="Min"/g,
    `placeholder={t('filter.min', 'Min')}`
);
content = content.replace(
    /placeholder="Max"/g,
    `placeholder={t('filter.max', 'Max')}`
);

fs.writeFileSync(path, content);
