# 🛡️ Project Credo

### Digital Identity for Local Heroes

Small-scale entrepreneurs form the backbone of local economies, yet millions lack a **formal digital identity**.
**Credo** bridges this gap by creating **trust through community**, not paperwork.

We replace traditional KYC with **Proof of Activity** — verified by peers, transactions, and physical presence.

---

## 📊 The Concept: Social & Transactional KYC

Traditional KYC systems rely on:

* Government-issued IDs
* Lengthy approval processes
* Centralized authorities

This creates friction for the **“missing middle”** — informal but legitimate businesses.

### 🔁 Credo’s Alternative

Instead of plastic IDs, Credo uses:

* **Peer vouching**
* **Location verification**
* **Community reputation**

Trust is **earned**, **visible**, and **progressive**.

---

## 🏗️ Technical Architecture

Credo is built using a **modern, serverless, real-time stack** optimized for performance, scalability, and security.

| Layer    | Technology              | Purpose                                   |
| -------- | ----------------------- | ----------------------------------------- |
| Frontend | Next.js 15 (App Router) | SEO-friendly public profiles & dashboard  |
| Database | PostgreSQL (Supabase)   | Relational storage for profiles & vouches |
| ORM      | Prisma                  | Type-safe database queries                |
| Auth     | Supabase Auth           | Secure merchant onboarding                |
| Scanner  | html5-qrcode            | Mobile-first physical verification        |

---

## ⚖️ TrustScore Algorithm

The **TrustScore** is the core of Credo’s identity system.
It is a **weighted reputation score** built from community actions.

### 🧮 Scoring Rules

* **Vouch from Basic Merchant** → `+10 points`
* **Vouch from Verified Merchant** → `+50 points`
* **Location-Verified Vouch** → `1.5× multiplier`
  *(using browser Geolocation API)*

Scores update in real time and directly affect merchant visibility and status.

---

## 🏷️ Achievement Tiers

Merchants progress through tiers as trust grows.

| Tier | Name           | Points Range | Description         |
| ---- | -------------- | ------------ | ------------------- |
| 🟤   | Basic Tier     | 0 – 100      | Unverified merchant |
| 🥈   | Community Tier | 101 – 500    | Vouched by 3+ peers |
| 🥇   | Verified Tier  | 500+         | High-trust merchant |

Tier status is **publicly visible** on profiles.

---

## 🚀 Getting Started

### 1️⃣ Setup Environment

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_postgresql_url
```

---

### 2️⃣ Initialize Database

```bash
npm install
npx prisma generate
npx prisma db push
```

---

### 3️⃣ Run Development

```bash
npm run dev
```

App runs on:

```
http://localhost:3000
```

---

## 🛠️ Key Features Built

✅ **Dynamic QR Generation**
Every business receives a unique, printable Credo Identity Card.

✅ **Real-Time Scanner**
Merchants can vouch for each other via mobile camera.

✅ **Public Trust Profiles**
Shareable links like:

```
/p/jakes-coffee
```

✅ **Secure Middleware**
Protected dashboard access for registered entrepreneurs only.

---

## 🛤️ Future Roadmap

* [ ] AI Storefront Analysis – Verify legitimacy via photo analysis
* [ ] Micro-Lending Integration – Connect verified merchants to lenders
* [ ] Batch Vouching – Verify entire marketplaces or shop clusters

---

## 💡 Vision

Credo is not just KYC.

It is a **community-powered trust layer** that unlocks:

* Financial access
* Digital presence
* Economic credibility

Built **by the community, for the community**.

---

## 📜 License

MIT License
