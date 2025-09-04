# Gemini in GraphAI

GraphAI leverages the power of Google's Gemini models through the Genkit framework to provide intelligent features that enhance the user experience. This document outlines how Gemini is integrated into the application.

## Core AI Features

There are two primary AI-driven features in GraphAI:

1.  **AI-Powered Graph Enhancement**: This feature allows users to automatically style their Graphviz DOT code. The AI analyzes the graph structure and applies aesthetic improvements to colors, fonts, and styles based on a user-provided prompt.

2.  **AI-Powered Prompt Enhancement**: To help users get better results from the styling AI, this feature takes a simple user instruction (e.g., "make it look modern") and refines it into a more detailed and effective prompt for the AI.

## How It Works

### Genkit Framework

The backend for the AI features is built with [Genkit](https://firebase.google.com/docs/genkit), an open-source framework from Google designed to streamline the development of AI-powered applications. Genkit is used to define "flows" that orchestrate calls to the Gemini models.

### AI Flows

The core logic is encapsulated in two server-side flows located in `src/ai/flows/`:

1.  **`ai-powered-graph-enhancement.ts`**: This flow takes the user's current DOT code and a styling prompt. It sends this information to the Gemini model with instructions to only modify stylistic attributes (like `color`, `style`, `fontname`) without altering the graph's structure. The model returns the enhanced DOT code and a summary of the changes it made.

2.  **`enhance-prompt-with-ai.ts`**: This flow takes a user's high-level instruction and uses Gemini to expand it into a more descriptive prompt. For example, it can turn "use a dark theme" into a detailed request specifying a dark background, node colors, and a suitable font.

These flows are exposed as server actions in `src/app/actions.ts` and called from the client-side components in `src/app/page.tsx`.