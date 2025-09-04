'use client';

import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; 

// Custom DOT language definition for Prism
if (languages && !languages.dot) {
  languages.dot = {
    'comment': {
      pattern: /(^|\s)\/\*[\s\S]*?\*\/|\/\/.*/,
      lookbehind: true,
    },
    'graph-type': {
      pattern: /\b(digraph|graph|subgraph|strict)\b/i,
      alias: 'keyword',
    },
    'node-edge-graph-keyword': {
      pattern: /\b(node|edge|graph)\b/,
      alias: 'keyword'
    },
    'attribute-id': {
      pattern: /[a-zA-Z_]\w*(?=\s*=)/,
      alias: 'property',
    },
    'attribute-value': [
      {
        pattern: /"(?:\\.|[^"\\])*"/,
        alias: 'string',
      },
      {
        pattern: /<[^>]*>/, // HTML-like labels
        alias: 'string',
      },
      {
        pattern: /[-+]?\b\d+(?:\.\d+)?\b/,
        alias: 'number',
      },
      {
        pattern: /\b\w+\b/,
        alias: 'string',
      }
    ],
    'edge-op': {
      pattern: /--|->/,
      alias: 'operator',
    },
    'node-id': {
      pattern: /(?!\b(digraph|graph|subgraph|strict|node|edge)\b)\b[a-zA-Z_]\w*\b/,
      alias: 'class-name',
    },
    'punctuation': /[{}[\];,=]/,
  };
}


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type GraphEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function GraphEditor({ value, onChange }: GraphEditorProps) {
  const highlightCode = (code: string) =>
    highlight(code, languages.dot, 'dot')
      .split('\n')
      .map((line, i) => `<span class='editor-line-number'>${i + 1}</span>${line}`)
      .join('\n');

  return (
    <Card className="h-full flex flex-col border-none md:border rounded-lg overflow-hidden">
      <CardHeader className='py-4 px-6 flex-shrink-0'>
        <CardTitle className="text-lg">DOT Code Editor</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <style jsx global>{`
          .code-editor-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
            background-color: hsl(var(--card));
            color: #ccc;
          }
          .code-editor {
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            line-height: 1.6;
            min-height: 100%;
          }
          .code-editor textarea:focus {
            outline: none;
          }
          .code-editor .editor-line-number {
            display: inline-block;
            width: 2.5em;
            padding-right: 1em;
            user-select: none;
            text-align: right;
            color: hsl(var(--muted-foreground) / 0.5);
          }
          .token.comment, 
          .token.prolog, 
          .token.doctype, 
          .token.cdata {
            color: #6a9955;
          }
          .token.punctuation {
            color: #d4d4d4;
          }
          .token.property, 
          .token.tag, 
          .token.boolean, 
          .token.constant, 
          .token.symbol,
          .token.deleted {
            color: #9cdcfe;
          }
          .token.number {
            color: #b5cea8;
          }
          .token.selector, 
          .token.attr-name, 
          .token.char, 
          .token.builtin, 
          .token.inserted {
            color: #ce9178;
          }
           .token.string {
            color: #ce9178;
          }
          .token.operator, 
          .token.entity, 
          .token.url, 
          .language-css .token.string, 
          .style .token.string {
            color: #d4d4d4;
          }
          .token.atrule, 
          .token.attr-value, 
          .token.keyword {
            color: #c586c0;
          }
          .token.function,
          .token.class-name {
            color: #4ec9b0;
          }
          .token.regex,
          .token.important, 
          .token.variable {
            color: #d16969;
          }
        `}</style>
        <div className="code-editor-wrapper">
          <Editor
            value={value}
            onValueChange={onChange}
            highlight={highlightCode}
            padding={16}
            className="code-editor"
            textareaClassName="focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
