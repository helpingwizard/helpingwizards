# ReWear - Community Clothing Exchange Platform

ReWear is a modern, responsive web application that promotes sustainable fashion through a community-driven clothing exchange platform. Built with React, TypeScript, and Tailwind CSS, it encourages users to swap, share, and save the planet one clothing item at a time.

## 🌱 Features

### Core Functionality
- **Item Listing**: Multi-step form for listing clothing items with photos, descriptions, and details
- **Browse & Search**: Advanced filtering and search capabilities with category, size, condition, and location filters
- **Swap System**: Points-based trading system with direct swap requests between users
- **User Profiles**: Comprehensive user profiles with activity history, reviews, and impact metrics
- **Community Features**: User following, ratings, and messaging system
- **Sustainability Tracking**: Environmental impact visualization with CO2 and water savings

### Pages Included
1. **Landing Page**: Hero section, value propositions, featured items, and impact statistics
2. **Dashboard**: Personalized user dashboard with stats, listed items, and pending requests
3. **Browse Items**: Filterable item catalog with grid/list view options
4. **Item Detail**: Detailed item view with image gallery, owner info, and swap functionality
5. **Add Item**: Multi-step form for listing new items with validation
6. **User Profile**: User profiles with tabs for items, history, reviews, and achievements

### Design & UX
- **Modern Design**: Clean, eco-friendly design with green color scheme
- **Mobile-First**: Fully responsive design that works on all devices
- **Intuitive Navigation**: Easy-to-use interface with clear call-to-actions
- **Loading States**: Skeleton loaders and empty states for better UX
- **Interactive Elements**: Hover effects, smooth transitions, and animated components

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom green/eco theme
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router DOM for navigation
- **State Management**: React Context API with useReducer
- **Build Tool**: Vite for fast development and building
- **Development**: ESLint for code quality

## 📁 Project Structure

```
Frontend/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── EmptyState.tsx   # Empty state component
│   │   ├── Footer.tsx       # Site footer
│   │   ├── ItemCard.tsx     # Item display card
│   │   ├── LoadingSpinner.tsx # Loading component
│   │   ├── Modal.tsx        # Modal component
│   │   └── Navbar.tsx       # Navigation bar
│   ├── context/             # React Context for state management
│   │   └── AppContext.tsx   # Main app context and types
│   ├── data/               # Sample data and constants
│   │   └── sampleData.ts   # Mock data for development
│   ├── pages/              # Main page components
│   │   ├── AddItem.tsx     # Multi-step item listing form
│   │   ├── BrowseItems.tsx # Item browsing and filtering
│   │   ├── Dashboard.tsx   # User dashboard
│   │   ├── ItemDetail.tsx  # Individual item view
│   │   ├── LandingPage.tsx # Homepage
│   │   └── UserProfile.tsx # User profile pages
│   ├── App.tsx             # Main app component with routing
│   ├── index.css           # Global styles and Tailwind
│   └── main.tsx            # React app entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
- **Primary**: Green shades (#22c55e, #16a34a, #15803d)
- **Emerald**: Complementary green tones (#10b981, #059669, #047857)
- **Teal**: Accent colors (#14b8a6, #0d9488, #0f766e)
- **Neutrals**: Gray scale for text and backgrounds

### Components
- **Buttons**: Primary, secondary, and ghost variants
- **Cards**: Consistent shadow and border styling
- **Forms**: Input fields with focus states and validation
- **Icons**: Lucide React icons throughout

### Typography
- **Font**: Inter for clean, modern readability
- **Hierarchy**: Consistent heading and body text scales

## 🌍 Sustainability Features

ReWear emphasizes environmental impact through:

- **CO2 Tracking**: Calculate carbon footprint savings from each swap
- **Water Conservation**: Track water saved by extending clothing lifecycle
- **Waste Reduction**: Items diverted from landfills
- **Achievement System**: Gamified sustainability milestones
- **Impact Visualization**: User dashboards show environmental contributions

## 📱 Key Components

### ItemCard
Reusable component for displaying clothing items with:
- Image with condition badge
- Title, category, and size
- Points value and location
- Owner information and rating
- Favorite functionality

### Multi-step Form
Progressive item listing form with:
- Photo upload with drag & drop
- Form validation at each step
- Progress indicator
- Preview before submission

### Search & Filters
Advanced filtering system with:
- Text search across titles, descriptions, and tags
- Category, size, and condition filters
- Location-based filtering
- Sort options (newest, price, etc.)

## 🔧 Customization

### Adding New Categories
Update the `categories` array in `src/data/sampleData.ts`:

```typescript
export const categories = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories',
  'Your New Category'  // Add here
];
```

### Modifying Color Theme
Update the Tailwind config in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color scale
      }
    }
  }
}
```

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Navbar.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- React and the React ecosystem for the robust foundation
- Tailwind CSS for the utility-first styling approach
- Lucide React for the beautiful icon library
- Unsplash for placeholder images
- The sustainable fashion community for inspiration

---

**Built with 💚 for a more sustainable future** 