# Claude Development Context: OLX Lebanon Assessment

## Core Constraints
- **Framework:** React Native CLI (No Expo).
- **Language:** TypeScript (Strict mode).
- **Styling:** Standard `StyleSheet` only. **DO NOT** use Tailwind, MaterialUI, or any UI utility libraries.
- **i18n:** Support English and Arabic (RTL). Use `react-i18next`.

## Project Architecture
- Use a modular folder structure: `/src/components`, `/src/screens`, `/src/services`, `/src/hooks`, `/src/utils`.
- Follow "Atomic Design" for components to ensure reusability.
- Use Custom Hooks for API logic to keep UI components lean.

## API Integration Strategy
- **Base URLs:** `https://www.olx.com.lb/api/` and `https://search.mena.sector.run/_msearch`.
- **Logic:** When I ask to build features, prioritize handling the `_msearch` payload structure and mapping dynamic `categoryFields` to UI inputs.
- **Generic Code:** Write components that are highly reusable. For example, a generic `FormField` that can handle text, numbers, or dropdowns based on API metadata.

## AI Instructions
1. Be extremely concise in code explanations.
2. Ensure all styles use `marginStart/End` instead of `Left/Right` for RTL compatibility.
3. Focus on "Large-scale project" quality: clean interfaces and error handling.