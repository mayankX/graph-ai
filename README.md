# GraphAI

GraphAI is an AI-powered Graphviz editor that allows you to render DOT code and intelligently refine graph aesthetics using generative AI. You can describe the visual changes you want in plain English, and the AI will enhance the graph's styles, colors, and fonts for you.

![GraphAI Screenshot](https://placehold.co/1200x600?text=GraphAI%20Application%20Screenshot)

## Features

- **Real-time DOT Editor**: Write DOT code and see the rendered graph update instantly in a side-by-side view. Our editor provides syntax highlighting to make your code easy to read and edit.

- **AI-Powered Styling**: Use natural language to describe how you want your graph to look. The AI will modify the DOT code to apply colors, fonts, and styles, turning a simple description into a beautiful visualization.

- **Export Options**: Export your graph as an SVG or PNG to use in your presentations, documents, or websites.

- **Shareable Links**: Save your graph and share it with others via a short, unique link. This makes collaboration and sharing your work effortless.

- **Client-Side Rendering**: Fast and efficient rendering directly in the browser using `@hpcc-js/wasm`, so your graphs render in a snap.

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
2.  Add your Firebase configuration to this file. You can get these values from your Firebase project's settings. It should look something like this:

    ```
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    ```

**Important**: The `.gitignore` file is configured to ignore `.env.local`, so you will not accidentally commit your secret keys to source control. If you have already committed this file, you can remove it from your repository's history by running `git rm --cached .env.local`.

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
