'use client';

import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type GraphEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function GraphEditor({ value, onChange }: GraphEditorProps) {
  return (
    <Card className="h-full flex flex-col border-none md:border rounded-lg overflow-hidden">
      <CardHeader className='py-4 px-6'>
        <CardTitle className="text-lg">DOT Code Editor</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="absolute top-0 left-0 w-full h-full">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter DOT code here..."
            className="h-full min-h-full w-full resize-none bg-background md:bg-card font-code text-[13px] leading-relaxed rounded-none border-0 border-t border-border/80 focus-visible:ring-0 focus-visible:ring-offset-0 p-4"
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
