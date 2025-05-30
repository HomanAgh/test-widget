# Elite Prospects Widget System

A comprehensive Next.js application for creating embeddable hockey statistics widgets.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📊 Available Widget Types

- **Player Widget** - Player statistics and game logs
- **Team Widget** - Team information and roster
- **League Widget** - League standings and information
- **Scoring Leaders** - Top scorers for a league/season
- **Goalie Leaders** - Top goalies for a league/season
- **Alumni Widget** - Alumni from specific teams/tournaments
- **Tournament Widget** - Tournament participants and statistics

## 🎯 Creating New Widgets

Using the Alumni widget as an example, here's the complete workflow:

### Step 1: Create API Route

Create API route in `app/api/my-new-widget/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const param = searchParams.get("param");
  
  try {
    // Your API logic here - similar to tournament-alumni route
    const data = await fetchDataFromExternalAPI(param);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
```

### Step 2: Create Page Component

Create page in `app/(pages)/my-new-widget/page.tsx`:

```typescript
import React from "react";
import MyNewWidgetSetup from "@/app/components/widget/MyNewWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

const MyNewWidgetPage = () => {
  return (
    <PageWrapper>
      <div>
        <Header currentPath="/my-new-widget" />
        <PageTitle title="My New Widget" />
        <MyNewWidgetSetup />
      </div>
    </PageWrapper>
  );
};

export default MyNewWidgetPage;
```

### Step 3: Create Head Component

Create head component in `app/components/my-new-widget/MyNewWidget.tsx` (like `Alumni.tsx`):

- **State Management**: Handle active tabs, search query, filters
- **Data Fetching**: Use custom hooks (like `useFetchPlayers`)
- **Search Functionality**: Implement search with magnifying glass icon
- **Tab System**: Men's/Women's leagues or other categorization
- **Props Interface**: Define all customization options (colors, settings)
- **Data Processing**: Filter and transform data before passing to table

Key features to include:
```typescript
const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");
const [searchQuery, setSearchQuery] = useState("");
const [resetPagination, setResetPagination] = useState(Date.now());

// Custom hook for data fetching
const { results, loading, error } = useFetchMyWidgetData(params);

// Search and filtering logic
const filteredData = useMemo(() => {
  // Apply filters similar to Alumni component
}, [results, activeGenderTab, otherFilters]);
```

### Step 4: Create Table Component

Create table component in `app/components/my-new-widget/MyNewWidgetTable.tsx` (like `PlayerTable.tsx`):

- **Sorting System**: Column sorting with arrow indicators
- **Pagination**: Optional pagination controls
- **League Grouping**: Optional grouping by league categories
- **Column Configuration**: Conditional column rendering
- **Custom Styling**: Support for custom colors and themes
- **Data Display**: Properly formatted data cells with tooltips

Key features:
```typescript
interface MyNewWidgetTableProps {
  data: MyWidgetData[];
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  isPaginationEnabled?: boolean;
  isLeagueGroupingEnabled?: boolean;
  selectedColumns?: ColumnOptions;
}
```

### Step 5: Widget Setup Component

Create setup component in `app/components/widget/MyNewWidgetSetup.tsx` (like `AlumniWidgetSetup.tsx`):

- **Filter Controls**: Dropdowns, checkboxes, multi-selects
- **Settings Panel**: Pagination, grouping, column options
- **Color Customization**: Background, text, table colors
- **Live Preview**: Real-time widget preview
- **Export Options**: Generate embed code

### Step 6: Create Embed Route

Create embed route in `app/(pages)/embed/my-new-widget/page.tsx`:

```typescript
import React from "react";
import MyNewWidget from "@/app/components/my-new-widget/MyNewWidget";
import ClientWrapper from "@/app/components/iframe/IframeClientWrapper";

interface PageProps {
  searchParams: Promise<{
    // Define all your widget parameters
    param1?: string;
    backgroundColor?: string;
    textColor?: string;
    tableBackgroundColor?: string;
    headerTextColor?: string;
    nameTextColor?: string;
    isPaginationEnabled?: string;
    isLeagueGroupingEnabled?: string;
  }>;
}

export default async function MyNewWidgetEmbed({ searchParams }: PageProps) {
  const params = await searchParams;
  
  return (
    <ClientWrapper>
      <MyNewWidget
        // Parse and pass all parameters
        param1={params.param1}
        customColors={{
          backgroundColor: params.backgroundColor || "#052D41",
          textColor: params.textColor || "#000000",
          tableBackgroundColor: params.tableBackgroundColor || "#FFFFFF",
          headerTextColor: params.headerTextColor || "#FFFFFF",
          nameTextColor: params.nameTextColor || "#0D73A6"
        }}
        isPaginationEnabled={params.isPaginationEnabled === "true"}
        isLeagueGroupingEnabled={params.isLeagueGroupingEnabled === "true"}
      />
    </ClientWrapper>
  );
}
```

### Step 7: Create Type Files

Create type definitions in `app/types/my-new-widget.ts` (like `alumni.ts`):

```typescript
export interface MyWidgetData {
  id: number;
  name: string;
  // Define your data structure
}

export interface MyWidgetAPIResponse {
  data: MyWidgetData[];
  total: number;
  error?: string;
}

export interface MyWidgetTableProps {
  data: MyWidgetData[];
  // Define table-specific props
}
```

### Step 8: Create Custom Hook (if needed)

Create data fetching hook in `app/hooks/useFetchMyWidgetData.ts` (like `useFetchPlayers.ts`):

```typescript
import { useState, useEffect } from 'react';

export const useFetchMyWidgetData = (params: any) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch data logic
  }, [params]);

  return { results, loading, error };
};
```

### Key Alumni Component Features to Reference:

- **Search Integration**: Real-time search with magnifying glass icon
- **Tab System**: Men's/Women's league switching
- **Custom Hooks**: Data fetching with loading states
- **Color Customization**: Full theme support
- **Responsive Design**: Mobile-friendly layouts
- **Error Handling**: Loading states and error messages
- **Pagination Support**: Optional pagination controls
- **League Grouping**: Optional data grouping by categories

## 🏒 Adding New Leagues

Adding leagues is now **centralized**! You only need to update one file:

### Step 1: Open League Configuration

Edit `app/config/leagues.ts` and add your league to the `LEAGUE_CONFIG` array:

```typescript
// Add to LEAGUE_CONFIG array
{
  slug: 'new-league-slug',           // Must match API slug
  name: 'New League Name',           // Display name
  category: 'professional',          // 'professional', 'junior', or 'college'
  region: 'north-america',           // 'north-america', 'europe', or 'other'
  ranking: 50,                       // Lower = higher priority in lists
  level: 'professional'              // Used for league level determination
}
```

### What Gets Updated Automatically:

- ✅ League selection dropdowns
- ✅ League ranking/sorting
- ✅ Regional grouping (NHL, AHL, North America, Europe)
- ✅ League category determination
- ✅ API routing and filtering
- ✅ Tournament mappings

### Step 2: Add Tournament Mappings (if needed)

If adding tournament mappings, update the `getTournamentLeagueSlug` function in `leagues.ts`:

```typescript
const tournamentMapping: Record<string, string> = {
  // ... existing mappings
  "my-tournament": "my-league-slug"
};
```

The centralized league configuration in `app/config/leagues.ts` handles all league management automatically.

## 🏗️ Project Architecture

```
app/
├── (pages)/               # Main application pages
│   ├── alumni/           # Alumni widget page
│   ├── player/           # Player widget page
│   ├── team/             # Team widget page
│   └── embed/            # Embeddable widget pages
│       ├── alumni/       # Alumni embed page
│       ├── player/       # Player embed page
│       └── team/         # Team embed page
├── api/                   # API routes
│   ├── player/           # Player data endpoints
│   ├── team/             # Team data endpoints
│   ├── league/           # League data endpoints
│   └── tournament-alumni/ # Tournament alumni endpoint
├── components/
│   ├── alumni/           # Alumni-specific components
│   ├── common/           # Shared components
│   └── widget/           # Widget setup components
├── config/
│   └── leagues.ts        # Centralized league configuration
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Utility functions

public/
└── widget-loader.js      # Client-side widget loader
```

## 🔧 Environment Variables

Create `.env.local`:

```bash
# Elite Prospects API
API_KEY=your_api_key_here
API_BASE_URL=https://api.eliteprospects.com

# Optional: Custom domain for widgets
NEXT_PUBLIC_WIDGET_DOMAIN=https://your-domain.com
```

## 📝 Widget Implementation Guide

### Direct Script Implementation (Recommended)

```html
<!-- Add widget container -->
<div 
  class="ep-widget" 
  data-widget-type="player"
  data-player-id="12345"
  data-background-color="#052D41"
  data-text-color="#FFFFFF"
></div>

<!-- Load widget script -->
<script src="https://your-domain.com/widget-loader.js"></script>
```

### Iframe Implementation (Legacy)

```html
<iframe 
  src="https://your-domain.com/embed/player?playerId=12345&backgroundColor=%23052D41"
  style="width:100%;height:600px;border:none;"
></iframe>
```

## 🎨 Styling & Customization

### Default Color Scheme

```css
--primary-bg: #052D41      /* Dark blue background */
--primary-text: #FFFFFF    /* White text */
--secondary-text: #0D73A6  /* Blue links/names */
--table-bg: #FFFFFF        /* White table background */
--table-text: #000000      /* Black table text */
```

### Custom Styling

All widgets support these customization parameters:

- `backgroundColor` - Main background color
- `textColor` - Primary text color
- `tableBackgroundColor` - Table background color
- `headerTextColor` - Header text color
- `nameTextColor` - Player/team name color

## 🚀 Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Build widget bundle only
npm run build:widget

# Build everything
npm run build:all

# Start production server
npm start
```

## 📊 API Endpoints

### Player API
- `GET /api/player?playerId={id}` - Player basic info
- `GET /api/player-stats?playerId={id}` - Player statistics
- `GET /api/player-games?playerId={id}` - Player game logs

### Team API
- `GET /api/team?teamId={id}` - Team information
- `GET /api/team-roster?teamId={id}` - Team roster

### League API
- `GET /api/league?leagueSlug={slug}` - League information
- `GET /api/scoring-leaders?league={slug}&season={year}` - Scoring leaders
- `GET /api/goalie-leaders?league={slug}&season={year}` - Goalie leaders

### Alumni API
- `GET /api/alumni?teams={ids}&leagues={slugs}` - Team alumni
- `GET /api/tournament-alumni?tournaments={slugs}&leagues={slugs}` - Tournament alumni

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐛 Debugging

### Common Issues

1. **Widget not loading**: Check console for JavaScript errors
2. **API errors**: Verify API_KEY and API_BASE_URL in environment
3. **Styling issues**: Check CSS specificity and widget container styles
4. **League not appearing**: Ensure league is added to `app/config/leagues.ts`

### Debug Mode

Enable debug mode by adding `?debug=true` to any widget URL.

## 📚 Additional Resources

- [Elite Prospects API Documentation](https://api-docs.eliteprospects.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
