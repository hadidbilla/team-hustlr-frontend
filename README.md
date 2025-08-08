# Team Hustlr Frontend - Product Card UI

A responsive e-commerce product listing page built with Nuxt 3, Vue 3, TypeScript, and Tailwind CSS.

## Features

### Product Card Component
- **Responsive Design**: Adapts to different screen sizes (mobile, tablet, desktop)
- **Product Image**: Displays product thumbnail with fallback handling
- **Product Information**: Title, brand, price, and discount percentage
- **Stock Status**: Visual indicators for in-stock, low stock, and out-of-stock items
- **Rating Display**: Shows product rating with star icon
- **Variant Selection**: Dropdown for size options (Small, Medium, Large)
- **Add to Cart**: Button that's disabled for out-of-stock items
- **Stock Information**: Shows current stock levels

### Shopping Cart
- **Cart Toggle**: Floating cart button with item count badge
- **Cart Sidebar**: Slide-out cart with item management
- **Quantity Controls**: Increase/decrease item quantities
- **Remove Items**: Remove items from cart
- **Total Calculation**: Real-time total price calculation
- **Checkout**: Placeholder for checkout functionality

### State Management
- **Pinia Stores**: Separate stores for products and cart
- **API Integration**: Uses axios for fetching data from DummyJSON API
- **Error Handling**: Comprehensive error states and loading indicators

## Technical Implementation

### Layout Approach
- **Mobile-First Design**: Responsive grid that adapts from 1 column on mobile to 5 columns on large screens
- **CSS Grid**: Uses Tailwind's responsive grid classes for optimal layout
- **Flexbox**: Used for component alignment and spacing
- **Card-Based Layout**: Each product is displayed in a clean, modern card format

### Responsiveness Considerations
- **Breakpoint System**: Uses Tailwind's responsive breakpoints (sm, md, lg, xl)
- **Flexible Grid**: Grid columns adjust based on screen size
- **Touch-Friendly**: Buttons and interactive elements sized for mobile use
- **Readable Text**: Font sizes and spacing optimized for all devices
- **Image Handling**: Responsive images with proper aspect ratios

### Component Architecture

```text
app/
├── components/
│   ├── ProductCard.vue      # Individual product card
│   ├── ProductGrid.vue      # Grid layout for products
│   └── Cart.vue            # Shopping cart component
├── stores/
│   ├── products.ts         # Product state management
│   └── cart.ts            # Cart state management
├── plugins/
│   └── axios.ts           # HTTP client configuration
└── pages/
    └── index.vue          # Main page layout
```

## API Integration

The application integrates with the [DummyJSON Products API](https://dummyjson.com/docs/products) to fetch real product data including:
- Product details (title, description, price, etc.)
- Stock information
- Product images
- Ratings and reviews
- Category information

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Key Features Demonstrated

1. **Real API Integration**: Fetches data from DummyJSON API
2. **State Management**: Uses Pinia for global state
3. **Responsive Design**: Works on all device sizes
4. **Error Handling**: Graceful error states and loading indicators
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Performance**: Optimized with lazy loading and efficient re-renders

## Design Decisions

- **Clean, Modern UI**: Simple color scheme with blue accent colors
- **Card-Based Layout**: Easy to scan and compare products
- **Visual Hierarchy**: Clear information hierarchy with proper typography
- **Interactive Feedback**: Hover states and transitions for better UX
- **Stock Management**: Clear visual indicators for product availability

The implementation demonstrates modern web development practices with a focus on user experience, performance, and maintainability.
# team-hustlr-frontend
