# Interactive Hierarchical Clustering Visualization

## Overview

An educational web application that teaches hierarchical clustering algorithms through interactive visualizations. The application transforms complex machine learning concepts into visual narratives using real-world datasets (medical patients, crime sites, customer segmentation). Users can watch step-by-step animations of clustering processes, interact with dendrograms, and explore how similar data points are grouped together—all designed for non-technical audiences from various professional backgrounds.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component Library**: Shadcn/ui components built on Radix UI primitives, providing accessible, customizable components with consistent theming. The design system follows a "new-york" style with custom color palettes for different dataset themes (medical, crime, customer).

**State Management**: React Query (TanStack Query) for server state management and caching. Local component state managed through React hooks.

**Routing**: Wouter for lightweight client-side routing (single-page application with minimal routes).

**Styling**: Tailwind CSS with custom HSL color variables for theming. Design approach inspired by Observable notebooks, Linear, and Figma for clean data visualization aesthetics. Dark mode is the primary theme with dataset-specific color palettes.

**Canvas Rendering**: Custom Canvas-based visualizations for scatter plots and dendrograms to handle complex interactive data visualizations with smooth animations and hover states.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with a single clustering endpoint (`POST /api/cluster`) that accepts dataset points and algorithm selection, returning clustering steps, final clusters, and dendrogram tree structure.

**Clustering Algorithms**: 
- Implemented from scratch in TypeScript (server/clustering.ts)
- Supports both agglomerative (bottom-up) and divisive (top-down) hierarchical clustering
- Uses Euclidean distance for similarity measurement
- Average linkage for cluster distance calculation
- Returns step-by-step merge information for animation

**Session Management**: In-memory storage using a custom storage interface (IStorage) for potential future user data persistence.

**Development Tools**: 
- Vite middleware integration for HMR during development
- Custom logging middleware for API request tracking
- Error handling middleware for consistent error responses

### Data Architecture

**Schema Definitions**: Zod schemas for runtime validation of three dataset types:
- Medical Patient Dataset (age, temperature, blood pressure, sugar level, symptoms)
- Crime Site Dataset (location coordinates, crime type, severity, time)
- Customer Segmentation Dataset (age, income, spending score, loyalty, preferences)

**Data Flow**: 
1. Frontend sends data points with selected algorithm to backend
2. Backend performs clustering calculations
3. Returns structured response with steps array, final clusters, and dendrogram tree
4. Frontend animates clustering process step-by-step using returned data

**Dataset Configurations**: Centralized configuration objects define axis mappings, tooltip fields, color schemes, and diagnostic logic for each dataset theme.

### Visualization Design

**Step-by-Step Animation System**: 
- Each clustering step includes description, action type (connect/merge/complete), affected clusters, and distance metrics
- Controlled playback with play/pause/reset functionality
- Visual connections drawn between points being merged
- Dendrogram built incrementally parallel to clustering

**Interactive Elements**:
- Hover tooltips for data points showing detailed information
- Cluster hover showing aggregate statistics and diagnosis
- Add mode for manually adding new data points
- Adjustable clustering height cutoff for dendrogram

### Design Philosophy

**Educational Focus**: Technical terms (dendrograms, Euclidean distance, clustering) explained through visual storytelling rather than mathematical formulas. Each dataset theme provides contextual narratives (e.g., medical diagnosis, crime hotspot identification, customer segmentation).

**Progressive Disclosure**: Users see clustering unfold step-by-step rather than seeing only final results, making the algorithm's decision-making process transparent.

**Theme-Based Learning**: Different professional contexts (doctors, law enforcement, retail) make the same algorithm relatable to different audiences through familiar domain-specific scenarios.

## External Dependencies

### UI Framework & Components
- **React 18** - Core UI library
- **@radix-ui/** (multiple packages) - Unstyled, accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** & **clsx** - Dynamic className composition
- **lucide-react** - Icon library

### Data Visualization
- **Canvas API** (native) - Custom rendering for scatter plots and dendrograms
- **embla-carousel-react** - Carousel component support

### Form & Data Handling
- **react-hook-form** - Form state management
- **@hookform/resolvers** - Form validation resolvers
- **zod** - Runtime schema validation
- **drizzle-zod** - Drizzle ORM integration with Zod

### State Management
- **@tanstack/react-query** - Server state management and caching
- **wouter** - Lightweight routing

### Backend Framework
- **Express.js** - Web server framework
- **Vite** - Build tool and development server with HMR

### Database (Schema Defined, Not Currently Used)
- **Drizzle ORM** - Type-safe ORM for PostgreSQL
- **@neondatabase/serverless** - Serverless PostgreSQL driver
- Database configuration present but storage currently uses in-memory implementation

### Development Tools
- **TypeScript** - Type safety across full stack
- **@replit/vite-plugin-*** - Replit-specific development plugins
- **esbuild** - Production bundling for server code

### Utilities
- **date-fns** - Date manipulation
- **nanoid** - Unique ID generation

Note: While Drizzle and PostgreSQL are configured in the project (drizzle.config.ts, schema definitions), the current implementation uses in-memory storage. Database integration may be added for user session persistence or dataset storage in future iterations.