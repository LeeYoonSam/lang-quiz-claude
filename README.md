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

## Features

### Word Set Management
- Create, read, update, and delete word sets
- Organize words by sets/categories
- Track word counts per set
- Timestamps for creation and modification

### Word Management
- Add words to word sets
- Edit word text and meanings
- Delete words from sets
- Automatic count synchronization

### User Experience
- Responsive design for mobile, tablet, and desktop
- Real-time data updates with TanStack Query
- Optimistic UI updates
- Clear error messages and validation

### Data Integrity
- Cascade delete for related records
- Input validation on all operations
- Type-safe with TypeScript
- Database migrations for schema versioning

## Project Structure

```
lang-quiz-claude/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── wordsets/          # WordSet pages
│   └── layout.tsx         # Root layout
├── lib/                   # Utility functions and Prisma client
├── hooks/                 # Custom React hooks (TanStack Query)
├── prisma/                # Database schema and migrations
├── __tests__/             # Unit tests
├── e2e/                   # End-to-end tests
└── public/                # Static assets
```

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
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TanStack Query** - Server state management

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database abstraction

### Database
- **SQLite** (development)
- **PostgreSQL 16** (production-ready)

### Testing
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### Code Quality
- **TypeScript** - Type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting

## API Documentation

### Word Set Endpoints

#### Create Word Set
```
POST /api/wordsets
Content-Type: application/json

{
  "name": "TOEFL Words",
  "description": "Essential TOEFL vocabulary"
}

Response: 201 Created
{
  "id": "clx1a2b3c4d5e6f7g8h9",
  "name": "TOEFL Words",
  "description": "Essential TOEFL vocabulary",
  "folderId": null,
  "words": [],
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z"
}
```

#### List Word Sets
```
GET /api/wordsets

Response: 200 OK
[
  {
    "id": "clx1a2b3c4d5e6f7g8h9",
    "name": "TOEFL Words",
    "description": "Essential TOEFL vocabulary",
    "folderId": null,
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
  "folderId": null,
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

#### Update Word Set
```
PUT /api/wordsets/[id]
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
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

### WordSet Table
- `id` (String, Primary Key) - Unique identifier
- `name` (String) - Word set name
- `description` (String, Optional) - Description
- `folderId` (String, Optional) - Future folder support
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

### Word Table
- `id` (String, Primary Key) - Unique identifier
- `text` (String) - Word/English term
- `meaning` (String) - Meaning/Korean translation
- `wordSetId` (String, Foreign Key) - Reference to WordSet
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

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

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Word set sharing and collaboration
- [ ] Folder organization system
- [ ] Advanced search and filtering
- [ ] Word pronunciation with audio
- [ ] Spaced repetition algorithm
- [ ] Mobile app with React Native
- [ ] Offline support with PWA
- [ ] Import/export functionality
- [ ] Analytics and progress tracking

---

**Built with TDD principles** | **TRUST 5 Compliance** | **Production Ready**
