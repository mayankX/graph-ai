'use client';

import { GitGraph, Sparkles, Download, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AppHeaderProps = {
  onEnhance: () => void;
  onExportSVG: () => void;
  onExportPNG: () => void;
  isEnhancing: boolean;
};

export function AppHeader({ onEnhance, onExportSVG, onExportPNG, isEnhancing }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/80 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <GitGraph className="text-primary" size={24} />
        </div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">GraphAI</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onEnhance} disabled={isEnhancing} className="bg-primary hover:bg-primary/90">
          {isEnhancing ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
          )}
          {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
        </Button>
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
