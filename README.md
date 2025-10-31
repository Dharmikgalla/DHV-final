# Hierarchical Clustering Visualization

An interactive web application for visualizing hierarchical clustering algorithms with real-time dendrograms and scatter plots.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Language**: TypeScript
- **State Management**: React Hooks + TanStack Query
- **Icons**: Lucide React

## 📋 Features

### Clustering Algorithms
- **Agglomerative Clustering** (Bottom-up approach)
- **Divisive Clustering** (Top-down approach)

### Interactive Visualizations
- **Dendrogram Tree**: Hierarchical tree structure showing cluster relationships
- **Scatter Plot**: 2D visualization of data points with cluster highlighting
- **Dynamic Cut Line**: Adjustable dendrogram cut for controlling cluster count
- **Step-by-Step Animation**: Watch clusters form progressively

### Datasets
1. **Medical Patients** (`medical_patients_dataset.csv`)
   - Features: Age, Temperature, Blood Pressure, Sugar Level
   - Clusters: Normal/Stable, Mild Viral Infection, Metabolic Risk, Mixed Symptoms

2. **Crime Sites** (`crime_sites_clustering_dataset.csv`)
   - Features: Latitude, Longitude, Severity Level
   - Clusters: Geographic crime zones with severity levels

3. **Customer Segmentation** (`customer_segmentation_dataset.csv`)
   - Features: Age, Annual Income, Spending Score, Loyalty Years
   - Clusters: Customer behavior segments

### Advanced Features
- **Dynamic Cluster Naming**: Intelligent cluster names based on data characteristics
- **Interactive Tooltips**: Hover over points and clusters for detailed statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Custom Color Schemes**: Distinct colors for each cluster
- **Real-time Updates**: Instant recalculation on parameter changes

## 🛠️ Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DHV-project-2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type checking
npm run check

# Run ESLint
npm run lint
```

## 📁 Project Structure

```
DHV-project-2/
├── app/
│   ├── api/
│   │   └── cluster/
│   │       └── route.ts          # Clustering API endpoint
│   ├── components/
│   │   ├── ui/                   # Reusable UI components (shadcn/ui)
│   │   ├── ClusterTooltip.tsx    # Cluster information tooltip
│   │   ├── ControlPanel.tsx      # Algorithm controls
│   │   ├── DataPointTooltip.tsx  # Point information tooltip
│   │   ├── Dendrogram.tsx        # Dendrogram visualization
│   │   ├── ScatterPlot.tsx       # Scatter plot visualization
│   │   └── StoryDisplay.tsx      # Clustering story narration
│   ├── hooks/
│   │   ├── use-mobile.tsx        # Mobile detection hook
│   │   └── use-toast.ts          # Toast notifications hook
│   ├── lib/
│   │   ├── clustering.ts         # Clustering algorithms
│   │   ├── datasets.ts           # Dataset configurations
│   │   ├── queryClient.ts        # TanStack Query setup
│   │   └── utils.ts              # Utility functions
│   ├── App.tsx                   # Main app component
│   ├── ClusteringPage.tsx        # Main clustering page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Home page
├── attached_assets/              # Dataset CSV files
├── shared/
│   └── schema.ts                 # TypeScript interfaces
├── next-env.d.ts                 # Next.js TypeScript declarations
├── package.json                  # Dependencies
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Customization

### Adding New Datasets

1. Add your CSV file to `attached_assets/`
2. Create a dataset configuration in `app/lib/datasets.ts`:

```typescript
export const yourDatasetConfig: DatasetConfig = {
  id: 'your-dataset',
  name: 'Your Dataset Name',
  icon: 'icon-name',
  xAxis: { label: 'X Label', key: 'x_column' },
  yAxis: { label: 'Y Label', key: 'y_column' },
  availableAxes: [...],
  tooltipFields: [...],
  clusterColors: [...],
  getDiagnosis: (stats) => { /* ... */ },
  getStoryStep: (step, algorithm) => { /* ... */ },
};
```

3. Add your data array and register in `DATASET_CONFIGS`

### Modifying Cluster Colors

Edit the `clusterColors` array in `app/lib/datasets.ts`:

```typescript
clusterColors: [
  'hsl(140, 65%, 50%)',  // Green
  'hsl(48, 90%, 55%)',   // Yellow
  'hsl(0, 75%, 55%)',    // Red
  'hsl(220, 75%, 60%)',  // Blue
],
```

### Customizing Cluster Names

Update the clustering logic in `getMedicalClusterName()`, `getCrimeClusterName()`, or `getCustomerClusterName()` functions in `app/lib/datasets.ts`.

## 🧮 Clustering Algorithm Details

### Single Linkage Distance
The application uses **single linkage (minimum distance)** for calculating cluster distances:

```typescript
distance(C1, C2) = min { d(p1, p2) : p1 ∈ C1, p2 ∈ C2 }
```

This creates more intuitive hierarchical structures for visualization.

### Dendrogram Construction
- Uses a `pointToNode` map to track hierarchical relationships
- Verifies cluster membership before merging
- Assigns actual merge distances as branch heights
- Implements fallback for incomplete trees

## 🐛 Known Issues & Solutions

### Port Already in Use
If port 3000 is occupied:
```bash
# Next.js will automatically try ports 3001, 3002, etc.
# Or specify a custom port:
PORT=3001 npm run dev
```

### Build Errors
Clear the build cache:
```bash
rm -rf .next
npm run build
```

## 📊 Dataset Information

### Medical Patients Dataset
- **Size**: 8 patients
- **Features**: Age, Temperature (°F), Blood Pressure (Systolic/Diastolic), Sugar Level (mg/dL)
- **Purpose**: Identify health risk groups

### Crime Sites Dataset
- **Size**: 9 crime incidents
- **Features**: Latitude, Longitude, Crime Type, Severity Level
- **Purpose**: Geographic crime pattern analysis

### Customer Segmentation Dataset
- **Size**: 9 customers
- **Features**: Age, Annual Income (k$), Spending Score, Loyalty Years
- **Purpose**: Customer behavior segmentation

## 🤝 Contributing

This project is maintained as an educational visualization tool. Feel free to fork and customize for your needs.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For issues and questions:
1. Check the documentation above
2. Review the code comments
3. Open an issue in the repository

---

**Built with ❤️ using Next.js and Tailwind CSS**






