
import { useState, useEffect } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { HoldButton } from "@/components/ui/hold-button";
import { Button } from "@/components/ui/button";
import { FilePlus, FileText, RotateCcw, LogOut, Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/databaseTypes";
import { toast } from "sonner";
import inploiLogo from "@/assets/inploi-logo.png";
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppSidebarProps {
  onSignOut: () => Promise<void>;
  onQuoteSelect: (quoteId: string) => void;
  onCreateNew: () => void;
  onRefreshPricing: () => void;
  profileId: string | null;
}

export function AppSidebar({ 
  onSignOut, 
  onQuoteSelect, 
  onCreateNew, 
  onRefreshPricing,
  profileId 
}: AppSidebarProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profileId) {
      fetchQuotes();
    }
  }, [profileId]);

  const fetchQuotes = async () => {
    if (!profileId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load saved quotes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center mb-6">
          <img src={inploiLogo} alt="inploi logo" className="h-8" />
        </div>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={onCreateNew}
          >
            <FilePlus className="mr-2 h-4 w-4" />
            New Quote
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onRefreshPricing}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Get Latest Pricing
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Saved Quotes
          </h3>
          <ScrollArea className="h-[calc(100vh-280px)]">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : quotes.length > 0 ? (
              <SidebarMenu>
                {quotes.map((quote) => (
                  <SidebarMenuItem key={quote.id}>
                    <SidebarMenuButton 
                      onClick={() => onQuoteSelect(quote.id)}
                      className="w-full justify-start"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{quote.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(quote.updated_at), { addSuffix: true })}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No saved quotes yet
              </div>
            )}
          </ScrollArea>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start mt-2"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
