
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaveQuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  isSaving: boolean;
  initialName?: string;
}

export default function SaveQuoteModal({ 
  open, 
  onOpenChange, 
  onSave, 
  isSaving,
  initialName = ''
}: SaveQuoteModalProps) {
  const [quoteName, setQuoteName] = useState('');
  
  useEffect(() => {
    if (open && initialName) {
      setQuoteName(initialName);
    }
  }, [open, initialName]);
  
  const handleSave = () => {
    if (quoteName.trim()) {
      onSave(quoteName.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#FF6D00]">Save Quote</DialogTitle>
          <DialogDescription>
            Give your quote a name to save it for future reference.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="quote-name">Quote Name</Label>
          <Input
            id="quote-name"
            value={quoteName}
            onChange={(e) => setQuoteName(e.target.value)}
            placeholder="e.g., My Quote - June 2023"
            className="mt-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !quoteName.trim()}
            variant="default"
            className="bg-[#FF6D00] hover:bg-[#FF8C33]"
          >
            {isSaving ? 'Saving...' : 'Save Quote'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
