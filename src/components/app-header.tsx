'use client';

import { GitGraph, Sparkles, Download, Loader, ChevronDown, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

type AppHeaderProps = {
  onEnhance: () => void;
  onExportSVG: () => void;
  onExportPNG: () => void;
  isEnhancing: boolean;
  prompt: string;
  setPrompt: (prompt: string) => void;
};

export function AppHeader({ onEnhance, onExportSVG, onExportPNG, isEnhancing, prompt, setPrompt }: AppHeaderProps) {
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
            <Button disabled={isEnhancing} className="bg-primary hover:bg-primary/90">
                {isEnhancing ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                )}
                {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <div className="p-2">
              <label htmlFor="ai-prompt" className="text-sm font-medium">Instructions</label>
              <Input
                id="ai-prompt"
                placeholder="e.g., Make it colorful"
                className="mt-1"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEnhance}>
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
              <span>Enhance graph</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Wand2 className="mr-2 h-4 w-4 text-accent" />
              <span>Enhance prompt with AI</span>
            </DropdownMenuItem>
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
