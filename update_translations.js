const fs = require('fs');

const enPath = './public/locales/en/translation.json';
const arPath = './public/locales/ar/translation.json';

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const ar = JSON.parse(fs.readFileSync(arPath, 'utf8'));

// Add missing keys to EN
if (!en.home) en.home = {};
en.home.allCategories = "All Categories";
en.home.seeAll = "See all";

if (!en.categories) en.categories = {};
en.categories.seeAllIn = "See all in {{name}}";

if (!en.filter) en.filter = {};
en.filter.min = "Min";
en.filter.max = "Max";

if (!en.mockCategories) en.mockCategories = {};
en.mockCategories.vehicles = "Vehicles";
en.mockCategories.properties = "Properties";
en.mockCategories.electronics = "Electronics";
en.mockCategories.jobs = "Jobs";
en.mockCategories.furniture = "Furniture";
en.mockCategories.mobiles = "Mobiles";
en.mockCategories.carsForSale = "Cars for sale";
en.mockCategories.mobilePhones = "Mobile Phones";
en.mockCategories.apartmentsForSale = "Apartments for sale";
en.mockCategories.allCategories = "All Categories";

en.search.placeholderLong = "Search for products, brands and more";

// Add missing keys to AR
if (!ar.home) ar.home = {};
ar.home.allCategories = "جميع الفئات";
ar.home.seeAll = "عرض الكل";

if (!ar.categories) ar.categories = {};
ar.categories.seeAllIn = "عرض الكل في {{name}}";

if (!ar.filter) ar.filter = {};
ar.filter.min = "الحد الأدنى";
ar.filter.max = "الحد الأقصى";

if (!ar.mockCategories) ar.mockCategories = {};
ar.mockCategories.vehicles = "المركبات";
ar.mockCategories.properties = "العقارات";
ar.mockCategories.electronics = "الإلكترونيات";
ar.mockCategories.jobs = "الوظائف";
ar.mockCategories.furniture = "الأثاث";
ar.mockCategories.mobiles = "الموبايلات";
ar.mockCategories.carsForSale = "سيارات للبيع";
ar.mockCategories.mobilePhones = "موبايلات";
ar.mockCategories.apartmentsForSale = "شقق للبيع";
ar.mockCategories.allCategories = "جميع الفئات";

ar.search.placeholderLong = "ابحث عن المنتجات، العلامات التجارية والمزيد";

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));
console.log("Translations updated");
