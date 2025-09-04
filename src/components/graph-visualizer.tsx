'use client';

import { useState, useEffect, useRef } from 'react';
import { Graphviz } from '@hpcc-js/wasm';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Wind, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from './ui/button';

export type RenderFormat = 'svg' | 'png-image-element' | 'jpeg-image-element' | 'xdot' | 'plain';
const RENDER_FORMATS: RenderFormat[] = ['svg', 'png-image-element', 'jpeg-image-element', 'xdot', 'plain'];

type GraphVisualizerProps = {
  dot: string;
  onSvgChange: (svg: string) => void;
};

export function GraphVisualizer({ dot, onSvgChange }: GraphVisualizerProps) {
  const [output, setOutput] = useState<string | HTMLImageElement>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState<RenderFormat>('svg');

  useEffect(() => {
    const renderGraph = async () => {
      if (!dot.trim()) {
        setOutput('');
        onSvgChange('');
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const graphviz = await Graphviz.load();
        
        if (format === 'svg') {
          const svgString = await graphviz.layout(dot, 'svg', 'dot');
          setOutput(svgString);
          onSvgChange(svgString);
        } else if (format === 'png-image-element' || format === 'jpeg-image-element') {
           const imageElement = await graphviz.layout(dot, format, 'dot');
           setOutput(imageElement);
           // Note: onSvgChange is not called for images.
           onSvgChange('');
        } else {
           const textOutput = await graphviz.layout(dot, format, 'dot');
           setOutput(textOutput);
           onSvgChange(''); // Not an SVG
        }
      } catch (e: any) {
        const errorMessage = e.message || 'An unknown error occurred while rendering the graph.';
        setError(errorMessage.split(';').map((msg:string) => msg.trim()).join('\n'));
        setOutput('');
        onSvgChange('');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(renderGraph, 500); // Debounce input
    return () => clearTimeout(timeoutId);
  }, [dot, onSvgChange, format]);

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="absolute inset-2 rounded-md" />;
    }
    if (error) {
      return (
         <Alert variant="destructive" className="max-w-md bg-destructive/10 border-destructive/30 text-destructive-foreground">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle>Rendering Error</AlertTitle>
            <AlertDescription className='whitespace-pre-wrap'>{error}</AlertDescription>
          </Alert>
      );
    }
    if (!output) {
      return (
        <div className="text-center text-muted-foreground">
          <Wind className="mx-auto h-12 w-12" />
          <p className="mt-4">Enter DOT code in the editor to see your graph.</p>
        </div>
      );
    }
    if (typeof output === 'string' && format === 'svg') {
      return (
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                 <Button variant="outline" size="icon" onClick={() => zoomIn()}><ZoomIn size={16}/></Button>
                 <Button variant="outline" size="icon" onClick={() => zoomOut()}><ZoomOut size={16}/></Button>
                 <Button variant="outline" size="icon" onClick={() => resetTransform()}><RotateCcw size={16}/></Button>
              </div>
              <TransformComponent wrapperClass='w-full h-full' contentClass='w-full h-full'>
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain transition-opacity duration-300 animate-in fade-in"
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      );
    }
    if(typeof output === 'string') {
        return <pre className='whitespace-pre-wrap text-sm text-foreground/80 p-4 w-full h-full overflow-auto'>{output}</pre>
    }
    if (output instanceof HTMLImageElement) {
        return <img src={output.src} alt="graph visualization" className='max-w-full max-h-full object-contain' />;
    }
    return null;
  }

  return (
    <Card className="h-full flex flex-col border-none md:border rounded-lg overflow-hidden">
      <CardHeader className='py-4 px-6 flex-row items-center justify-between'>
        <CardTitle className="text-lg">Graph Visualization</CardTitle>
        <Select value={format} onValueChange={(v) => setFormat(v as RenderFormat)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            {RENDER_FORMATS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-4 bg-muted/10 relative">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
