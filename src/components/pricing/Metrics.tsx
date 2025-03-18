
import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

interface MetricsProps {
  aeCsmName: string | null;
  championName: string | null;
  economicBuyerName: string | null;
  ftes: number | null;
  vacancies: number | null;
  applications: number | null;
  recruitmentMarketingSpend: number | null;
  staffingAgencySpend: number | null;
  sector: string | null;
  onAeCsmNameChange: (value: string) => void;
  onChampionNameChange: (value: string) => void;
  onEconomicBuyerNameChange: (value: string) => void;
  onFtesChange: (value: number | null) => void;
  onVacanciesChange: (value: number | null) => void;
  onApplicationsChange: (value: number | null) => void;
  onRecruitmentMarketingSpendChange: (value: number | null) => void;
  onStaffingAgencySpendChange: (value: number | null) => void;
  onSectorChange: (value: string) => void;
  userName: string;
  annualCost: number;
}

const Metrics = ({
  aeCsmName,
  championName,
  economicBuyerName,
  ftes,
  vacancies,
  applications,
  recruitmentMarketingSpend,
  staffingAgencySpend,
  sector,
  onAeCsmNameChange,
  onChampionNameChange,
  onEconomicBuyerNameChange,
  onFtesChange,
  onVacanciesChange,
  onApplicationsChange,
  onRecruitmentMarketingSpendChange,
  onStaffingAgencySpendChange,
  onSectorChange,
  userName,
  annualCost
}: MetricsProps) => {
  const [localAeCsmName, setLocalAeCsmName] = useState<string>(aeCsmName || '');

  // Set default AE/CSM name to user's name when component mounts or when userName changes
  useEffect(() => {
    if (!localAeCsmName && userName) {
      setLocalAeCsmName(userName);
      onAeCsmNameChange(userName);
    }
  }, [userName, localAeCsmName, onAeCsmNameChange]);

  const handleNumberChange = (value: string, setter: (value: number | null) => void) => {
    if (value === '') {
      setter(null);
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setter(numValue);
      }
    }
  };

  // Calculate cost per metric
  const costPerFte = ftes && ftes > 0 ? annualCost / ftes : null;
  const costPerVacancy = vacancies && vacancies > 0 ? annualCost / vacancies : null;
  const costPerApplication = applications && applications > 0 ? annualCost / applications : null;

  return <Card className="bg-white/50 backdrop-blur-sm border border-[#FF4D00]/10 mb-6">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold font-display tracking-tight mb-4 text-[#FF6D00]">
              Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="ae-csm-name">AE / CSM Name</Label>
                <Input 
                  id="ae-csm-name" 
                  value={localAeCsmName} 
                  onChange={e => {
                    setLocalAeCsmName(e.target.value);
                    onAeCsmNameChange(e.target.value);
                  }} 
                  placeholder="Enter AE/CSM name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="champion-name">Champion:</Label>
                <Input id="champion-name" value={championName || ''} onChange={e => onChampionNameChange(e.target.value)} placeholder="Enter Champion name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="economic-buyer-name">Economic Buyer:</Label>
                <Input id="economic-buyer-name" value={economicBuyerName || ''} onChange={e => onEconomicBuyerNameChange(e.target.value)} placeholder="Enter Economic Buyer name" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="ftes"># FTEs</Label>
                <Input id="ftes" type="number" value={ftes === null ? '' : ftes} onChange={e => handleNumberChange(e.target.value, onFtesChange)} placeholder="Enter number of FTEs" />
                {costPerFte && (
                  <div className="text-xs px-2 py-1 mt-1 bg-[#F3F3F3] text-[#555555] rounded">
                    {formatCurrency(costPerFte)} per FTE
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vacancies"># Vacancies</Label>
                <Input id="vacancies" type="number" value={vacancies === null ? '' : vacancies} onChange={e => handleNumberChange(e.target.value, onVacanciesChange)} placeholder="Enter number of Vacancies" />
                {costPerVacancy && (
                  <div className="text-xs px-2 py-1 mt-1 bg-[#F3F3F3] text-[#555555] rounded">
                    {formatCurrency(costPerVacancy)} per vacancy
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="applications"># Applications</Label>
                <Input id="applications" type="number" value={applications === null ? '' : applications} onChange={e => handleNumberChange(e.target.value, onApplicationsChange)} placeholder="Enter number of Applications" />
                {costPerApplication && (
                  <div className="text-xs px-2 py-1 mt-1 bg-[#F3F3F3] text-[#555555] rounded">
                    {formatCurrency(costPerApplication)} per application
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recruitment-marketing-spend">Recruitment Marketing Spend</Label>
                <Input 
                  id="recruitment-marketing-spend" 
                  type="number" 
                  value={recruitmentMarketingSpend === null ? '' : recruitmentMarketingSpend} 
                  onChange={e => handleNumberChange(e.target.value, onRecruitmentMarketingSpendChange)} 
                  placeholder="Enter marketing spend" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffing-agency-spend">Staffing & Agency Spend</Label>
                <Input 
                  id="staffing-agency-spend" 
                  type="number" 
                  value={staffingAgencySpend === null ? '' : staffingAgencySpend} 
                  onChange={e => handleNumberChange(e.target.value, onStaffingAgencySpendChange)} 
                  placeholder="Enter staffing spend" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input 
                  id="sector" 
                  value={sector || ''} 
                  onChange={e => onSectorChange(e.target.value)} 
                  placeholder="Enter sector" 
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};

export default Metrics;
