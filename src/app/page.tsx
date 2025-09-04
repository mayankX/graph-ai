'use client';

import { useState, useRef, useCallback } from 'react';
import { AppHeader } from '@/components/app-header';
import { GraphEditor } from '@/components/graph-editor';
import { GraphVisualizer } from '@/components/graph-visualizer';
import { enhanceGraphAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const defaultDotCode = `digraph G {
  bgcolor="transparent";
  node [fontname="Inter", style="filled", fillcolor="#3a3a3a", fontcolor="#f0f0f0", color="#008080", shape=box, rounded=true];
  edge [fontname="Inter", color="#008080", fontcolor="#f0f0f0"];

  subgraph cluster_0 {
    style="filled,rounded";
    color="#282828";
    label = "Process A";

    a0 [label="Start"];
    a1 [label="Step 1"];
    a2 [label="Step 2"];
    a3 [label="End"];
    a0 -> a1 -> a2 -> a3;
  }

  subgraph cluster_1 {
    style="filled,rounded";
    color="#282828";
    label = "Process B";
    
    b0 [label="Start"];
    b1 [label="Step 1"];
    b2 [label="Step 2"];
    b3 [label="End"];
    b0 -> b1 -> b2 -> b3;
  }

  start [label="App Start", shape=Mdiamond, fillcolor="#008080"];
  end [label="App End", shape=Msquare, fillcolor="#008080"];

  start -> a0;
  start -> b0;
  a1 -> b2;
  b1 -> a3;
  a3 -> end;
  b3 -> end;
}`;

export default function Home() {
  const [dotCode, setDotCode] = useState<string>(defaultDotCode);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [suggestions, setSuggestions] = useState<string>('');
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const svgContentRef = useRef<string>('');
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');

  const handleEnhance = useCallback(async () => {
    if (!dotCode.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Editor',
        description: 'Cannot enhance an empty graph. Please enter some DOT code.',
      });
      return;
    }
    setIsEnhancing(true);
    const result = await enhanceGraphAction({ dotCode });
    setIsEnhancing(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'AI Enhancement Failed',
        description: result.error,
      });
    } else if (result.data) {
      setDotCode(result.data.enhancedDotCode);
      setSuggestions(result.data.suggestions);
      setIsSuggestionOpen(true);
      toast({
        title: 'Graph Enhanced!',
        description: 'AI suggestions have been applied to your graph.',
      });
    }
  }, [dotCode, toast]);

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportSVG = useCallback(() => {
    if (!svgContentRef.current) {
        toast({ variant: 'destructive', title: 'Error', description: 'No graph to export. The visualizer is empty.' });
        return;
    }
    downloadFile('graph.svg', svgContentRef.current, 'image/svg+xml');
  }, [toast]);
  
  const handleExportPNG = useCallback(() => {
    if (!svgContentRef.current) {
      toast({ variant: 'destructive', title: 'Error', description: 'No graph to export. The visualizer is empty.' });
      return;
    }

    const svgString = svgContentRef.current;
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      const svgElement = new DOMParser().parseFromString(svgString, 'image/svg+xml').querySelector('svg');
      const width = svgElement?.width.baseVal.value ?? 1024;
      const height = svgElement?.height.baseVal.value ?? 768;

      const scale = 2; // For higher resolution
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, width, height);
        const pngUrl = canvas.toDataURL('image/png');
        downloadFile('graph.png', pngUrl, 'image/png');
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load SVG for PNG conversion.' });
        URL.revokeObjectURL(url);
    }
    img.src = url;
  }, [toast]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader 
        onEnhance={handleEnhance}
        onExportSVG={handleExportSVG}
        onExportPNG={handleExportPNG}
        isEnhancing={isEnhancing}
        prompt={prompt}
        setPrompt={setPrompt}
      />
      <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4 overflow-hidden">
        <GraphEditor value={dotCode} onChange={setDotCode} />
        <GraphVisualizer 
          dot={dotCode} 
          onSvgChange={(svg) => (svgContentRef.current = svg)}
        />
      </main>
      <AlertDialog open={isSuggestionOpen} onOpenChange={setIsSuggestionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI Suggestions for Improvement</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-wrap text-foreground/80 max-h-[50vh] overflow-y-auto">
              {suggestions}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSuggestionOpen(false)}>
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
