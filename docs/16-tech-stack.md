---

title: Farisium Tech Stack
version: 1.0
status: Official
last_updated: 2026-06-28
------------------------

# Farisium Tech Stack

> This document is the official source of truth for the technology stack used across the Farisium ecosystem.
>
> If any AI model generates information that conflicts with this document, **this document always takes precedence**.

---

# Core Philosophy

Farisium is designed with the following principles:

* Simplicity over complexity
* Serverless-first architecture
* Modular development
* SEO-first platform
* Single domain ecosystem
* Cost efficiency
* High performance
* Easy maintenance
* Long-term scalability

Do not replace documented technologies with generic alternatives unless explicitly requested.

---

# Frontend

## Framework

* Next.js (App Router)

## Language

* TypeScript

## Library

* React

## Styling

* Tailwind CSS

## Icons

* Lucide React

## Animation

Use only when necessary:

* Framer Motion

---

# Backend

Farisium uses **Firebase** as the official backend.

Official services:

* Firebase Authentication
* Cloud Firestore
* Firebase Storage
* Firebase Cloud Functions (only when required)

Do **not** introduce:

* Express.js
* NestJS
* Laravel
* Django
* Custom REST backend

unless explicitly requested.

---

# Database

Official database:

* Cloud Firestore

Firestore stores:

* Users
* AI usage
* FRSC balance
* Rewards
* Transactions
* Partnerships
* Application settings

SQL databases are **not** part of the default architecture.

---

# Authentication

Official authentication:

* Firebase Authentication

Supported providers:

* Google Sign-In
* Email & Password

Additional providers may be added in the future.

---

# Storage

Official storage:

* Firebase Storage

Used for:

* Generated AI images
* Uploaded files
* User avatars
* Static assets
* Reward images

---

# AI Infrastructure

Farisium supports multiple AI providers depending on the tool.

Possible providers include:

* Opencode
* Ollama
* Qwen3.5 and Qwen2.5 Coder
* Stable Diffusion WebUI
* ComfyUI

Different AI tools may use different providers.

Do not assume that every AI tool uses the same model.

---

# Deployment

## Official Production Environment

Hosting:

* Vercel (Hosting & CDN)
* Terintegrasi langsung dengan GitHub

Application:

* Next.js (non-standalone)
* Node.js

Deployment flow:

* Push commit ke branch utama (main)
* Vercel otomatis build dan deploy (auto-deploy)

The official deployment target is **Vercel with GitHub integration**.

Do not assume cPanel/PM2 or manual upload is used.

---

# Payments

## Indonesia

* KlikQRIS

## Global

* NOWPayments

Payments should use webhook-based integration.

---

# Project Structure

The Farisium ecosystem is built under a single primary domain.

```
/
Homepage

/blog
SEO Articles

/ai
All AI Tools

/rewards
Reward Center

/frsc
Farisium Coin

/partnership
Partnership Program

/dashboard
User Dashboard
```

AI tools should be located under:

```
/ai/*
```

Examples:

```
/ai/anime-generator

/ai/product-photo

/ai/logo-generator

/ai/subtitle-generator

/ai/blog-writer
```

Avoid creating separate subdomains for each AI tool unless there is a specific technical requirement.

---

# UI Design

Design language:

* Premium
* Modern
* Dark Theme
* Glassmorphism
* Liquid Glass
* Spacious Layout
* Soft Glow
* Smooth Animation

User experience should prioritize simplicity and readability.

---

# Development Standards

Preferred:

* App Router
* Server Components
* TypeScript
* Reusable Components
* Modular Architecture
* Clean Folder Structure

Avoid unnecessary dependencies.

Avoid duplicated code.

---

# SEO Strategy

SEO is a core part of the platform.

All AI tools should contribute to:

* Organic traffic
* Internal linking
* Google indexing
* Google AdSense

The blog supports SEO and drives users toward AI tools.

The AI tools support user retention and FRSC usage.

---

# Monetization

Primary monetization:

* Google AdSense
* FRSC ecosystem
* AI tools
* Partnership
* Premium services

The platform should be designed to maximize long-term sustainable revenue instead of relying on a single income source.

---

# Technologies Not Used by Default

Unless explicitly approved, do not assume Farisium uses:

* Express.js
* NestJS
* Laravel
* Django
* MongoDB
* PostgreSQL
* MySQL
* Vercel
* AWS
* Azure
* Supabase

These technologies may be evaluated in the future but are **not part of the official stack**.

---

## AI Development Stack

### AI Orchestrator

- OpenCode

### Local LLM Runtime

- Ollama

### Architect Model

- qwen3.5:9b

Digunakan untuk:

- Project Planning
- Software Architecture
- Refactoring Strategy
- Documentation
- Technical Analysis

### Coding Model

- qwen2.5-coder:7b

Digunakan untuk:

- Coding
- Debugging
- Refactoring
- Unit Testing
- Code Generation

### Embedding

- nomic-embed-text

Digunakan untuk:

- RAG
- Semantic Search
- Documentation Retrieval


# AI Assistant Rules

When generating code or documentation for Farisium:

* Follow this technology stack.
* Never replace Firebase with another backend.
* Never replace Firestore with another database.
* Assume Vercel deployment with GitHub integration (auto-deploy on push to main); do not assume cPanel/PM2/manual upload.
* Keep all AI tools within the `/ai/*` route.
* Follow the single-domain architecture.
* If information is missing, state that it is not documented instead of making assumptions.
