# 🏠 EthioDomestic Platform

A modern, full-stack platform designed to revolutionize the domestic worker hiring process in Ethiopia. We connect verified domestic workers (maids, nannies, guards, cooks, drivers, cleaners) with families and employers through a transparent, trust-based system.

## 🌟 Key Features

### For Workers
- **Profile Registration** - Complete profile with emergency contacts, skills, and experience
- **Document Verification** - Upload police clearance, health certificates, and ID documents
- **Trust Score System** - Earn points through verification, references, and employer reviews
- **Job Discovery** - Browse and apply to available positions
- **Application Tracking** - Real-time status updates on job applications
- **In-App Notifications** - Stay informed about applications and approvals

### For Employers
- **Job Posting** - Create detailed job listings with salary ranges and requirements
- **Worker Directory** - Browse verified workers with trust scores
- **Application Management** - Review, shortlist, interview, and hire workers
- **Urgent Hire Badge** - Boost job visibility for immediate needs
- **Review System** - Rate and review hired workers


## 🛠️ Technical Architecture

### Frontend
- **React 18** with modern hooks and context API
- **Custom Design System** - Slate & Indigo theme with physics-based animations
- **Dynamic Components** - Config-driven FormRenderer and TableRenderer
- **State Management** - Context providers for Auth, Config, and Toast notifications
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js & Express** - RESTful API architecture
- **PostgreSQL (Neon)** - Serverless database with automatic scaling
- **JWT Authentication** - Secure token-based auth with refresh tokens
- **Role-Based Access Control** - Worker, Employer, and Admin roles
- **Cloudinary Integration** - Secure file uploads for documents
- **Telegram Bot** - Real-time admin notifications

### Database Design
- **12 Core Tables** - Workers, Employers, Jobs, Applications, Payments, Reviews, etc.
- **Enum Types** - Strict data validation with PostgreSQL enums
- **JSONB Fields** - Flexible storage for trust scores and status history
- **Indexed Queries** - Optimized for performance at scale

### Unique Features
- **Config-Driven Architecture** - All business rules stored in database, changeable at runtime
- **Trust Score Algorithm** - Multi-factor scoring (verification, references, reviews, response rate)
- **Custom Toast System** - Replaces browser alerts with beautiful animated notifications
- **Physics-Based Animations** - Spring and glide easing for premium UX
- **Centralized CSS System** - 16 modular CSS files with design tokens

## 🎯 Business Model

- **Registration Fees**: 200 ETB (workers), 300 ETB (employers)
- **Commission**: 15% from both worker and employer on successful hires
- **Premium Features**: Urgent hire badges, office services
- **Collateral System**: Worker security deposits

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://