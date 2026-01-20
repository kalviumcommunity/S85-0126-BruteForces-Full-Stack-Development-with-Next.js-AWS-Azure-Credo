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

---

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

---

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

---

### ⭐ If you believe trust should be inclusive — Credo is for you.