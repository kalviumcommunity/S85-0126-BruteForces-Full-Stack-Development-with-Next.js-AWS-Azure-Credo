🚀 Credo

Lightweight Digital Credibility for Small Businesses

Credo is a trust-first platform designed to help small-scale entrepreneurs establish digital credibility without heavy KYC friction. Instead of forcing document-based verification, Credo enables trust to grow organically through community validation, reputation signals, and consistent behavior.

🧠 Problem Statement

Small businesses such as street vendors, freelancers, and micro-entrepreneurs often face:

❌ No verified digital identity

❌ Customer trust issues

❌ Exclusion due to heavy KYC requirements

❌ No simple way to prove authenticity online

Credo answers one question:

How can we establish trust without intimidating or excluding users?

💡 Solution Overview

Credo introduces a low-friction credibility layer that allows businesses to:

Onboard with minimal details

Build reputation gradually

Gain trust through interactions and endorsements

Share a public credibility profile

Trust is earned over time, not forced upfront.

✨ Key Features

🔐 Low-Friction Onboarding
No document uploads or long verification queues

🪪 Credibility Profiles
Public profiles displaying trust signals

🌐 Community-Based Validation
Reviews, endorsements, and interactions increase trust

📈 Credo Score
A dynamic reputation score based on behavior, not paperwork

🧩 Scalable & Inclusive
Built for local vendors, freelancers, and early-stage entrepreneurs

🏗️ High-Level Workflow

User signs up with minimal information

A Credo profile is created

Trust signals are collected:

Reviews

Endorsements

Activity consistency

Credo Score improves over time

Profile can be shared publicly via link or QR

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js (App Router), TypeScript
Backend	Next.js API Routes
Database	PostgreSQL
ORM	Prisma
Auth	Lightweight identity (non-KYC)
Tooling	ESLint, Prettier, Husky
🗄️ Database Schema (PostgreSQL + Prisma)
Core Entities

User

Business

Review

Endorsement

Relationships

One User → Many Businesses

One Business → Many Reviews

One Business → Many Endorsements

Constraints

Unique email per user

Review rating constrained between 1–5

ON DELETE CASCADE for relational cleanup

Indexed foreign keys for performance

Normalization

Follows 1NF, 2NF, 3NF

No redundant or derived fields

Clear ownership of attributes

🔗 RESTful API Design (Next.js App Router)

Credo uses file-based routing under app/api/, following REST principles.

📂 Folder Structure
app/
 └── api/
     ├── users/
     │   └── route.ts
     ├── businesses/
     │   ├── route.ts
     │   └── [id]/
     │       └── route.ts
     ├── reviews/
     │   └── route.ts
     └── endorsements/
         └── route.ts

📡 API Endpoints
Users
Method	Endpoint	Description
GET	/api/users	Get all users
POST	/api/users	Create a new user
Businesses
Method	Endpoint	Description
GET	/api/businesses	Get all businesses
POST	/api/businesses	Create a business
GET	/api/businesses/:id	Get business by ID
PUT	/api/businesses/:id	Update business
DELETE	/api/businesses/:id	Delete business
Reviews
Method	Endpoint	Description
POST	/api/reviews	Add review to a business
GET	/api/reviews	Fetch reviews
Endorsements
Method	Endpoint	Description
POST	/api/endorsements	Endorse a business
🧪 Example API Usage
GET Users
curl -X GET http://localhost:3000/api/users

POST User
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"alice@example.com"}'

📄 Pagination Example
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  return NextResponse.json({
    page,
    limit,
    data: []
  });
}

⚠️ Error Handling & Status Codes
Code	Meaning
200	OK
201	Created
400	Bad Request
404	Not Found
500	Internal Server Error
if (!business) {
  return NextResponse.json(
    { error: "Business not found" },
    { status: 404 }
  );
}

## 🌐 Global API Response Handler

I have implemented a unified response structure to ensure consistency across all API endpoints.

### 1. Response Envelope Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { "id": 1, "name": "Alice" },
  "timestamp": "2023-10-27T10:00:00Z"
}