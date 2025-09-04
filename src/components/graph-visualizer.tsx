'use client';

import { useState, useEffect, useRef } from 'react';
import { Graphviz } from '@hpcc-js/wasm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Wind } from 'lucide-react';

type GraphVisualizerProps = {
  dot: string;
  onSvgChange: (svg: string) => void;
};

export function GraphVisualizer({ dot, onSvgChange }: GraphVisualizerProps) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const renderGraph = async () => {
      if (!dot.trim()) {
        setSvg('');
        onSvgChange('');
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        // Ensure wasm is loaded. This can be slow on first load.
        const graphviz = await Graphviz.load();
        const svgString = await graphviz.layout(dot, 'svg', 'dot');
        setSvg(svgString);
        onSvgChange(svgString);
      } catch (e: any) {
        const errorMessage = e.message || 'An unknown error occurred while rendering the graph.';
        setError(errorMessage.split(';').map((msg:string) => msg.trim()).join('\n'));
        setSvg('');
        onSvgChange('');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(renderGraph, 500); // Debounce input
    return () => clearTimeout(timeoutId);
  }, [dot, onSvgChange]);

  return (
    <Card className="h-full flex flex-col border-none md:border rounded-lg overflow-hidden">
      <CardHeader className='py-4 px-6'>
        <CardTitle className="text-lg">Graph Visualization</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-4 bg-muted/10 relative">
        {loading && <Skeleton className="absolute inset-2 rounded-md" />}
        
        {!loading && error && (
          <Alert variant="destructive" className="max-w-md bg-destructive/10 border-destructive/30 text-destructive-foreground">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle>Rendering Error</AlertTitle>
            <AlertDescription className='whitespace-pre-wrap'>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && !svg && (
          <div className="text-center text-muted-foreground">
            <Wind className="mx-auto h-12 w-12" />
            <p className="mt-4">Enter DOT code in the editor to see your graph.</p>
          </div>
        )}

        {!loading && !error && svg && (
          <div
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain transition-opacity duration-300 animate-in fade-in"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </CardContent>
    </Card>
  );
}
