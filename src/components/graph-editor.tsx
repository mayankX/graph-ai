'use client';

import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; 

// Custom DOT language definition for Prism
languages.dot = {
  comment: {
    pattern: /(^|\s)\/\*[\s\S]*?\*\/|\/\/.*/,
    lookbehind: true,
  },
  'graph-type': {
    pattern: /\b(digraph|graph|subgraph)\b/i,
    alias: 'keyword',
  },
  'node-edge-attributes': {
    pattern: /\b(node|edge|graph)\s*\[.*?\]/,
    inside: {
      'attribute-name': {
        pattern: /\b\w+\b(?=\s*=)/,
        alias: 'property',
      },
      'attribute-value': {
        pattern: /"(?:\\.|[^"\\])*"|[\w.-]+/,
        alias: 'string',
      },
      punctuation: /[\[\]=,;]/,
    },
  },
  'edge-op': {
    pattern: /--|->/,
    alias: 'operator',
  },
  'node-id': {
    pattern: /\b\w+\b/,
    alias: 'class-name',
  },
  punctuation: /[{}[\];,]/,
  keyword: /\b(strict)\b/i,
};


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
          }
          .code-editor {
            font-family: 'Fira Code', monospace;
            font-size: 13px;
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
          .token.comment, .token.prolog, .token.doctype, .token.cdata {
            color: hsl(var(--muted-foreground));
          }
          .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted {
            color: #905;
          }
          .token.keyword {
            color: #008080; 
          }
          .token.operator {
            color: #ccff00;
          }
          .token.string {
            color: #690;
          }
          .token.class-name {
            color: hsl(var(--primary-foreground));
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
