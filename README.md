# 🚀 Credo

### Lightweight Digital Credibility for Small Businesses

Credo is a **trust-first digital credibility platform** designed for small-scale entrepreneurs who lack access to traditional verification systems. Instead of forcing heavy KYC or document-based onboarding, Credo enables **organic trust-building** through community validation, reputation signals, and consistent behavior.

> **Trust is earned over time — not forced upfront.**

---

## 🧠 Problem Statement

Small businesses such as **street vendors, freelancers, and micro-entrepreneurs** often struggle with:

* ❌ No verified digital identity
* ❌ Customer trust issues
* ❌ Exclusion due to heavy KYC requirements
* ❌ No simple way to prove authenticity online

### ❓ Core Question

**How can we establish trust without intimidating or excluding users?**

## 💡 Solution Overview

Credo introduces a **low-friction credibility layer** that allows businesses to:

* Onboard with **minimal details**
* Build reputation **gradually over time**
* Gain trust through **real interactions & endorsements**
* Share a **public credibility profile**

Credo replaces paperwork-based verification with **behavior-based trust**.

---

## ✨ Key Features

### 🔐 Low-Friction Onboarding

* No document uploads
* No long verification queues

### 🪪 Credibility Profiles

* Public, shareable profiles
* Displays trust signals and activity

### 🌐 Community-Based Validation

* Reviews
* Endorsements
* Interaction history

### 📈 Credo Score

* Dynamic reputation score
* Based on behavior, not documents

### 🧩 Scalable & Inclusive

* Built for local vendors
* Ideal for freelancers and early-stage entrepreneurs

---

## 🏗️ High-Level Workflow

1. User signs up with minimal information
2. Credo profile is created
3. Trust signals are collected:

   * Reviews
   * Endorsements
   * Activity consistency
4. Credo Score improves over time
5. Profile can be shared publicly via:

   * Link
   * QR Code


## 🛠️ Tech Stack

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | Next.js (App Router), TypeScript |
| Backend  | Next.js API Routes               |
| Database | PostgreSQL                       |
| ORM      | Prisma                           |
| Auth     | Lightweight identity (Non-KYC)   |
| Tooling  | ESLint, Prettier, Husky          |

---

## 🗄️ Database Schema

### (PostgreSQL + Prisma)

### 📦 Core Entities

* **User**
* **Business**
* **Review**
* **Endorsement**

### 🔗 Relationships

* One **User → Many Businesses**
* One **Business → Many Reviews**
* One **Business → Many Endorsements**

### 🔐 Constraints

* Unique email per user
* Review rating constrained between **1–5**
* `ON DELETE CASCADE` for relational cleanup
* Indexed foreign keys for performance

### 🧮 Normalization

* Follows **1NF, 2NF, 3NF**
* No redundant or derived fields
* Clear ownership of attributes

---

## 🔗 RESTful API Design

### (Next.js App Router)

Credo follows REST principles using **file-based routing** under `app/api/`.

### 📂 Folder Structure

```
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
```

---

## 📡 API Endpoints

### 👤 Users

| Method | Endpoint   | Description       |
| ------ | ---------- | ----------------- |
| GET    | /api/users | Get all users     |
| POST   | /api/users | Create a new user |

### 🏢 Businesses

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | /api/businesses     | Get all businesses |
| POST   | /api/businesses     | Create a business  |
| GET    | /api/businesses/:id | Get business by ID |
| PUT    | /api/businesses/:id | Update business    |
| DELETE | /api/businesses/:id | Delete business    |

### ⭐ Reviews

| Method | Endpoint     | Description   |
| ------ | ------------ | ------------- |
| POST   | /api/reviews | Add review    |
| GET    | /api/reviews | Fetch reviews |

### 🤝 Endorsements

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| POST   | /api/endorsements | Endorse a business |

---

## 🧪 Example API Usage

### GET Users

```bash
curl -X GET http://localhost:3000/api/users
```

### POST User

```bash
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"Alice","email":"alice@example.com"}'
```

---

## 📄 Pagination Example

```ts
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
```

---

## ⚠️ Error Handling & Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 400  | Bad Request           |
| 404  | Not Found             |
| 500  | Internal Server Error |

```ts
if (!business) {
  return NextResponse.json(
    { error: "Business not found" },
    { status: 404 }
  );
}
```

---

## 🌐 Global API Response Handler

### ✅ Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { "id": 1, "name": "Alice" },
  "timestamp": "2023-10-27T10:00:00Z"
}
```

### ❌ Error Response

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

---

## 🛡️ Input Validation with Zod

All `POST` and `PUT` API routes use **Zod** for strict input validation.

### 📁 Schemas (`src/lib/schemas/`)

* **User Schema** → name, email, age
* **Task Schema** → title, completion status
* **Project Schema** → project title
* **Auth Schema** → login & signup credentials

---

## 👥 Team

* **Vansh Thapar**
* **Rishiraj Singh**
* **Moksh Sharma**

---

## 🌱 Vision

Credo aims to become a **universal trust layer** for the informal economy — empowering millions of small businesses to establish credibility, unlock opportunities, and grow without exclusion.


In this lesson, you’ll learn how to build authorization middleware to protect routes based on user roles and active sessions in your Next.js application. While authentication verifies who the user is, authorization ensures what that user is allowed to do - forming the foundation of Role-Based Access Control (RBAC) in modern web apps.

By the end of this lesson, you’ll have a reusable middleware that validates JWTs, checks user roles, and enforces the principle of least privilege across your API routes.

Please note that you may build your project based on your own customisations, but follow this structure for uniformity.

1. Understanding Authentication vs Authorization
Before diving into code, let’s clarify these concepts again:

Concept	Description	Example
Authentication	Confirms who the user is.	User logs in with valid credentials.
Authorization	Determines what actions they can perform.	Only admins can delete users.
In this lesson, we’ll focus on authorization, building middleware that protects routes according to role and session validity.

2. Setting Up User Roles
Start by defining user roles in your database model. If you’re using Prisma, modify your User model as follows:

model User {
  id       Int     @id @default(autoincrement())
  name     String
  email    String  @unique
  password String
  role     String  @default("user") // e.g., "admin", "user"
}
This allows the backend to assign different permissions based on roles.

3. Designing Middleware Folder Structure
Inside your Next.js app/ directory, create a middleware file at the root level:

app/
 ├── api/
 │    ├── auth/
 │    ├── users/
 │    └── admin/
 ├── middleware.ts
This middleware will intercept all incoming requests and validate authorization before routing them.

4. Implementing Authorization Middleware
Create the file app/middleware.ts with the following logic:

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect specific routes
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/users")) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ success: false, message: "Token missing" }, { status: 401 });
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);

      // Role-based access control
      if (pathname.startsWith("/api/admin") && decoded.role !== "admin") {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
      }

      // Attach user info for downstream handlers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 403 });
    }
  }

  return NextResponse.next();
}
Key Idea: This middleware intercepts requests, validates the JWT, and restricts access based on user role — ensuring secure, consistent checks across all routes.

5. Example: Protected Admin Route
File: app/api/admin/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, message: "Welcome Admin! You have full access." });
}
File: app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, message: "User route accessible to all authenticated users." });
}
6. Testing Role-Based Access
Admin Access
curl -X GET http://localhost:3000/api/admin \
-H "Authorization: Bearer <ADMIN_JWT>"
Response: { "success": true, "message": "Welcome Admin! You have full access." }

Regular User Access
curl -X GET http://localhost:3000/api/admin \
-H "Authorization: Bearer <USER_JWT>"
Response: { "success": false, "message": "Access denied" }

7. Reflect and Document in README
Your README.md should include:

Clear diagram or flow showing how middleware intercepts requests and enforces role-based rules.

Sample allowed vs denied logs from Postman.

Explanation of:

JWT verification in middleware.
Role-based logic for admin/user.
Least privilege principle — users should only have access to necessary routes.
How future roles (e.g., editor, moderator) can be easily added.
Deliverables
Reusable middleware that validates JWTs and enforces RBAC across routes.

At least two protected routes: one general (/api/users), one admin-only (/api/admin).

A documented README containing:

Middleware logic overview.
Role checks and access outcomes.
Screenshots/logs of successful and failed access attempts.
Reflection on least-privilege and role extensibility.
Pro Tip: “Authorization isn’t just about blocking users — it’s about designing trust boundaries that scale with your application’s growth.”
---High-level idea

Middleware acts like a security checkpoint that every request must pass before it reaches your API routes.

Instead of checking permissions inside every route, you:

Centralize security

Apply rules consistently

Avoid duplicated logic



### ⭐ If you believe trust should be inclusive — Credo is for you.

## 🚀 Redis Caching Layer

Credo integrates **Redis** as a caching layer to improve API performance and reduce database load for frequently accessed data.

### 🔁 Cache Strategy (Cache-Aside Pattern)

Credo uses the **cache-aside (lazy loading)** strategy:

1. API checks Redis cache first
2. If cache hit → data is returned instantly
3. If cache miss → data is fetched from PostgreSQL using Prisma
4. The result is stored in Redis for subsequent requests

This ensures optimal performance while keeping the database load minimal.

---

### ⏳ TTL (Time-To-Live) Policy

Cached data is stored with a TTL of **60 seconds**:

```ts
await redis.set("users:list", JSON.stringify(users), "EX", 60);



# 🌍 Global State Management

This project demonstrates Global State management using React Context API and Custom Hooks in Next.js.

## 🏗 Architecture
We use a **Provider Pattern** to wrap the application and **Custom Hooks** to consume state.

### File Structure
* `context/`: Contains the Context definitions and Providers (`AuthContext`, `UIContext`).
* `hooks/`: Custom hooks (`useAuth`, `useUI`) that wrap `useContext` for cleaner access.
* `app/layout.tsx`: Root layout that nests the providers.

### 🔄 State Flow
1. **AuthContext**: Manages `user` object and `login`/`logout` functions.
2. **UIContext**: Manages `theme` (light/dark) and `sidebar` visibility.
3. **Consumers**: Components use `useAuth()` to get the current user or `useUI()` to toggle themes.

## 🚀 How to Test
1. **Login**: Click "Login as Student". The status changes to "AUTHENTICATED" and the user name appears. Check console for `✅ User logged in`.
2. **Theme**: Click "Switch to Dark". The entire background turns dark slate.
3. **Sidebar**: Toggle the switch. The state updates to "Open/Closed".

## 🧠 Reflection
* **Scalability**: Using Context avoids "prop-drilling" (passing data through 5+ layers of components).
* **Performance**: We split `Auth` and `UI` into separate contexts. This ensures that updating the *Sidebar* does not trigger a re-render in components that only care about the *User*.  
* 
* # Credo - Responsive & Themed Design Assignment

## 🎨 Tailwind Configuration Summary
I have configured Tailwind to support a custom design system and dark mode switching.

### Custom Breakpoints
| Breakpoint | Width  | Usage |
|:----------:|:------:|:----- |
| `sm`       | 640px  | Mobile landscape |
| `md`       | 768px  | Tablets (Grid changes to 2 columns) |
| `lg`       | 1024px | Laptops (Grid changes to 3 columns) |
| `xl`       | 1280px | Large Desktops |

### Theme Tokens (Brand Colors)
| Token Name      | Hex Code  | Visual |
|:---------------|:---------:|:------:|
| `brand-light`   | `#93C5FD` | Light Blue |
| `brand-DEFAULT` | `#3B82F6` | Primary Blue |
| `brand-dark`    | `#1E40AF` | Deep Blue |

## 📱 Responsiveness Evidence
- **Mobile:** Single column layout, larger touch targets.
- **Tablet:** 2-column grid, adjusted padding.
- **Desktop:** 3-column grid, expansive hero section.

## 🌗 Theme Reflection & Accessibility
- **Contrast:** I utilized `slate-950` for dark mode backgrounds and `gray-50` for light mode to ensure text remains readable. High contrast colors (Yellow/Green) were used for ratings/scores.
- **Toggle:** Implemented using `localStorage` persistence so the user's preference is remembered.
- **Challenges:** Balancing the "Cyber-Punk" aesthetic of the original dark mode with a clean, professional light mode required careful use of CSS variables in `globals.css`.

## 🚀 How to Run
1. `npm install`
2. `npx prisma generate`
3. `npm run dev`


## 📝 Form Handling with React Hook Form & Zod

I have implemented a robust form validation system that ensures data integrity and user feedback.

### 1. Architecture
* **Library:** `react-hook-form` manages form state to minimize re-renders (unlike `useState` which re-renders on every keystroke).
* **Validation:** `zod` defines the schema. If requirements change (e.g., password length), I update it in **one place** (`signupSchema.ts`).
* **Integration:** `@hookform/resolvers` connects Zod to the form hook.

### 2. Component Structure
* `schemas/signupSchema.ts`: Defines rules (min length, regex for passwords).
* `components/FormInput.tsx`: A reusable wrapper that handles labels, inputs, and error display logic.
* `app/signup/page.tsx`: The main page that composes the form.

### 3. Reflection
Using **Zod** separates validation logic from UI code. In a large app, this means I can reuse the exact same schema for **Backend API validation** and **Frontend Form validation**, ensuring total consistency across the stack.



## 🛡️ Input Sanitization & OWASP Compliance

I have implemented security utilities to prevent Cross-Site Scripting (XSS) and SQL Injection.

### 1. Implementation
* **Library:** `sanitize-html` removes unsafe HTML tags from user input.
* **Utility:** `src/lib/sanitize.ts` serves as a centralized cleaner function.
* **Flow:** Input -> API -> `sanitizeInput()` -> Database.

### 2. XSS Prevention Example
* **Attack:** `<script>alert('Hacked')</script>`
* **Result:** `""` (Empty string, script removed)
* **Attack:** `<b>Hello</b>`
* **Result:** `Hello` (Tags stripped, text preserved)

### 3. SQL Injection (SQLi)
* **Strategy:** I use **Prisma ORM**.
* **Why it works:** Prisma uses **Parameterized Queries** by default. It treats user input as data, not executable code.
* **Example:** `db.users.findFirst({ where: { name: req.body.name } })` is safe even if `name` contains `' OR 1=1`.

### 4. Reflection
Sanitization is critical because "Trusting User Input" is the #1 vulnerability in web apps. By enforcing cleaning at the API entry point, we protect both the database integrity and frontend users from malicious scripts.

## ⚡ Error & Loading States

I have implemented advanced UX patterns to handle asynchronous data states gracefully.

### 1. Loading UI (`loading.tsx`)
* **Purpose:** Prevents "Layout Shift" and blank screens while data fetches.
* **Implementation:** Uses a Skeleton Loader with Tailwind's `animate-pulse` to mimic the shape of the final content.
* **Location:** `src/app/dashboard/loading.tsx`

### 2. Error Boundary (`error.tsx`)
* **Purpose:** Catches runtime errors preventing the entire app from crashing (White Screen of Death).
* **Implementation:** A Client Component that catches errors and provides a `reset()` button to attempt recovery without a full page reload.
* **Location:** `src/app/dashboard/error.tsx`

### 3. Resilience Strategy
By using these Next.js file conventions, the app is resilient. Even if the Dashboard crashes, the Navigation bar and Sidebar (defined in `layout.tsx`) remain interactive, allowing the user to navigate away.

