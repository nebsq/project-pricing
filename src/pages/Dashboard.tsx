import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Profile, PricingModule, Quote, QuoteItem } from "@/types/databaseTypes";
import { groupBy } from "@/lib/utils";
import ModuleGroup from "@/components/pricing/ModuleGroup";
import QuoteSummary from "@/components/pricing/QuoteSummary";
import ImplementationSection from "@/components/pricing/ImplementationSection";
import Metrics from "@/components/pricing/Metrics";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import SaveQuoteModal from "@/components/pricing/SaveQuoteModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pricingModules, setPricingModules] = useState<PricingModule[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [implementationFee, setImplementationFee] = useState<number | null>(null);
  const [annualDiscount, setAnnualDiscount] = useState<number | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [pricingRefreshCooldown, setPricingRefreshCooldown] = useState(false);

  const [aeCsmName, setAeCsmName] = useState<string | null>(null);
  const [championName, setChampionName] = useState<string | null>(null);
  const [economicBuyerName, setEconomicBuyerName] = useState<string | null>(null);
  const [ftes, setFtes] = useState<number | null>(null);
  const [vacancies, setVacancies] = useState<number | null>(null);
  const [applications, setApplications] = useState<number | null>(null);

  useEffect(() => {
    checkUser();
    fetchPricingModules();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        const {
          data: profileData,
          error
        } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error.message);
          throw error;
        }
        if (!profileData) {
          const newProfile: Profile = {
            id: user.id,
            full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
            is_admin: false,
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at
          };
          const {
            error: insertError
          } = await supabase.from('profiles').insert(newProfile);
          if (insertError) {
            console.error('Error creating profile:', insertError.message);
            throw insertError;
          }
          setProfile(newProfile);
          toast.success("Profile created successfully");
        } else {
          setProfile(profileData as Profile);
        }
      }
    } catch (error: Error | unknown) {
      console.error('Error checking user:', error instanceof Error ? error.message : 'Unknown error');
      toast.error("Error fetching profile. Please try logging in again.");
      await supabase.auth.signOut();
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingModules = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('pricing_modules').select('*').order('module').order('feature');
      if (error) throw error;
      setPricingModules(data as PricingModule[] || []);
    } catch (error: Error | unknown) {
      console.error('Error fetching pricing modules:', error instanceof Error ? error.message : 'Unknown error');
      toast.error("Failed to load pricing modules");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: quantity
    }));
  };

  const handleImplementationFeeChange = (value: number | null) => {
    setImplementationFee(value);
  };

  const handleAnnualDiscountChange = (value: number | null) => {
    setAnnualDiscount(value);
  };

  const handleSaveClick = () => {
    setSaveModalOpen(true);
  };

  const handleRefreshPricing = async () => {
    if (pricingRefreshCooldown) {
      toast.info("Please wait before refreshing pricing again");
      return;
    }
    setPricingRefreshCooldown(true);
    setTimeout(() => setPricingRefreshCooldown(false), 60000);
    try {
      const {
        error
      } = await supabase.functions.invoke('update-pricing');
      if (error) {
        throw error;
      }
      toast.success("Pricing refresh triggered successfully");
      setTimeout(() => fetchPricingModules(), 2000);
    } catch (error) {
      console.error('Error refreshing pricing:', error);
      toast.error("Failed to refresh pricing");
    }
  };

  const handleSaveQuote = async (name: string) => {
    if (!profile) {
      toast.error("You must be logged in to save quotes");
      return;
    }
    setIsSaving(true);
    try {
      const selectedItems = pricingModules.filter(module => quantities[module.id] && quantities[module.id] > 0);
      if (selectedItems.length === 0) {
        toast.error("Cannot save an empty quote");
        return;
      }
      const quoteData = {
        id: currentQuote?.id,
        profile_id: profile.id,
        name,
        implementation_fee: implementationFee,
        annual_discount: annualDiscount,
        ae_csm_name: aeCsmName,
        champion_name: championName,
        economic_buyer_name: economicBuyerName,
        ftes: ftes,
        vacancies: vacancies,
        applications: applications,
        updated_at: new Date().toISOString()
      };
      
      const {
        data,
        error: quoteError
      } = await supabase.from('quotes').upsert(quoteData, {
        onConflict: 'id'
      }).select();
      
      if (quoteError) throw quoteError;
      let quoteId = currentQuote?.id;
      if (!quoteId && data && data.length > 0) {
        quoteId = data[0].id;
      }
      if (!quoteId) {
        throw new Error("Failed to create quote");
      }
      
      if (currentQuote?.id) {
        const {
          error: deleteError
        } = await supabase.from('quote_items').delete().eq('quote_id', currentQuote.id);
        if (deleteError) throw deleteError;
      }
      
      const quoteItems = selectedItems.map(item => ({
        quote_id: quoteId,
        pricing_module_id: item.id,
        module: item.module,
        feature: item.feature,
        unit: item.unit,
        monthly_price: item.monthly_price,
        quantity: quantities[item.id]
      }));
      
      const {
        error: itemsError
      } = await supabase.from('quote_items').insert(quoteItems);
      if (itemsError) throw itemsError;
      
      setCurrentQuote({
        id: quoteId,
        profile_id: profile.id,
        name,
        implementation_fee: implementationFee,
        annual_discount: annualDiscount,
        ae_csm_name: aeCsmName,
        champion_name: championName,
        economic_buyer_name: economicBuyerName,
        ftes: ftes,
        vacancies: vacancies,
        applications: applications,
        created_at: currentQuote?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      toast.success(`Quote "${name}" saved successfully`);
      setSaveModalOpen(false);
    } catch (error: any) {
      console.error('Error saving quote:', error);
      toast.error(`Failed to save quote: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const loadQuote = async (quoteId: string) => {
    setLoading(true);
    try {
      const {
        data: quoteData,
        error: quoteError
      } = await supabase.from('quotes').select('*').eq('id', quoteId).single();
      if (quoteError) throw quoteError;
      
      const {
        data: itemsData,
        error: itemsError
      } = await supabase.from('quote_items').select('*').eq('quote_id', quoteId);
      if (itemsError) throw itemsError;
      
      setCurrentQuote(quoteData as Quote);
      setImplementationFee(quoteData.implementation_fee);
      setAnnualDiscount(quoteData.annual_discount);
      
      setAeCsmName(quoteData.ae_csm_name);
      setChampionName(quoteData.champion_name);
      setEconomicBuyerName(quoteData.economic_buyer_name);
      setFtes(quoteData.ftes);
      setVacancies(quoteData.vacancies);
      setApplications(quoteData.applications);
      
      const newQuantities: Record<string, number> = {};
      itemsData.forEach((item: QuoteItem) => {
        if (item.pricing_module_id) {
          newQuantities[item.pricing_module_id] = item.quantity;
        }
      });
      setQuantities(newQuantities);
      toast.success(`Quote "${quoteData.name}" loaded`);
    } catch (error) {
      console.error('Error loading quote:', error);
      toast.error("Failed to load quote");
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuote = () => {
    setCurrentQuote(null);
    setQuantities({});
    setImplementationFee(null);
    setAnnualDiscount(null);
    setAeCsmName(null);
    setChampionName(null);
    setEconomicBuyerName(null);
    setFtes(null);
    setVacancies(null);
    setApplications(null);
    toast.success("Started new quote");
  };

  const groupedModules = groupBy(pricingModules, 'module');

  if (loading) {
    return <SidebarProvider>
        <div className="min-h-screen bg-[#F9F8F4] flex">
          <AppSidebar onSignOut={handleSignOut} onQuoteSelect={loadQuote} onCreateNew={handleNewQuote} onRefreshPricing={handleRefreshPricing} profileId={profile?.id || null} />
          <div className="flex-1 p-6 pt-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarProvider>;
  }

  return <SidebarProvider>
      <div className="min-h-screen bg-[#F9F8F4] flex">
        <AppSidebar 
          onSignOut={handleSignOut} 
          onQuoteSelect={loadQuote} 
          onCreateNew={handleNewQuote} 
          onRefreshPricing={handleRefreshPricing} 
          profileId={profile?.id || null} 
        />
        
        <div className="flex-1 p-6 pt-8">
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-[#F97316] font-display tracking-tight">
                <span className="bg-gradient-to-r from-[#F97316] to-[#FF9A3C] bg-clip-text text-transparent">
                  pricing calculator
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-[#FF4D00]/10 p-6 mb-8">
                  <h2 className="text-xl font-semibold font-display tracking-tight mb-4">
                    <span className="bg-gradient-to-r from-[#F97316] to-[#FF9A3C] bg-clip-text text-transparent">
                      About
                    </span>
                  </h2>
                  <p className="text-muted-foreground">
                    This calculator reads the line items and values directly from the 'Pricing' google sheet.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Only items with column <code className="px-1.5 py-0.5 rounded bg-[#FF4D00]/5 text-[#FF4D00] font-mono text-sm font-medium border border-[#FF4D00]/10">release_stage = Available (General)</code> are imported.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Things to do:</strong>
                  </p>
                  
                  <ul className="list-disc list-inside mt-2 text-muted-foreground">
                    <li>Do we want the LINE ITEMS in the quote summary with monthly or annual prices?</li>
                    <li>Enable copying or exporting the "Quote Summary" for use in other docs.</li>
                    <li className="ml-4">Discovery needed - what do we want here? What format is useful? .pdf? Slick copy+paste?</li>
                    <li>🚧 Semi-implemented it anyway. Unclear if pricing versions are required. Needs scoping.</li>
                    <li>✅ Created the ability to name and save quotes. If there was a discrepancy between an already saved quote and the currently available pricing modules it should warn you.</li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="text-2xl font-display font-semibold tracking-tight">
                    {currentQuote ? `Editing: ${currentQuote.name}` : 'Create your quote'}
                    <div className="mt-2 h-1 w-20 bg-gradient-to-r from-[#F97316] to-[#FF9A3C] rounded-full" />
                  </h2>
                </div>

                <Metrics
                  aeCsmName={aeCsmName}
                  championName={championName}
                  economicBuyerName={economicBuyerName}
                  ftes={ftes}
                  vacancies={vacancies}
                  applications={applications}
                  onAeCsmNameChange={setAeCsmName}
                  onChampionNameChange={setChampionName}
                  onEconomicBuyerNameChange={setEconomicBuyerName}
                  onFtesChange={setFtes}
                  onVacanciesChange={setVacancies}
                  onApplicationsChange={setApplications}
                  userName={profile?.full_name || ''}
                />

                <div className="space-y-6">
                  {Object.entries(groupedModules).map(([moduleName, features]) => (
                    <ModuleGroup 
                      key={moduleName} 
                      moduleName={moduleName} 
                      features={features} 
                      quantities={quantities} 
                      onChange={handleQuantityChange} 
                    />
                  ))}
                  
                  <ImplementationSection 
                    implementationFee={implementationFee} 
                    annualDiscount={annualDiscount} 
                    onImplementationFeeChange={handleImplementationFeeChange} 
                    onAnnualDiscountChange={handleAnnualDiscountChange} 
                  />
                </div>
              </div>

              <div className="md:col-span-4">
                <div className="sticky top-8">
                  <QuoteSummary 
                    selectedModules={pricingModules} 
                    quantities={quantities} 
                    implementationFee={implementationFee} 
                    annualDiscount={annualDiscount} 
                    onSaveClick={handleSaveClick} 
                    quoteName={currentQuote?.name} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SaveQuoteModal 
          open={saveModalOpen} 
          onOpenChange={setSaveModalOpen} 
          onSave={handleSaveQuote} 
          isSaving={isSaving} 
        />
      </div>
    </SidebarProvider>;
};

export default Dashboard;
