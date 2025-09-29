# AI-Powered CV Builder & Job Matcher – Product Requirements Document (PRD)

## 1. Product Overview

**Problem:** Many capable youths and early professionals are rejected from job opportunities because they lack the skills to write a professional CV or don’t know how to present their experience.

**Solution:** Build an AI platform that helps users generate a professional CV through a conversational interface, intelligently extract skills, provide improvement suggestions, and match them with suitable job opportunities.

**Vision Statement:**
*A personal AI career assistant for every job seeker — helping them build, improve, and connect their profile to opportunity.*

---

## 2. Target Users

| User Type | Description | Motivations |
|-----------|-------------|-------------|
| Job Seekers (Students, Graduates, Mid-Career) | Struggling to get interviews despite qualifications | Want a presentable CV and job visibility |
| Institutions / NGOs / Universities | Need tools to help youths become employable | Want scalable training + placement support |
| Recruiters / Employers | Want pre-qualified candidates | Want structured profiles |

---

## 3. Core Features (MVP Scope)

### ✅ Phase 1: AI CV Builder

| Feature | Description | Priority |
|---------|-------------|----------|
| Conversational CV Intake | AI chats with user to extract education, experience, skills, projects, and certifications | High |
| Auto CV Formatting | Generate CV in clean modern templates (PDF/HTML export) | High |
| Skill Extraction & Enhancement | AI identifies implicit skills from user responses and recommends improvements | Medium |
| Download & Share | Allow users to download or share CV via link | High |

---

### ✅ Phase 2: Job Matcher (Initial Tier)

| Feature | Description | Priority |
|---------|-------------|----------|
| Basic Job Aggregation | Scrape / Pull job listings from LinkedIn, Local Boards, NGO portals | Medium |
| Rule-based Matching | Match jobs based on user skills + location + education | Medium |
| Job Save / Track | Users can save or mark jobs they applied to | Low |

---

## 4. Optional Future Features

- Cover Letter Generator
- Interview Practice AI
- One-Click Application Submission
- Recruiter Dashboard for Talent Search
- Visa / International CV Format Selector (UK/EU/Canada-compliant)

---

## 5. Success Metrics

| KPI | Target (6 Months Post-Launch) |
|-----|-------------------------------|
| CVs Generated | 10,000+ |
| Monthly Active Users | 3,000+ |
| Job Applications Tracked | 2,000+ |
| CV Improvement Scores | >80% rated "Professional" by recruiters |

---

## 6. Technical Overview

| Component | Suggested Stack |
|-----------|------------------|
| Frontend | SvelteKit / React |
| Backend | Go (Chi/Fiber) or Node (Express) |
| AI Layer | OpenAI / Local LLM w/ Prompt Templates |
| Database | PostgreSQL / SQLite (for MVP) |
| Auth | Email / OAuth (Google) |
| PDF Generation | HTML-to-PDF (Puppeteer / wkhtmltopdf) |

---

## 7. Risks & Constraints

| Risk | Mitigation |
|------|------------|
| Bad CV Output Quality | Iterative improvement with real recruiter feedback |
| Legal Compliance for Job Scraping | Use official APIs or limited scraping with disclaimers |
| Low Initial Job Data | Start manually curating until automation is stable |

---

## 8. Launch Strategy

1. **Soft Launch for CV Builder Only**
2. Test with **200 students / job seekers**
3. Collect **before/after feedback from real recruiters**
4. Integrate **Job Matcher** after enough structured CVs collected

---

**Owner:** *You / Founder*
**Status:** Draft
**Last Updated:** `{{Insert Today’s Date}}`
