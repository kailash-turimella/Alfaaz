# Alfaaz

A Duolingo-style Hindi learning web app built with React, Vite, and Tailwind CSS.

## Features

- **5 exercise types** — flashcards, multiple choice, fill in the blank, match pairs, and conversation practice
- **16 lessons across 2 sets** — Set 1 covers vocabulary and everyday phrases; Set 2 covers grammar
- **3-heart lives system** with retry on failure
- **XP and streak tracking** persisted per user in localStorage
- **Audio pronunciation** via Google Cloud Text-to-Speech (Neural2 Hindi voice), with browser TTS fallback
- **Per-user progress** — username-based login, each user's progress stored separately
- **Review mode** — replay completed lesson flashcards any time
- **Back/forward navigation** within a lesson

## Tech Stack

- React 18 + React Router v6
- Vite
- Tailwind CSS
- Google Cloud Text-to-Speech API

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Google Cloud TTS (optional but recommended)

Create a `.env.local` file in the project root:

```
VITE_GOOGLE_TTS_KEY=your_google_cloud_api_key
```

To get an API key:
1. Enable the **Cloud Text-to-Speech API** in Google Cloud Console
2. Create an API key under **APIs & Services → Credentials**

Without this key the app falls back to the browser's built-in speech synthesis.

### 3. Run locally

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Project Structure

```
public/content/       # Lesson JSON files
src/
  components/         # Shared UI components and exercise types
  context/            # React context (progress state)
  hooks/              # useContent, useAudio
  pages/              # Home, Lesson, Review, LoginScreen
```

## Adding Lessons

Add a new entry to `public/content/index.json` and create a matching `public/content/<id>.json` file. Supported exercise types: `flashcard`, `multiple_choice`, `fill_in_blank`, `match_pairs`, `conversation`.
