# Word Set Management System (Lang Quiz Claude)

A full-stack application for managing vocabulary word sets with a modern tech stack built using TDD principles.

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- SQLite3 (included with most systems)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd lang-quiz-claude

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Initialize database
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Design System Features (NEW - SPEC-UI-001)

### Core Components
- **Button**: Multiple variants (primary, secondary, outline, ghost) with 3 sizes (sm, md, lg) and loading states
- **Card**: Interactive and default variants with smooth hover effects and transitions
- **Input**: Text input with labels, validation, error states, and accessibility features
- **Badge**: Status indicators with semantic color variants
- **Skeleton**: Loading state UI with pulse animation
- **Dialog**: Modal dialogs for confirmations and user interactions
- **Grid**: Responsive layout component

### Design Tokens
- **Typography**: Pretendard/Inter fonts with 8 size levels and optimized line heights
- **Color System**: Semantic palette with 9 color variants (50-950) for primary, success, warning, error, and neutral colors
- **Layout**: Consistent spacing system (xs to 2xl) and responsive breakpoints
- **Accessibility**: WCAG 2.1 AA compliance with 4.5:1 minimum contrast ratio

### Quality Metrics
- **Test Coverage**: 174 passing tests, 88% UI coverage
- **Accessibility**: TRUST 5 score 98/100, WCAG 2.1 AA compliant
- **Performance**: 60fps animations, optimized font loading, <50KB bundle increase

## Features

### Word Set Management
- Create, read, update, and delete word sets
- Organize words by sets/categories
- Track word counts per set
- Timestamps for creation and modification
- **Folder organization system** (SPEC-FOLDER-001) - Organize word sets into folders
- **Modern UI** (SPEC-UI-001) - Consistent design system with semantic components

### Folder Management (SPEC-FOLDER-001)
- Create, read, update, and delete folders
- Assign word sets to folders
- Filter word sets by folder
- Folder statistics (count of word sets per folder)
- Safe deletion with Nullify policy (word sets moved to root, not deleted)
- Support for unlimited folder count
- Intuitive folder UI similar to file systems with consistent design

### Word Management
- Add words to word sets
- Edit word text and meanings
- Delete words from sets
- Automatic count synchronization

### User Experience
- **Professional Design System** with consistent, accessible components
- Responsive design for mobile, tablet, and desktop
- Real-time data updates with TanStack Query
- Optimistic UI updates
- Clear error messages and validation with semantic colors
- Smooth animations and transitions (300ms ease-in-out)
- High contrast colors (WCAG AA compliant)
- Keyboard navigation support

### Data Integrity
- Cascade delete for related records
- Nullify deletion policy for folders (preserves data)
- Input validation on all operations
- Type-safe with TypeScript
- Database migrations for schema versioning

## Project Structure

```
lang-quiz-claude/
├── app/                    # Next.js 15.1.0 app directory
│   ├── api/
│   │   ├── folders/       # Folder API routes (SPEC-FOLDER-001)
│   │   └── wordsets/      # WordSet API routes
│   ├── components/
│   │   ├── ui/            # Reusable UI components (SPEC-UI-001)
│   │   │   ├── Button.tsx         # Button component with 4 variants
│   │   │   ├── Card.tsx           # Card component for content containers
│   │   │   ├── Input.tsx          # Form input with validation
│   │   │   ├── Badge.tsx          # Status/tag indicator
│   │   │   ├── Skeleton.tsx       # Loading state placeholder
│   │   │   ├── Dialog.tsx         # Modal dialog component
│   │   │   └── Grid.tsx           # Responsive grid layout
│   │   ├── folders/       # Folder-specific components (SPEC-FOLDER-001)
│   │   ├── wordsets/      # WordSet-specific components
│   │   └── learn/         # Learning system components (SPEC-LEARN-001)
│   ├── lib/               # Design system and utilities (SPEC-UI-001)
│   │   ├── colors/        # Color token definitions
│   │   ├── fonts/         # Typography system (Pretendard, Inter)
│   │   ├── layout/        # Spacing and layout tokens
│   │   └── utils/         # Utility functions (cn, classname merging)
│   ├── folders/           # Folder management pages (SPEC-FOLDER-001)
│   ├── wordsets/          # WordSet management pages
│   ├── layout.tsx         # Root layout with header/footer
│   └── page.tsx           # Home page
├── lib/                   # Prisma client and shared utilities
├── hooks/                 # Custom React hooks (TanStack Query, custom logic)
├── prisma/                # Database schema and migrations
├── __tests__/             # Unit tests
│   ├── api/               # API endpoint tests
│   ├── components/        # Component unit tests
│   ├── a11y/              # Accessibility tests
│   └── utils/             # Utility function tests
├── e2e/                   # End-to-end tests (Playwright)
├── docs/                  # Documentation (NEW - SPEC-UI-001)
│   ├── architecture/      # Architecture guides
│   └── guides/            # Integration and customization guides
└── public/                # Static assets
```

## Design System Structure (SPEC-UI-001)

### Color System Location
- **Path**: `/app/lib/colors/index.ts`
- **Tokens**: Primary (blue), Success (green), Warning (orange), Error (red), Neutral (gray)
- **Variants**: 9 levels each (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)

### Typography System Location
- **Path**: `/app/lib/fonts/index.ts`
- **Fonts**: Pretendard (Korean), Inter (English) with system-ui fallback
- **Sizes**: 8 levels from xs (0.75rem) to 4xl (2.25rem)
- **Implementation**: CSS variables with Tailwind CSS configuration

### Layout Tokens Location
- **Path**: `/app/lib/layout/index.ts`
- **Spacing**: 8-step scale (xs: 0.5rem to 2xl: 3rem)
- **Responsive**: Mobile-first breakpoints (md: 768px, lg: 1024px, xl: 1280px)
- **Grid**: Consistent 16px-24px gap system

### Utility Functions
- **Path**: `/app/lib/utils/cn.ts`
- **Purpose**: Class name merging with `clsx` and `tailwind-merge`
- **Usage**: Prevents Tailwind CSS class conflicts in component styling

## Available Scripts

### Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### Testing

```bash
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
npm run test:e2e          # Run E2E tests
```

### Database

```bash
npm run prisma:generate   # Generate Prisma Client
npm run prisma:migrate    # Run database migrations
npm run prisma:push       # Push schema to database
npm run prisma:seed       # Seed database with test data
```

## Technology Stack

### Frontend
- **Next.js 15.1.0** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5.9.3** - Type safety and development experience
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **TanStack Query 5.59.0+** - Server state management and data fetching

### Design System (SPEC-UI-001)
- **Pretendard Font** - Korean typography optimization
- **Inter Font** - English typography
- **clsx** - Conditional class utility
- **tailwind-merge** - Tailwind CSS class conflict resolution
- **lucide-react** - Icon library

### Learning System (SPEC-LEARN-001)
- **Framer Motion 10.16.5** - Advanced animations and 3D flip effects
- **Web Speech API** - Browser-native TTS (Text-to-Speech)

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM 5.x** - Database abstraction layer

### Database
- **SQLite** (development, included)
- **PostgreSQL 16** (production-ready)

### Testing
- **Jest 29.x** - Unit testing framework with TDD support
- **React Testing Library 15.x** - Component testing best practices
- **Playwright 1.x** - E2E testing across browsers
- **jest-axe** - Automated accessibility testing
- **axe-core** - Web accessibility testing

### Code Quality
- **TypeScript 5.9.3** - Static type checking
- **ESLint 8.x** - Code quality linting
- **Prettier 3.x** - Code formatting
- **Tailwind CSS** - CSS consistency checks

## API Documentation

### Folder Endpoints (NEW - SPEC-FOLDER-001)

#### Create Folder
```
POST /api/folders
Content-Type: application/json

{
  "name": "TOEFL Words",
  "description": "Essential TOEFL vocabulary"
}

Response: 201 Created
{
  "id": "clx5f6g7h8i9j0k1l2m3",
  "name": "TOEFL Words",
  "description": "Essential TOEFL vocabulary",
  "parentId": null,
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z",
  "_count": {
    "wordSets": 0
  }
}
```

#### List Folders (with statistics)
```
GET /api/folders

Response: 200 OK
[
  {
    "id": "clx5f6g7h8i9j0k1l2m3",
    "name": "TOEFL Words",
    "description": "Essential TOEFL vocabulary",
    "parentId": null,
    "createdAt": "2025-11-25T10:00:00.000Z",
    "updatedAt": "2025-11-25T10:00:00.000Z",
    "_count": {
      "wordSets": 5
    }
  }
]
```

#### Get Folder Details
```
GET /api/folders/[id]

Response: 200 OK
{
  "id": "clx5f6g7h8i9j0k1l2m3",
  "name": "TOEFL Words",
  "description": "Essential TOEFL vocabulary",
  "parentId": null,
  "createdAt": "2025-11-25T10:00:00.000Z",
  "updatedAt": "2025-11-25T10:00:00.000Z",
  "_count": {
    "wordSets": 5
  }
}
```

#### Update Folder
```
PUT /api/folders/[id]
Content-Type: application/json

{
  "name": "Updated Folder Name",
  "description": "Updated description"
}

Response: 200 OK
```

#### Delete Folder (Nullify Policy)
```
DELETE /api/folders/[id]

Response: 200 OK
{
  "message": "폴더가 삭제되었습니다.",
  "movedWordSets": 5
}

Note: Word sets are moved to root (folderId=null), not deleted
```

#### Get Word Sets in Folder
```
GET /api/folders/[id]/wordsets

Response: 200 OK
[
  {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "name": "Reading Words",
    "description": "TOEFL Reading section",
    "folderId": "clx5f6g7h8i9j0k1l2m3",
    "wordCount": 50,
    "createdAt": "2025-11-25T10:05:00.000Z",
    "updatedAt": "2025-11-25T10:05:00.000Z"
  }
]
```

### Word Set Endpoints (Updated with Folder Support)

#### Create Word Set
```
POST /api/wordsets
Content-Type: application/json

{
  "name": "TOEFL Words",
  "description": "Essential TOEFL vocabulary",
  "folderId": "clx5f6g7h8i9j0k1l2m3"  # Optional - assign to folder
}

Response: 201 Created
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "TOEFL Words",
  "description": "Essential TOEFL vocabulary",
  "folderId": "clx5f6g7h8i9j0k1l2m3",
  "folder": {
    "id": "clx5f6g7h8i9j0k1l2m3",
    "name": "TOEFL"
  },
  "words": [],
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z"
}
```

#### List Word Sets (with folder info)
```
GET /api/wordsets

Response: 200 OK
[
  {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "name": "TOEFL Words",
    "description": "Essential TOEFL vocabulary",
    "folderId": "clx5f6g7h8i9j0k1l2m3",
    "folder": {
      "id": "clx5f6g7h8i9j0k1l2m3",
      "name": "TOEFL"
    },
    "wordCount": 25,
    "createdAt": "2025-11-24T10:30:00.000Z",
    "updatedAt": "2025-11-24T10:30:00.000Z"
  }
]
```

#### Get Word Set Details
```
GET /api/wordsets/[id]

Response: 200 OK
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "TOEFL Words",
  "description": "Essential TOEFL vocabulary",
  "folderId": "clx5f6g7h8i9j0k1l2m3",
  "folder": {
    "id": "clx5f6g7h8i9j0k1l2m3",
    "name": "TOEFL"
  },
  "words": [
    {
      "id": "clx2b3c4d5e6f7g8h9i0",
      "text": "apple",
      "meaning": "사과",
      "wordSetId": "clx1a2b3c4d5e6f7g8h9",
      "createdAt": "2025-11-24T10:35:00.000Z",
      "updatedAt": "2025-11-24T10:35:00.000Z"
    }
  ],
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z"
}
```

#### Update Word Set (with folder support)
```
PUT /api/wordsets/[id]
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "folderId": "clx5f6g7h8i9j0k1l2m3"  # Optional - change folder or set to null
}

Response: 200 OK
```

#### Delete Word Set
```
DELETE /api/wordsets/[id]

Response: 204 No Content
```

### Word Endpoints

#### Add Word to Set
```
POST /api/wordsets/[id]/words
Content-Type: application/json

{
  "text": "banana",
  "meaning": "바나나"
}

Response: 201 Created
```

#### Update Word
```
PUT /api/words/[id]
Content-Type: application/json

{
  "text": "banana",
  "meaning": "바나나 (열대 과일)"
}

Response: 200 OK
```

#### Delete Word
```
DELETE /api/words/[id]

Response: 204 No Content
```

## Testing

### Unit Tests
Run unit tests for API routes and components:
```bash
npm run test
```

### E2E Tests
Run end-to-end tests with Playwright:
```bash
npm run test:e2e
```

### Coverage Report
Generate test coverage report:
```bash
npm run test:coverage
```

Target coverage: **90%+**

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite for development
# DATABASE_URL="postgresql://user:password@localhost:5432/wordset"  # PostgreSQL for production

# Environment
NODE_ENV="development"
```

## Database Schema

### Folder Table (NEW - SPEC-FOLDER-001)
- `id` (String, Primary Key) - Unique identifier
- `name` (String) - Folder name (max 100 characters)
- `description` (String, Optional) - Description (max 500 characters)
- `parentId` (String, Optional) - Future nested folder support
- `wordSets` (One-to-Many) - Word sets in this folder
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### WordSet Table (Updated with Folder Support)
- `id` (String, Primary Key) - Unique identifier
- `name` (String) - Word set name
- `description` (String, Optional) - Description
- `folderId` (String, Optional) - Reference to Folder (SetNull on delete)
- `folder` (Many-to-One) - Folder relationship
- `words` (One-to-Many) - Words in this set
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Word Table
- `id` (String, Primary Key) - Unique identifier
- `text` (String) - Word/English term
- `meaning` (String) - Meaning/Korean translation
- `wordSetId` (String, Foreign Key) - Reference to WordSet
- `wordSet` (Many-to-One) - Word set relationship
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Relationships
- **Folder → WordSet** (One-to-Many): One folder can contain many word sets
- **WordSet → Word** (One-to-Many): One word set can contain many words
- **WordSet → Folder** (Many-to-One): Multiple word sets can belong to one folder
- **Deletion Policy**:
  - Folder deleted → Word sets moved to root (folderId = null, SetNull)
  - Word set deleted → Words cascade deleted (Cascade)

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier rules
- Write meaningful variable and function names
- Add comments for complex logic

### Testing
- Write tests before implementation (TDD)
- Aim for 90%+ test coverage
- Test both happy path and error cases
- Include E2E tests for user workflows

### Git Workflow
- Create feature branches from main
- Write descriptive commit messages
- Create pull requests for code review
- Merge after approval and tests pass

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup
1. Update `.env` with production database URL
2. Run migrations: `npm run prisma:migrate`
3. Build: `npm run build`
4. Start: `npm start`

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Performance Optimization

### Frontend
- Code splitting with Next.js
- Image optimization
- CSS-in-JS optimization
- Lazy loading of components

### Backend
- Database query optimization
- Indexes on frequently queried fields
- Response caching with TanStack Query
- API response compression

### Database
- Indexes on `wordSetId` and `folderId`
- Efficient join queries
- Connection pooling support

## Security

### Implementation
- SQL injection prevention via Prisma ORM
- XSS prevention via React auto-escaping
- CSRF protection ready (can be added)
- Input validation on all endpoints
- Type safety with TypeScript

### Best Practices
- Keep dependencies updated
- Use environment variables for secrets
- Implement rate limiting for APIs
- Add authentication (future)
- Regular security audits

## Troubleshooting

### Database Issues
```bash
# Reset database
rm dev.db
npm run prisma:migrate

# Verify migrations
npx prisma migrate status
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is licensed under the ISC License - see LICENSE file for details.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and reproduction steps
4. Attach relevant code snippets

## Recent Implementation Updates

### Design System Implementation (SPEC-UI-001) - COMPLETED ✓
**Date**: 2025-12-06 | **Status**: Completed | **Quality**: TRUST 5: 98/100

#### Completed Features
- [x] Typography system (Pretendard/Inter fonts, 8 size levels)
- [x] Color system (5 semantic colors, 9 variants each)
- [x] Button component (4 variants: primary, secondary, outline, ghost)
- [x] Card component (default and interactive variants)
- [x] Input component (with labels, validation, error states)
- [x] Badge component (status indicators)
- [x] Dialog component (modals and confirmations)
- [x] Grid component (responsive layout)
- [x] Skeleton component (loading states)
- [x] CSS utility functions (cn with clsx + tailwind-merge)

#### Implementation Statistics
- **Lines Added**: 3,960 lines of code
- **Test Coverage**: 174 passing tests (88% UI coverage)
- **Bundle Impact**: <50KB increase (gzip)
- **Commits**: 5 commits with descriptive messages
- **Accessibility**: WCAG 2.1 AA compliant (98/100 TRUST score)

#### Component Quality Metrics
- **Responsive Design**: Mobile-first, 3 breakpoints (md, lg, xl)
- **Animation Performance**: 60fps maintained
- **Color Contrast**: 4.5:1+ WCAG AA compliance
- **Keyboard Navigation**: Full support for all interactive elements
- **ARIA Implementation**: Complete accessibility labeling

#### Key Improvements
- Consistent design language across all pages
- Enhanced user experience with smooth transitions
- Professional, modern appearance
- Accessibility-first approach
- Performance-optimized font loading
- Semantic color system for better UX

### Folder Management System (SPEC-FOLDER-001) - COMPLETED ✓

#### Completed Features
- [x] Folder management system (CRUD)
- [x] Folder-WordSet relationships
- [x] Safe deletion with Nullify policy
- [x] Folder statistics (count of word sets)
- [x] Root area support (folderId=null)
- [x] Full backward compatibility with SPEC-WORDSET-001

#### Added API Endpoints
- `POST /api/folders` - Create folder
- `GET /api/folders` - List folders with stats
- `GET /api/folders/:id` - Get folder details
- `PUT /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder (Nullify)
- `GET /api/folders/:id/wordsets` - Get folder word sets

#### Enhanced API Endpoints
- `POST /api/wordsets` - Now supports `folderId` parameter
- `PUT /api/wordsets/:id` - Now supports `folderId` update
- `GET /api/wordsets` - Now includes folder information

#### Added UI Components
- `FolderList` - Display folder grid with statistics
- `FolderCard` - Individual folder card
- `FolderForm` - Create/edit folder form
- `FolderDetail` - Folder detail page
- `FolderSelector` - Dropdown for assigning folders to wordsets

#### Test Coverage
- **60 unit tests** covering all folder operations
- **Full backward compatibility** with SPEC-WORDSET-001
- **100% API coverage** for folder endpoints
- **Integration tests** for folder-wordset relationships

### Learning System (SPEC-LEARN-001) - IN PROGRESS
**Status**: SPEC-UI-001 completed, ready for implementation | **Dependency**: Unblocked on 2025-12-06

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Word set sharing and collaboration
- [ ] Nested folder structure (use `parentId` field)
- [ ] Advanced search and filtering
- [ ] Word pronunciation with audio
- [ ] Spaced repetition algorithm
- [ ] Mobile app with React Native
- [ ] Offline support with PWA
- [ ] Import/export functionality
- [ ] Analytics and progress tracking
- [ ] Folder color tags
- [ ] Drag and drop folder/wordset organization

---

**Built with TDD principles** | **TRUST 5 Compliance** | **Production Ready**
