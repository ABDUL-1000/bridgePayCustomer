# MainLayout Component Documentation

## Overview

The `MainLayout` component serves as the primary layout wrapper for the Bridgepay Customer application. It provides the core structure for the application's user interface, including navigation, headers, and responsive design elements.

## File Location

`components/main/layout/MainLayout.tsx`

## Component Type

React Functional Component with TypeScript

## Props

```typescript
interface ChildrenProps {
  children: React.ReactNode;
}
```

## Dependencies

- React
- Next.js
- Redux Toolkit
- Framer Motion
- Tailwind CSS
- Custom hooks and components

## Key Features

### 1. Navigation Structure

- Implements a responsive sidebar navigation
- Includes bottom navigation for mobile devices
- Handles dynamic navigation state based on current route

### 2. Layout Management

- Responsive design with different layouts for desktop and mobile
- Conditional rendering based on page type (settings, cards, calculator)
- Smooth transitions and animations using Framer Motion

### 3. State Management

- Integrates with Redux for global state management
- Manages sidebar display state
- Handles page loading states

### 4. Navigation Items

```typescript
const nav: ISideBarNavigation[] = [
  {
    id: 0,
    icon: sideBarMenuHomeImg,
    activeIcon: sideBarMenuHomeActiveImg,
    href: "/",
    title: "Home",
    label: "home",
  },
  // ... other navigation items
];
```

## Component Structure

### Main Sections

1. **Navigation Sidebar**

   - Responsive sidebar with logo
   - Navigation menu items
   - Conditional display based on viewport

2. **Main Content Area**

   - Header component
   - Notifications system
   - Profile dropdown
   - Dynamic content area
   - Bottom navigation (mobile)

3. **Notifications**
   - System notifications
   - Downtime notifications
   - Transfer dialog

## Responsive Behavior

- Desktop: Full sidebar navigation
- Mobile: Bottom navigation with collapsible sidebar
- Adaptive padding and spacing
- Conditional rendering of UI elements

## State Management

- Uses Redux for global state
- Manages:
  - Page loading states
  - Navigation states
  - UI preferences
  - User profile data

## Styling

- Uses Tailwind CSS for styling
- Implements responsive classes
- Conditional styling based on:
  - Current route
  - Viewport size
  - User preferences

## Performance Considerations

- Implements loading states
- Uses motion for smooth transitions
- Conditional rendering of heavy components
- Efficient state management

## Usage Example

```tsx
<MainLayout>
  <YourPageContent />
</MainLayout>
```

## Related Components

- `Header`
- `NavigationSideBar`
- `BottomNavigation`
- `Notifications`
- `ProfileDropdown`
- `TransferDialog`

## Notes

- Component is client-side rendered ("use client")
- Implements responsive design patterns
- Handles multiple view states
- Integrates with global state management
