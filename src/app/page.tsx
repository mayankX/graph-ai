'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { GraphEditor } from '@/components/graph-editor';
import { GraphVisualizer, type RenderFormat } from '@/components/graph-visualizer';
import { enhanceGraphAction, enhancePromptAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { compressString, decompressString } from '@/lib/utils';

const defaultDotCode = `digraph G {
  bgcolor="transparent";
  node [fontname="Inter", style="filled,rounded", fillcolor="#3a3a3a", fontcolor="#f0f0f0", color="#008080", shape=box];
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

function PageContent() {
  const searchParams = useSearchParams();
  const [dotCode, setDotCode] = useState<string>(defaultDotCode);
  const [previousDotCode, setPreviousDotCode] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [suggestions, setSuggestions] = useState<string>('');
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const svgContentRef = useRef<string>('');
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('Use a vibrant and modern color palette.');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      const decodeAndSetCode = async () => {
        try {
          const decodedCode = await decompressString(codeFromUrl);
          setDotCode(decodedCode);
        } catch (error) {
          console.error("Failed to decode DOT code from URL:", error);
          toast({
            variant: 'destructive',
            title: 'Invalid Share Link',
            description: 'The provided link contains invalid graph data.',
          });
        }
      };
      decodeAndSetCode();
    }
  }, [searchParams, toast]);

  const handleEnhance = useCallback(async () => {
    if (!dotCode.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Editor',
        description: 'Cannot enhance an empty graph. Please enter some DOT code.',
      });
      return;
    }
    
    setPreviousDotCode(dotCode);
    setIsEnhancing(true);
    const result = await enhanceGraphAction({ dotCode, prompt });
    setIsEnhancing(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'AI Enhancement Failed',
        description: result.error,
      });
      setPreviousDotCode(null);
    } else if (result.data) {
      const originalCode = dotCode;
      setDotCode(result.data.enhancedDotCode);
      setSuggestions(result.data.suggestions);
      toast({
        title: 'Graph Enhanced!',
        description: 'AI suggestions have been applied. You can undo this change.',
        action: (
          <Button variant="outline" size="sm" onClick={() => {
            setDotCode(originalCode);
            toast({ title: 'Undo Successful', description: 'The graph has been reverted.' });
          }}>
            Undo
          </Button>
        ),
      });
    }
  }, [dotCode, prompt, toast]);

  const handleEnhancePrompt = useCallback(async () => {
    setIsEnhancingPrompt(true);
    const result = await enhancePromptAction({ prompt });
    setIsEnhancingPrompt(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Prompt Enhancement Failed',
        description: result.error,
      });
    } else if (result.data) {
      setPrompt(result.data.enhancedPrompt);
      toast({
        title: 'Prompt Enhanced!',
        description: 'The AI has refined your instructions.',
      });
    }
  }, [prompt, toast]);

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const isDataUrl = content.startsWith('data:');
    const url = isDataUrl ? content : URL.createObjectURL(new Blob([content], { type: mimeType }));
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (!isDataUrl) {
      URL.revokeObjectURL(url);
    }
  };
  
  const handleShare = useCallback(async () => {
    const encodedCode = await compressString(dotCode);
    const url = `${window.location.origin}${window.location.pathname}?code=${encodedCode}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link Copied!',
        description: 'A shareable link has been copied to your clipboard.',
      });
    }, (err) => {
      toast({
        variant: 'destructive',
        title: 'Failed to Copy',
        description: 'Could not copy the link to your clipboard.',
      });
      console.error('Failed to copy share link: ', err);
    });
  }, [dotCode, toast]);

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
      const widthAttr = svgElement?.getAttribute('width');
      const heightAttr = svgElement?.getAttribute('height');
      
      const viewBox = svgElement?.getAttribute('viewBox')?.split(' ');
      const vbWidth = viewBox ? parseFloat(viewBox[2]) : 1024;
      const vbHeight = viewBox ? parseFloat(viewBox[3]) : 768;

      const width = widthAttr ? parseFloat(widthAttr) : vbWidth;
      const height = heightAttr ? parseFloat(heightAttr) : vbHeight;

      const scale = 2; 
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
  
  if (!isMounted) {
    return null; 
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader 
        onEnhance={handleEnhance}
        onEnhancePrompt={handleEnhancePrompt}
        onExportSVG={handleExportSVG}
        onExportPNG={handleExportPNG}
        onShare={handleShare}
        isEnhancing={isEnhancing}
        isEnhancingPrompt={isEnhancingPrompt}
        prompt={prompt}
        setPrompt={setPrompt}
        onShowSuggestions={() => setSuggestions && setIsSuggestionOpen(true)}
        hasSuggestions={!!suggestions}
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


export default function Home() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </React.Suspense>
  );
}
