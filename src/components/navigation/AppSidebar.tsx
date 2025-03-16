
import { useState, useEffect } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { FilePlus, FileText, RotateCcw, LogOut, Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/databaseTypes";
import { toast } from "sonner";
import inploiLogo from "@/assets/inploi-logo.png";
import inploiIcon from "@/assets/lovable-uploads/854e1981-63f6-4d6f-9c0e-2ca57610672e.png";
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
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

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
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center mb-6 justify-center">
          {isCollapsed ? (
            <img src={inploiIcon} alt="inploi icon" className="h-8 w-8" />
          ) : (
            <img src={inploiLogo} alt="inploi logo" className="h-8" />
          )}
        </div>
        <div className="space-y-2">
          <SidebarMenuButton 
            onClick={onCreateNew}
            tooltip="New Quote"
            className="w-full justify-start"
          >
            <FilePlus className="h-4 w-4" />
            <span>New Quote</span>
          </SidebarMenuButton>
          <SidebarMenuButton
            onClick={onRefreshPricing}
            tooltip="Get Latest Pricing"
            className="w-full justify-start"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Get Latest Pricing</span>
          </SidebarMenuButton>
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
                      tooltip={quote.name}
                      className="w-full justify-start"
                    >
                      <FileText className="h-4 w-4" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium truncate w-full max-w-[150px]">{quote.name}</span>
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
        <SidebarMenuButton
          onClick={() => navigate('/')}
          tooltip="Home"
          className="w-full justify-start mb-2"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={onSignOut}
          tooltip="Sign out"
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
