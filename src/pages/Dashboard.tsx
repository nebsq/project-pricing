
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Profile, PricingModule } from "@/types/databaseTypes";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [csvData, setCsvData] = useState('');
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pricingModules, setPricingModules] = useState<PricingModule[]>([]);

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

      // Use type assertion to bypass the type checking for the 'profiles' table
      const { data, error } = await (supabase
        .from('profiles') as any)
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
      // Use type assertion to bypass the type checking for the 'pricing_modules' table
      const { data, error } = await (supabase
        .from('pricing_modules') as any)
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

  const handleUploadCSV = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSV data",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${window.location.origin}/functions/v1/csv-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: csvData
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Unknown error occurred');
      }
      
      toast({
        title: "Success",
        description: `${result.count} pricing modules imported successfully.`
      });
      
      setCsvData('');
      fetchPricingModules();
    } catch (error: any) {
      console.error('Error uploading CSV:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
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
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pricing Calculator Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
      </div>

      <div className="grid gap-6">
        {profile?.is_admin && (
          <Card>
            <CardHeader>
              <CardTitle>Import Pricing Modules (Admin Only)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste CSV data here: module,feature,unit,monthly_price,increment,release_stage"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  rows={6}
                />
                <Button 
                  onClick={handleUploadCSV}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload CSV'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Pricing Modules</CardTitle>
          </CardHeader>
          <CardContent>
            {pricingModules.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Feature</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Increment</TableHead>
                      <TableHead>Release Stage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingModules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell>{module.module}</TableCell>
                        <TableCell>{module.feature}</TableCell>
                        <TableCell>{module.unit}</TableCell>
                        <TableCell>${module.monthly_price.toFixed(2)}</TableCell>
                        <TableCell>{module.increment}</TableCell>
                        <TableCell>{module.release_stage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No pricing modules found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
