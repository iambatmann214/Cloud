# AWS Cloud Engineering Interactive Academy

**From Cloud Fundamentals to AWS Architecture, DevOps, Security, Troubleshooting, and Certification Readiness**

A comprehensive, interactive learning web application for aspiring AWS Cloud Engineers. Built as a static site deployable to GitHub Pages — no backend, no API keys, no paid services required.

## Features

- **88+ AWS Services** covered with detailed pages following a consistent template
- **60 Service Comparisons** with decision criteria and trade-off analysis
- **20 Learning Paths** from cloud fundamentals to certification readiness
- **8 Real-World Architectures** with interactive Mermaid diagrams
- **25 Hands-On Labs** with step-by-step guided instructions
- **18 Troubleshooting Playbooks** with interactive diagnostic flows
- **120+ Glossary Terms** with cross-references
- **Practice Quizzes** with original certification-style questions
- **Progress Tracking** via localStorage (no account required)
- **Bookmarks & Notes** for personalized learning
- **Dark/Light Theme** with system preference detection
- **Global Search** with Ctrl+K keyboard shortcut
- **Responsive Design** for desktop, tablet, and mobile
- **Accessible** — keyboard navigation, semantic HTML, ARIA labels

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **React Router** (hash-based routing for GitHub Pages)
- **Fuse.js** for client-side fuzzy search
- **Mermaid** for architecture diagrams
- **Lucide React** for icons
- **localStorage** for progress persistence

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 9+

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/aws-cloud-engineering-academy.git
cd aws-cloud-engineering-academy

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/aws-cloud-engineering-academy/`

### Build for Production

```bash
npm run build
```

The built static files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deploying to GitHub Pages

### 1. Create a GitHub Repository

Create a new repository named `aws-cloud-engineering-academy` on GitHub.

### 2. Configure Base Path

The `vite.config.ts` is pre-configured with `base: '/aws-cloud-engineering-academy/'`. If your repository has a different name, update this value:

```ts
// vite.config.ts
export default defineConfig({
  base: '/YOUR-REPO-NAME/',
  // ...
});
```

### 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/aws-cloud-engineering-academy.git
git push -u origin main
```

### 4. Enable GitHub Pages

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The included workflow (`.github/workflows/deploy.yml`) will automatically build and deploy on push to `main`

### 5. Access Your Site

After the GitHub Action completes, your site will be live at:
```
https://YOUR-USERNAME.github.io/aws-cloud-engineering-academy/
```

## Project Structure

```
aws-cloud-engineering-academy/
├── .github/workflows/deploy.yml  # GitHub Actions deployment
├── public/
│   └── 404.html                  # SPA redirect for GitHub Pages
├── src/
│   ├── components/
│   │   ├── common/               # Reusable UI components
│   │   └── layout/               # App shell, TopBar, Sidebar, Search
│   ├── content/
│   │   ├── services/             # AWS service data (by category)
│   │   ├── comparisons/          # Service comparison data
│   │   ├── architectures.ts      # Architecture diagrams & content
│   │   ├── glossary.ts           # Glossary entries
│   │   ├── labs.ts               # Hands-on lab content
│   │   ├── learningPaths.ts      # Learning path & lesson content
│   │   └── troubleshooting.ts    # Troubleshooting flow content
│   ├── contexts/                 # React context providers
│   ├── hooks/                    # Custom hooks (progress, search)
│   ├── pages/                    # Route page components
│   ├── types/                    # TypeScript type definitions
│   ├── App.tsx                   # Router and app root
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles and design tokens
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Adding Content

### Adding a New Service

1. Create or update a file in `src/content/services/`
2. Follow the `AWSService` type interface from `src/types/index.ts`
3. Add the export to `src/content/services.ts` barrel file

### Adding a New Comparison

1. Create or update a file in `src/content/comparisons/`
2. Follow the `Comparison` type interface
3. Add the export to `src/content/comparisons.ts` barrel file

### Adding a New Lab

1. Add a new `Lab` entry to `src/content/labs.ts`
2. Follow the `Lab` and `LabStep` type interfaces

## Data Privacy

All learning data (progress, bookmarks, notes, quiz history) is stored in your browser's localStorage. No data is sent to any server. Data does not sync between devices or browsers. Use the Settings page to export or clear your data.

## Content Sources

This application references official AWS documentation and publicly available resources:

- [AWS Documentation](https://docs.aws.amazon.com/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [AWS Skill Builder](https://skillbuilder.aws/)
- [AWS Certification](https://aws.amazon.com/certification/)
- [AWS Pricing](https://aws.amazon.com/pricing/)

All quiz questions are original, certification-style practice questions and are labeled as such. No leaked exam content or unauthorized materials are used.

## License

This project is for educational purposes. AWS service names and logos are trademarks of Amazon Web Services, Inc.
