import { useState, useEffect, useCallback } from 'react';
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
import inploiFullLogo from "@/assets/inploi-full-logo.svg";
import inploiLogomark from "@/assets/inploi-logomark.svg";
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  onSignOut: () => Promise<void>;
  onQuoteSelect: (quoteId: string) => void;
  onCreateNew: () => void;
  onRefreshPricing: () => void;
  profileId: string | null;
  selectedQuoteId?: string; // Add this to track selected quote
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
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const fetchQuotes = useCallback(async () => {
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
  }, [profileId]);

  useEffect(() => {
    if (profileId) {
      fetchQuotes();
    }
  }, [profileId, fetchQuotes]);

  const buttonStyles = cn(
    "w-full justify-start",
    "bg-background/40",
    "transition-all duration-75", // Faster transition for snappier feel
    "relative group", // Add group for hover effects
    "border-l-2 border-transparent",
    "data-[active=true]:bg-orange-50/30 dark:data-[active=true]:bg-orange-950/10", // Subtle active state
    "data-[active=true]:border-orange-500/50", // Soft border for active state
    "hover:bg-orange-50/20 dark:hover:bg-orange-950/10", // Soft tangerine background
    "hover:border-orange-500/30", // Softer border on hover
    "rounded-r-md",
    // Remove the underline effect for cleaner look
    "[&>svg]:transition-colors [&>svg]:duration-75", // Smooth icon color transition
    "group-hover:[&>svg]:text-orange-600/70" // Icon color on hover
  );

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center mb-6 justify-center">
          {isCollapsed ? (
            <img 
              src={inploiLogomark} 
              alt="inploi" 
              className="h-8 w-8" 
              // Remove imageRendering and transform-gpu as SVGs scale perfectly
            />
          ) : (
            <img 
              src={inploiFullLogo} 
              alt="inploi" 
              className="h-8"
            />
          )}
        </div>
        <div className="space-y-2">
          <SidebarMenuButton 
            onClick={onCreateNew}
            tooltip="New Quote"
            className={buttonStyles}
          >
            <FilePlus className="h-4 w-4 text-muted-foreground" /> {/* Base icon color */}
            {!isCollapsed && <span>New Quote</span>}
          </SidebarMenuButton>
          <SidebarMenuButton
            onClick={onRefreshPricing}
            tooltip="Get Latest Pricing"
            className={buttonStyles}
          >
            <RotateCcw className="h-4 w-4" />
            {!isCollapsed && <span>Get Latest Pricing</span>}
          </SidebarMenuButton>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="px-4 py-2">
          {!isCollapsed && (
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Saved Quotes
            </h3>
          )}
          <ScrollArea className="h-[calc(100vh-280px)]">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : quotes.length > 0 ? (
              <SidebarMenu>
                {quotes.map((quote) => (
                  <SidebarMenuItem key={quote.id}>
                    <SidebarMenuButton 
                      onClick={() => {
                        onQuoteSelect(quote.id);
                        setSelectedQuoteId(quote.id);
                      }}
                      tooltip={quote.name}
                      className={buttonStyles}
                      isActive={selectedQuoteId === quote.id} // Add selected state
                    >
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      {!isCollapsed && (
                        <div className="flex flex-col items-start">
                          <span className="font-medium truncate w-full max-w-[150px]">{quote.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(quote.updated_at), { addSuffix: true })}
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              !isCollapsed && (
                <div className="text-center py-4 text-muted-foreground">
                  No saved quotes yet
                </div>
              )
            )}
          </ScrollArea>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenuButton
          onClick={() => navigate('/')}
          tooltip="Home"
          className={buttonStyles}
        >
          <Home className="h-4 w-4" />
          {!isCollapsed && <span>Home</span>}
        </SidebarMenuButton>
        <SidebarMenuButton
          onClick={onSignOut}
          tooltip="Sign out"
          className={buttonStyles}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sign out</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
