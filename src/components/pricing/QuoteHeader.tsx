
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";

interface QuoteHeaderProps {
  currentQuoteName: string | null;
  draftQuoteName: string;
  setDraftQuoteName: (name: string) => void;
  isNew: boolean;
}

const QuoteHeader = ({ 
  currentQuoteName, 
  draftQuoteName, 
  setDraftQuoteName,
  isNew
}: QuoteHeaderProps) => {
  const [isEditingQuoteName, setIsEditingQuoteName] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">
          {isNew ? 'Create your quote' : `Editing: ${currentQuoteName}`}
        </h2>
        <button 
          onClick={() => setIsEditingQuoteName(!isEditingQuoteName)}
          className="text-[#FF6D00] hover:text-[#FF8C33] transition-colors"
          title="Edit quote name"
        >
          <Pencil size={16} />
        </button>
      </div>
      {isEditingQuoteName && (
        <div className="mt-2 mb-4">
          <Input
            value={draftQuoteName}
            onChange={(e) => setDraftQuoteName(e.target.value)}
            placeholder="Enter quote name"
            className="max-w-md"
          />
          <p className="text-xs text-muted-foreground mt-1">
            The name will be applied when you save the quote.
          </p>
        </div>
      )}
      <div className="mt-2 h-1 w-20 bg-gradient-to-r from-[#F97316] to-[#FF9A3C] rounded-full" />
    </div>
  );
};

export default QuoteHeader;
