# GraphAI

GraphAI is an AI-powered Graphviz editor that allows you to render DOT code and intelligently refine graph aesthetics using generative AI. You can describe the visual changes you want in plain English, and the AI will enhance the graph's styles, colors, and fonts for you.

## Features

- **Real-time DOT Editor**: Write DOT code and see the rendered graph update instantly.
- **AI-Powered Styling**: Use natural language to describe how you want your graph to look. The AI will modify the DOT code to apply colors, fonts, and styles.
- **Export Options**: Export your graph as an SVG or PNG.
- **Shareable Links**: Save your graph and share it with others via a short, unique link.
- **Client-Side Rendering**: Fast and efficient rendering directly in the browser using `@hpcc-js/wasm`.

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd graphai
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

This project uses Firebase for its "Share" functionality. To connect to your Firebase project, you will need to create a local environment file.

1.  Create a file named `.env.local` in the root of your project.
2.  Add your Firebase configuration to this file. It should look something like this:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    ```

**Important**: The `.env.local` file is included in `.gitignore` to ensure you do not accidentally commit your secret keys to source control.

### Running the Development Server

Once you have set up your environment variables, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

- **Frontend**: Built with Next.js and React.
- **UI**: Styled with Tailwind CSS and ShadCN UI components.
- **Graph Rendering**: Uses `@hpcc-js/wasm` for client-side Graphviz rendering.
- **AI Features**: Powered by Genkit and Google's Gemini models.
- **Sharing**: Graph data is stored in Firebase Firestore to generate short, persistent share links.
