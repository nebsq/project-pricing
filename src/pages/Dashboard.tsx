import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Profile, PricingModule } from "@/types/databaseTypes";
import { groupBy } from "@/lib/utils";
import ModuleGroup from "@/components/pricing/ModuleGroup";
import QuoteSummary from "@/components/pricing/QuoteSummary";
import ImplementationSection from "@/components/pricing/ImplementationSection";
import { DashboardNav } from "@/components/navigation/DashboardNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pricingModules, setPricingModules] = useState<PricingModule[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [implementationFee, setImplementationFee] = useState<number | null>(null);
  const [annualDiscount, setAnnualDiscount] = useState<number | null>(null);

  useEffect(() => {
    checkUser();
    fetchPricingModules();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      } else {
        setProfile(user);
      }
    } catch (error: any) {
      console.error('Error checking user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingModules = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_modules')
        .select('*')
        .order('module')
        .order('feature');

      if (error) throw error;
      setPricingModules(data as PricingModule[] || []);
    } catch (error: any) {
      console.error('Error fetching pricing modules:', error.message);
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

  const groupedModules = groupBy(pricingModules, 'module');

  if (loading) {
    return (
      <>
        <DashboardNav onSignOut={handleSignOut} />
        <div className="container mx-auto p-6 max-w-7xl pt-20">
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
      </>
    )
  }

  return (
    <>
      <DashboardNav onSignOut={handleSignOut} />
      <div className="min-h-screen bg-[#F9F8F4]">
        <div className="container mx-auto p-6 max-w-7xl pt-20">
          <div className="space-y-6">
            {/* Title Section */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-[#F97316] font-display tracking-tight">
                <span className="bg-gradient-to-r from-[#F97316] to-[#FF9A3C] bg-clip-text text-transparent">
                  pricing calculator
                </span>
              </h1>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8">
                {/* About Section */}
                <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-[#FF4D00]/10 p-6 mb-8">
                  <h2 className="text-lg font-semibold text-[#FF4D00]/90 mb-2">
                    About
                  </h2>
                  <p className="text-muted-foreground">
                    This calculator reads the line items and values directly from the 'Pricing' google sheet.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Only items with <strong>release_stage = Available (General) </strong>are imported.
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Things to do:</strong>
                    <ul className="list-disc list-inside mt-2">
                      <li>Enable saving quotes so they are not lost.</li>
                      <li>Enable copying or exporting the "Quote Summary" for use in other docs.</li>
                      <ul className="list-disc list-inside ml-4">
                        <li>Discovery needed - what do we want here? What format is useful? .pdf? Slick copy+paste?</li>
                      </ul>
                      <li>Unclear if pricing versions are required. Needs scoping.</li>
                      <li>More to come?</li>
                    </ul>
                  </p>
                </div>

                {/* Create Quote Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-semibold tracking-tight">
                    Create your quote
                    <div className="mt-2 h-1 w-20 bg-gradient-to-r from-[#F97316] to-[#FF9A3C] rounded-full" />
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Select the modules and features you'd like to include
                  </p>
                </div>

                {/* Module Groups */}
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
                  
                  {/* Implementation & Others Section */}
                  <ImplementationSection 
                    implementationFee={implementationFee}
                    annualDiscount={annualDiscount}
                    onImplementationFeeChange={handleImplementationFeeChange}
                    onAnnualDiscountChange={handleAnnualDiscountChange}
                  />
                </div>
              </div>

              {/* Quote Summary */}
              <div className="md:col-span-4">
                <div className="sticky top-24">
                  <QuoteSummary
                    selectedModules={pricingModules}
                    quantities={quantities}
                    implementationFee={implementationFee}
                    annualDiscount={annualDiscount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default Dashboard;
