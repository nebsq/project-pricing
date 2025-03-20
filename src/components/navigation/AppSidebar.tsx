import { useState, useEffect, useCallback, useRef } from 'react';
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

const PRICING_UPDATE_DISABLED = true; // Toggle this to enable/disable the feature

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
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
        .eq('profile_id', profileId)
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
    "transition-all duration-75",
    "relative group",
    "border-l-2 border-transparent",
    "data-[active=true]:bg-orange-50/30 dark:data-[active=true]:bg-orange-950/10",
    "data-[active=true]:border-orange-500/50",
    "hover:bg-orange-50/20 dark:hover:bg-orange-950/10",
    "hover:border-orange-500/30",
    "rounded-r-md",
    "[&>svg]:transition-colors [&>svg]:duration-75",
    "group-hover:[&>svg]:text-orange-600/70"
  );

  const startHolding = () => {
    if (isDisabled) return;
    
    setIsHolding(true);
    setProgress(0);

    holdTimerRef.current = setTimeout(async () => {
      await onRefreshPricing();
      resetButton();
      setIsDisabled(true);
      setTimeout(() => setIsDisabled(false), 60000);
    }, 3000);

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / 30), 100));
    }, 100);
  };

  const resetButton = () => {
    setIsHolding(false);
    setProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center mb-6 justify-center">
          {isCollapsed ? (
            <img 
              src={inploiLogomark} 
              alt="inploi" 
              className="h-7 w-7 object-contain" 
            />
          ) : (
            <img 
              src={inploiFullLogo} 
              alt="inploi" 
              className="h-8 w-auto" 
            />
          )}
        </div>
        <div className="space-y-2">
          <SidebarMenuButton 
            onClick={onCreateNew}
            tooltip="New Quote"
            className={buttonStyles}
          >
            <FilePlus className="h-4 w-4 text-muted-foreground" />
            {!isCollapsed && <span>New Quote</span>}
          </SidebarMenuButton>
          
          <SidebarMenuButton
            onClick={() => {}}
            onMouseDown={PRICING_UPDATE_DISABLED ? undefined : startHolding}
            onMouseUp={PRICING_UPDATE_DISABLED ? undefined : resetButton}
            onMouseLeave={PRICING_UPDATE_DISABLED ? undefined : resetButton}
            onTouchStart={PRICING_UPDATE_DISABLED ? undefined : startHolding}
            onTouchEnd={PRICING_UPDATE_DISABLED ? undefined : resetButton}
            disabled={PRICING_UPDATE_DISABLED || isDisabled}
            tooltip={PRICING_UPDATE_DISABLED ? "Temporarily unavailable" : isDisabled ? "Please wait 1 minute" : "Hold to update pricing"}
            className={cn(
              buttonStyles,
              "relative overflow-hidden",
              (PRICING_UPDATE_DISABLED || isDisabled) && "opacity-50 cursor-not-allowed"
            )}
          >
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            {!isCollapsed && (
              <span>
                {PRICING_UPDATE_DISABLED 
                  ? "Updates paused"
                  : isDisabled
                  ? "Please wait 1 minute"
                  : isHolding
                  ? "Hold to confirm..."
                  : "Get Latest Pricing"}
              </span>
            )}
            {isHolding && !PRICING_UPDATE_DISABLED && (
              <div 
                className="absolute inset-0 bg-orange-500/10 transition-transform duration-[3000ms] ease-linear origin-left"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            )}
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
                      isActive={selectedQuoteId === quote.id}
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
