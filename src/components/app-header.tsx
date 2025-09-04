'use client';

import { GitGraph, Sparkles, Download, Loader, ChevronDown, Wand2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

type AppHeaderProps = {
  onEnhance: () => void;
  onEnhancePrompt: () => void;
  onExportSVG: () => void;
  onExportPNG: () => void;
  isEnhancing: boolean;
  isEnhancingPrompt: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onShowSuggestions: () => void;
  hasSuggestions: boolean;
};

export function AppHeader({ 
  onEnhance, 
  onEnhancePrompt,
  onExportSVG, 
  onExportPNG, 
  isEnhancing,
  isEnhancingPrompt,
  prompt, 
  setPrompt,
  onShowSuggestions,
  hasSuggestions
}: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/80 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <GitGraph className="text-primary" size={24} />
        </div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">GraphAI</h1>
      </div>
      <div className="flex items-center gap-2">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={isEnhancing || isEnhancingPrompt} className="bg-primary hover:bg-primary/90 w-48">
                {isEnhancing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                )}
                <span>{isEnhancing ? 'Enhancing...' : 'Enhance with AI'}</span>
                <Separator orientation="vertical" className="h-4 mx-2 bg-primary-foreground/20" />
                <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 p-4">
            <div className="grid gap-2">
              <label htmlFor="ai-prompt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Instructions for AI
              </label>
              <Textarea
                id="ai-prompt"
                placeholder="e.g., Use a dark theme with blue highlights."
                className="min-h-[80px] text-sm"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Describe the visual changes you'd like the AI to make.</p>
            </div>
            <DropdownMenuSeparator className='my-4' />
            <div className="flex flex-col gap-2">
               <Button onClick={onEnhance} disabled={isEnhancing || isEnhancingPrompt} className="w-full">
                {isEnhancing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Enhance Graph
              </Button>
              <Button onClick={onEnhancePrompt} disabled={isEnhancing || isEnhancingPrompt} variant="outline" className="w-full">
                {isEnhancingPrompt ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Enhance Instructions
              </Button>
               {hasSuggestions && (
                <Button onClick={onShowSuggestions} variant="ghost" className="w-full">
                  <Info className="mr-2 h-4 w-4" />
                  Show Last Suggestions
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onExportSVG}>as SVG</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPNG}>as PNG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
