# IndexForge

> Visual RAG (Retrieval-Augmented Generation) pipeline builder with data connectors, chunking strategies, vector indexing, and evaluation dashboards.

## Features

- **Data Connectors** -- Connect files, URLs, APIs, databases, and S3 buckets as data sources with sync status tracking
- **Chunking Configuration** -- Configure and preview chunking strategies (fixed, sentence, paragraph, semantic, recursive) with adjustable size and overlap
- **Vector Index Builder** -- Configure HNSW, IVF Flat, Flat, or Annoy indexes with multiple embedding providers and distance metrics
- **Query Pipeline** -- Test retrieval with similarity, MMR, hybrid, or re-ranker strategies and adjustable top-K and score thresholds
- **Evaluation Dashboard** -- Track precision, recall, F1, and latency metrics across test queries
- **Index Comparison** -- Side-by-side speed, accuracy, and memory comparison for all index types

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Framework | Next.js 14 (App Router)             |
| Language  | TypeScript                          |
| UI        | Tailwind CSS, Lucide React          |
| Charts    | Recharts                            |
| State     | Zustand                             |
| Backend   | Supabase (Auth + Database)          |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
indexforge/
├── src/
│   └── app/
│       └── page.tsx          # Full app with connectors, chunking, indexing,
│                             # query pipeline, and evaluation tabs
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind configuration
└── package.json
```

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start dev server         |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## License

MIT
