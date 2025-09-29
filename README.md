# 🎯 JobMatcher - AI-Powered Career Platform

A comprehensive, modern web application that helps job seekers build professional CVs, match with relevant job opportunities, track applications, and prepare for interviews using AI-powered tools. Built with Next.js 15, TypeScript, custom JWT authentication, Vercel AI SDK, and Prisma.

## ✨ Features

### 🔐 Authentication System
- **Secure User Authentication**: Custom JWT-based authentication with httpOnly cookies
- **Protected Routes**: Middleware-based route protection for sensitive pages
- **User Management**: Sign up, sign in, and session management
- **Password Security**: Bcrypt password hashing for secure storage
- **JWT Tokens**: Secure session tokens with 7-day expiration

### 📝 AI CV Builder
- **Conversational CV Building**: Create your CV through a natural chat interface powered by OpenAI
- **Smart Skill Extraction**: Automatically identifies technical and soft skills from your information
- **AI-Powered Suggestions**: Get intelligent recommendations to improve your CV quality
- **Professional Templates**: Generate beautiful, ATS-friendly CVs in PDF format
- **Real-time Analysis**: Instant feedback on CV quality and completeness
- **PDF Upload**: Upload existing CVs for enhancement and analysis

### 🔍 Job Matching & Discovery
- **Smart Matching Algorithm**: AI-powered job recommendations based on your skills and experience
- **Job Browsing**: Browse 15+ sample jobs with advanced filtering
- **Detailed Match Scores**: See how well you match each job opening
- **Advanced Filtering**: Filter by location, type, skills, salary, and remote work
- **Real-time Search**: Instant search across job titles, companies, and descriptions
- **Save Jobs**: Bookmark interesting positions for later review

### 📊 Application Tracking
- **Application Dashboard**: Track all your saved and applied jobs in one place
- **Status Management**: Mark jobs as "applied" with application dates
- **Notes & Reminders**: Add personal notes for each application
- **Organized Views**: Filter by all jobs, saved only, or applied only
- **Progress Tracking**: Monitor your job search progress

### ✉️ Cover Letter Generator
- **AI-Powered Writing**: Generate personalized cover letters using AI
- **Multiple Tones**: Choose from Professional, Enthusiastic, Formal, or Creative tones
- **CV Integration**: Automatically incorporates your CV data
- **Export Options**: Copy to clipboard or download as text file
- **Customizable**: Edit and refine generated content

### 🎤 Interview Practice AI
- **Role-Specific Questions**: AI-generated interview questions tailored to specific jobs
- **Difficulty Levels**: Beginner, Intermediate, and Advanced question sets
- **Question Categories**: Behavioral, Technical, Situational, and Company-specific
- **Answer Tips**: Expert tips for answering each question effectively
- **CV References**: Links questions to relevant experience from your CV
- **Practice Mode**: Text area for practicing and timing your answers

### 📈 Skill Gap Analysis
- **Comprehensive Analysis**: Identify skills you need to develop
- **Prioritized Learning**: Skills ranked by priority (1-10 scale)
- **Learning Resources**: Curated resources for each skill
- **Time Estimates**: Estimated learning time for each skill
- **Career Path Recommendations**: Personalized career development guidance
- **Job Integration**: Analyze gaps based on your saved jobs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-matcher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your configuration:
   ```env
   # OpenAI API Key for AI features
   OPENAI_API_KEY="sk-your-actual-openai-api-key-here"

   # Database
   DATABASE_URL="file:./dev.db"

   # JWT Secret for Authentication
   JWT_SECRET="your-jwt-secret-key-here-min-32-characters"

   # Environment
   NODE_ENV="development"
   ```

   Generate a secure JWT_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Initialize the database**

   Generate Prisma client:
   ```bash
   npx prisma generate
   ```

   Push the schema to create the database:
   ```bash
   npx prisma db push
   ```

   Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

7. **Sign in with demo account or create your own**

   **Demo Credentials** (from seed data):
   - **Email**: `john.doe@example.com` or `jane.smith@example.com`
   - **Password**: `password123`

   Or create a new account:
   - Click "Sign Up" to create your account
   - Fill in your name, email, and password
   - Start building your CV and exploring jobs!

## 📦 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first styling
- **shadcn/ui** - High-quality accessible components
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library

### Authentication
- **Custom JWT Auth** - Token-based authentication
- **jsonwebtoken** - JWT signing and verification
- **bcryptjs** - Password hashing
- **httpOnly Cookies** - Secure session storage
- **Middleware** - Route protection

### AI & Processing
- **Vercel AI SDK** - AI-powered features
- **OpenAI GPT-4o-mini** - Conversational AI
- **Zod** - Schema validation
- **pdf-parse** - PDF text extraction
- **React PDF** - PDF generation

### Database
- **Prisma** - Type-safe ORM
- **SQLite** - Lightweight database
- **Prisma Studio** - Database GUI

## 🗺️ Application Routes

### Public Routes
- `/` - Homepage
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/jobs` - Browse jobs (public)

### Protected Routes (Requires Authentication)
- `/cv-builder` - AI-powered CV builder
- `/job-matcher` - Job matching with CV upload
- `/my-applications` - Application tracking dashboard
- `/cover-letter` - AI cover letter generator
- `/interview-practice` - AI interview preparation
- `/skill-gap` - Skill gap analysis
- `/upload-cv` - CV upload and analysis

## 🏗️ Architecture

### Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  cvs       CV[]
  savedJobs SavedJob[]
}

model CV {
  // Full CV data with AI analysis
}

model Job {
  // Job listings with detailed information
}

model SavedJob {
  userId    String
  jobId     String
  applied   Boolean
  appliedAt DateTime?
  notes     String?
  // Track saved and applied jobs
}
```

## 📁 Project Structure

```
job-matcher/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── session/         # Get session endpoint
│   │   │   │   ├── signin/          # Sign in endpoint
│   │   │   │   ├── signout/         # Sign out endpoint
│   │   │   │   └── signup/          # User registration
│   │   │   ├── cv/                  # CV-related endpoints
│   │   │   ├── jobs/                # Job endpoints
│   │   │   ├── saved-jobs/          # Saved jobs CRUD
│   │   │   ├── cover-letter/        # Cover letter generation
│   │   │   ├── interview-practice/  # Interview questions
│   │   │   └── skill-gap/           # Skill analysis
│   │   ├── auth/
│   │   │   ├── signin/              # Sign in page
│   │   │   └── signup/              # Sign up page
│   │   ├── cv-builder/              # CV builder interface
│   │   ├── job-matcher/             # Job matching page
│   │   ├── jobs/                    # Job browsing
│   │   ├── my-applications/         # Application dashboard
│   │   ├── cover-letter/            # Cover letter generator
│   │   ├── interview-practice/      # Interview prep
│   │   ├── skill-gap/               # Skill gap analysis
│   │   └── upload-cv/               # CV upload
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── providers/               # AuthProvider wrapper
│   │   └── NavBar.tsx               # Navigation with auth
│   ├── lib/
│   │   ├── ai.ts                    # AI service functions
│   │   ├── auth-context.tsx         # Auth context & hooks
│   │   ├── jwt.ts                   # JWT utilities
│   │   ├── prisma.ts                # Prisma client
│   │   └── utils.ts                 # Utilities
│   └── middleware.ts                # JWT auth middleware
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Sample data
└── .env                             # Environment variables
```

## 🔐 Authentication Flow

1. **Sign Up**: User creates account with email/password
2. **Password Hashing**: Bcrypt hashes password (10 rounds)
3. **Sign In**: Credentials validated against database
4. **JWT Creation**: Secure JWT token generated with jsonwebtoken
5. **Cookie Storage**: Token stored in httpOnly cookie (7-day expiration)
6. **Protected Routes**: Middleware verifies JWT on each request
7. **API Protection**: Session validated on API calls

## 🎯 Key Features Explained

### Application Tracking Dashboard

Track all your job applications in one place:
- **Three Views**: All, Saved, Applied
- **Status Management**: Toggle between saved and applied
- **Notes System**: Add personalized notes for each job
- **Date Tracking**: Automatic application date tracking
- **Quick Actions**: Apply, delete, or update status

### Cover Letter Generator

AI-powered cover letter creation:
1. Select job title and company
2. Paste job description
3. Choose tone (Professional/Enthusiastic/Formal/Creative)
4. AI generates personalized letter using your CV
5. Copy or download for use

### Interview Practice

Prepare for interviews with AI:
1. Enter job details
2. Select difficulty level
3. Get 10-15 tailored questions
4. View tips and relevant CV experience
5. Practice answers with word counter

### Skill Gap Analysis

Identify and prioritize skill development:
1. Analyzes your CV
2. Compares with saved jobs
3. Identifies missing skills
4. Provides learning resources
5. Suggests career development path

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Sessions**: Secure token-based session management
- **httpOnly Cookies**: Prevent XSS attacks on session tokens
- **Input Validation**: Zod schema validation on all endpoints
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in sanitization
- **Secure Headers**: Next.js security headers
- **Token Expiration**: Automatic 7-day session timeout

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Deploy!

### Environment Variables for Production

```env
OPENAI_API_KEY=your_production_key
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out
- `GET /api/auth/session` - Get current session

### Jobs
- `GET /api/jobs` - List jobs with filters
- `POST /api/jobs/match` - Match jobs with CV

### Saved Jobs
- `GET /api/saved-jobs` - Get user's saved jobs
- `POST /api/saved-jobs` - Save a job
- `DELETE /api/saved-jobs` - Unsave a job
- `PATCH /api/saved-jobs/[id]` - Update job status

### AI Features
- `POST /api/cover-letter` - Generate cover letter
- `POST /api/interview-practice` - Generate interview questions
- `POST /api/skill-gap` - Analyze skill gaps

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript checking
```

## 🎓 Usage Guide

### Getting Started

**Quick Start with Demo Account:**
- Email: `john.doe@example.com` or `jane.smith@example.com`
- Password: `password123`
- Demo accounts come pre-loaded from the seed data

**Or Create Your Own Account:**

1. **Sign Up**
   - Navigate to homepage
   - Click "Sign Up"
   - Enter your details
   - Create account

2. **Build Your CV**
   - Go to "Upload CV" or use CV Builder
   - Provide your information
   - Get AI-powered suggestions
   - Download PDF

3. **Browse Jobs**
   - Visit "Jobs" page
   - Use filters to narrow down
   - Save interesting positions

4. **Track Applications**
   - Go to "My Applications"
   - View all saved jobs
   - Mark as applied
   - Add notes

5. **Prepare for Interviews**
   - Use Cover Letter Generator
   - Practice with Interview AI
   - Analyze Skill Gaps

## 💡 Tips for Best Results

- **Complete CV**: Fill in all sections for better job matching
- **Save Jobs**: Bookmark positions you're interested in
- **Use Notes**: Add application deadlines and follow-up dates
- **Practice**: Use interview practice feature before real interviews
- **Skill Development**: Follow skill gap recommendations
- **Customize**: Edit AI-generated content to match your voice

## 🔮 Implemented Features

✅ User Authentication & Authorization
✅ CV Builder with AI
✅ Job Matching Algorithm
✅ Job Browsing & Filtering
✅ Save & Track Applications
✅ Application Dashboard
✅ Cover Letter Generator
✅ Interview Practice AI
✅ Skill Gap Analysis
✅ Protected Routes
✅ Session Management
✅ PDF Generation
✅ Responsive Design

## 🗺️ Roadmap & Future Features

For a comprehensive list of planned features, critical improvements, and the development roadmap, see [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md).

**Highlights from the roadmap:**
- Password reset system
- User profile & settings management
- Enhanced CV management with version history
- Real job data integration from job boards
- Email notifications and job alerts
- Advanced application tracking with interview stages
- Dark mode and multiple CV templates
- Analytics dashboard
- And much more!

## 🆘 Troubleshooting

### Authentication Issues
- **Can't sign in**: Check email/password are correct
- **Session expired**: Sign in again
- **Redirect loops**: Clear cookies and try again

### Database Issues
- **Prisma errors**: Run `npx prisma generate` and `npx prisma db push`
- **Seed fails**: Drop database and re-run seed

### AI Features
- **Slow responses**: AI generation takes 5-30 seconds
- **Failed generation**: Check OpenAI API key and quota
- **Invalid responses**: Retry the request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Built with ❤️ using Next.js, TypeScript, Custom JWT Auth, Vercel AI SDK, and Prisma**

## 📞 Support

For issues or questions:
1. Check this README
2. Review the troubleshooting section
3. Check database schema with `npx prisma studio`
4. Verify environment variables are set correctly
5. Check API logs for detailed error messages
