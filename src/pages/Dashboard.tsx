
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Profile, PricingModule } from "@/types/databaseTypes";
import { groupBy } from "@/lib/utils";
import ModuleGroup from "@/components/pricing/ModuleGroup";
import QuoteSummary from "@/components/pricing/QuoteSummary";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pricingModules, setPricingModules] = useState<PricingModule[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    checkUser();
    fetchPricingModules();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
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
      toast({
        title: "Error",
        description: "Failed to load pricing modules.",
        variant: "destructive"
      });
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

  // Group modules by module name
  const groupedModules = groupBy(pricingModules, 'module');

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
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
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F4]">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#F97316]">inploi Pricing Calculator</h1>
          <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Pricing Module Selection Area */}
          <div className="md:col-span-8">
            <Card className="mb-6 shadow-sm border-none bg-transparent">
              <CardHeader className="pb-2 px-0">
                <CardTitle className="text-2xl font-bold text-gray-800">Create Your Quote</CardTitle>
              </CardHeader>
            </Card>
            
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
            </div>
          </div>

          {/* Quote Summary */}
          <div className="md:col-span-4">
            <div className="sticky top-6">
              <QuoteSummary
                selectedModules={pricingModules}
                quantities={quantities}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
