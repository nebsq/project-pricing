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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#F97316] font-display tracking-tight">
              <span className="bg-gradient-to-r from-[#F97316] to-[#FF9A3C] bg-clip-text text-transparent">
                pricing calculator
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Pricing Module Selection Area */}
            <div className="md:col-span-8">
              <div className="mb-8">
                <h2 className="text-2xl font-display font-semibold tracking-tight">
                  Create your quote
                  <div className="mt-2 h-1 w-20 bg-gradient-to-r from-[#F97316] to-[#FF9A3C] rounded-full" />
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Select the modules and features you'd like to include
                </p>
              </div>

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
              <div className="sticky top-6">
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
    </>
  )
};

export default Dashboard;
