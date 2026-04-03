# OLX Lebanon Assessment

A React Native CLI application implementing advanced listing search and dynamic category filtration functionalities to mirror OLX Lebanon's specific use cases and API architecture.

## Overview

This project was built under strict assessment constraints to deliver a highly robust, scalable, and cross-platform mobile experience. It avoids third-party UI utility libraries (like Tailwind or MaterialUI) in favor of high-performance, strictly-typed standard React Native `StyleSheet` architectures.

## Key Features

- **Dynamic Elasticsearch Filtering:** Fetches raw category fields (`/api/categoryFields`) and automagically parses them into native React Native inputs (Sliders, TextInputs, Pills, and Multiselect Modals). The application parses those selections directly into Elasticsearch queries using exact `must`, `filter`, and `range` conditions mimicking the actual generic API endpoints.
- **RTL & Localization:** Built ground-up for English and Arabic. Utilizes `react-i18next` deeply to handle platform-specific layout RTL fixes natively (including custom padding/alignment patches exclusively for iOS devices).
- **Modular Architecture:** Organized logically following "Atomic Design" principles with cleanly separated components (`/atoms`, `/molecules`, `/organisms`), custom hooks, screens, and API services.
- **Type Safety:** Uses strict TypeScript configurations across the codebase for resilient integrations with volatile data types, such as the `_msearch` payloads.
- **Performance Focused:** Uses native `FlatList` and `Modal` components intentionally mapped for optimal memory utilization when handling very long lists, like "Car Models" or "Mobile Brands".

## Core Dependencies
- React Native CLI (No Expo toolchains)
- TypeScript
- `react-i18next` (i18n / Localization)
- `@react-navigation/native`
- `react-native-vector-icons`

## API Integration Strategy

The app utilizes two main endpoints:
- `https://www.olx.com.lb/api/` for fetching standard configurations, translation mappings, and category fields.
- `https://search.mena.sector.run/_msearch` for querying the Elasticsearch cluster directly. Parameters evaluate dynamic backend requirements heavily—for instance, appropriately detecting if `.price` is requested for a vehicle vs an apartment payload and directing it to `extraFields.price`.

## Setup & Installation

### Android
```bash
yarn install
yarn run android
```

### iOS
Requires macOS with Xcode installed.
```bash
yarn install
cd ios && bundle install && bundle exec pod install && cd ..
yarn run ios
```

## Structure
```
/src
  /api          # Axios clients and base endpoint constants
  /components   # Atomic components (atoms, molecules, organisms)
  /hooks        # Reusable standard hooks
  /Navigation   # React Navigation stacks and tab logic
  /Screen       # Core application screens (Search, Filter, Account, etc.)
  /services     # API handlers mapping DTOs to business logic
  /validation   # Zod / TS Interfaces and schemas
```
