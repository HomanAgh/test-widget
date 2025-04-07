This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Test Widget

## Widget Implementation Options

### 1. Direct Script Implementation

The direct script implementation allows widgets to be rendered directly on the page without iframes, providing better integration with the hosting site.

```html
<!-- Player Widget -->
<div 
  class="ep-widget" 
  data-widget-type="player" 
  data-player-id="PLAYER_ID"
  data-game-limit="5"
  data-view-mode="stats"
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>

<!-- Widget Loader Script (place at the end of the body) -->
<script src="https://your-domain.com/widget-loader.js"></script>
```

#### Supported Widget Types:

- `player` - Displays player statistics
- `team` - Displays team information
- `league` - Displays league information
- `scoring-leaders` - Displays scoring leaders for a league
- `goalie-leaders` - Displays goalie leaders for a league
- `alumni` - Displays alumni information
- `tournament` - Displays tournament information

#### Common Configuration Parameters:

- `data-widget-type` - The type of widget to display (required)
- `data-background-color` - Background color (default: #052D41)
- `data-text-color` - Text color (default: #000000)
- `data-table-background-color` - Table background color (default: #FFFFFF)
- `data-header-text-color` - Header text color (default: #FFFFFF)
- `data-name-text-color` - Name text color (default: #0D73A6)

#### Widget-Specific Parameters:

**Player Widget:**
- `data-player-id` - Player ID (required)
- `data-game-limit` - Number of games to display (default: 5)
- `data-view-mode` - View mode: stats, games, seasons, career (default: stats)
- `data-show-summary` - Show summary: true, false (default: false)

**Team Widget:**
- `data-team-id` - Team ID (required)

**League Widget:**
- `data-league-slug` - League slug (required)

**Scoring Leaders Widget:**
- `data-league-slug` - League slug (required)
- `data-season` - Season (required)

**Goalie Leaders Widget:**
- `data-league-slug` - League slug (required)
- `data-season` - Season (required)

**Alumni Widget:**
- `data-team-ids` - Team IDs (required)
- `data-leagues` - Leagues (required)
- `data-teams` - Teams

**Tournament Widget:**
- `data-tournaments` - Tournaments (required)
- `data-leagues` - Leagues (required)

### 2. Iframe Implementation (Legacy)

For environments where direct script implementation is not possible, the iframe implementation is still available.

```html
<iframe 
  src="https://your-domain.com/embed/player?playerId=PLAYER_ID&gameLimit=5&viewMode=stats&backgroundColor=%23052D41&textColor=%23000000"
  style="width:100%;height:600px;border:none;"
></iframe>
```

## Build Instructions

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build production app
npm run build

# Build widget bundle
npm run build:widget

# Build both app and widget bundle
npm run build:all
```
