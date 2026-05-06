# DashboardView Component Documentation

## Overview

The `DashboardView` component serves as the main dashboard interface for the Bridgepay Customer application. It provides a comprehensive view of the user's financial information, including wallet details, quick actions, and recent transactions.

## File Location

`components/main/home/DashboardView.tsx`

## Component Type

React Functional Component

## Dependencies

- Custom dashboard modules
- Shared components
- Data from settings components

## Component Structure

### Main Sections

1. **Wallet Information**

   - `DashboardWalletCard` - Desktop wallet view
   - `DashboardMobileWallet` - Mobile-optimized wallet view

2. **Quick Actions**

   - Desktop: Horizontal scrollable list of action cards
   - Mobile: Carousel of action cards
   - Uses `dashboardNakedCardList` data

3. **Recent Transactions**
   - `RecentTransactionsCard` component
   - Displays latest transaction history

## Responsive Design

### Desktop View

- Full-width layout
- Horizontal scrollable quick actions
- Standard wallet card display

### Mobile View

- Stacked layout
- Mobile-optimized wallet display
- Carousel for quick actions
- "Quick Actions" section title

## Child Components

1. **DashboardNakedCard**

   - Individual quick action card
   - Used in desktop view

2. **DashboardWalletCard**

   - Desktop wallet information display
   - Comprehensive financial overview

3. **DashboardMobileWallet**

   - Mobile-optimized wallet display
   - Simplified financial information

4. **RecentTransactionsCard**

   - Transaction history display
   - Recent activity overview

5. **NakedCardMobileCarousel**
   - Mobile carousel for quick actions
   - Touch-friendly interface

## Styling

- Uses Tailwind CSS
- Responsive classes for different viewports
- Gap management between components
- Scroll behavior for desktop quick actions

## Data Flow

- Uses `dashboardNakedCardList` from settings components
- Maps through card list to render quick actions
- Props passed to child components

## Usage Example

```tsx
<DashboardView />
```

## Related Components

- `DashboardNakedCard`
- `DashboardWalletCard`
- `DashboardMobileWallet`
- `RecentTransactionsCard`
- `NakedCardMobileCarousel`
- `ParagraphLg` (shared text component)

## Notes

- Implements responsive design patterns
- Uses conditional rendering for mobile/desktop views
- Integrates multiple dashboard modules
- Provides comprehensive financial overview
