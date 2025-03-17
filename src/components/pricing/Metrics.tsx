import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface MetricsProps {
  aeCsmName: string | null;
  championName: string | null;
  economicBuyerName: string | null;
  ftes: number | null;
  vacancies: number | null;
  applications: number | null;
  onAeCsmNameChange: (value: string) => void;
  onChampionNameChange: (value: string) => void;
  onEconomicBuyerNameChange: (value: string) => void;
  onFtesChange: (value: number | null) => void;
  onVacanciesChange: (value: number | null) => void;
  onApplicationsChange: (value: number | null) => void;
  userName: string;
}
const Metrics = ({
  aeCsmName,
  championName,
  economicBuyerName,
  ftes,
  vacancies,
  applications,
  onAeCsmNameChange,
  onChampionNameChange,
  onEconomicBuyerNameChange,
  onFtesChange,
  onVacanciesChange,
  onApplicationsChange,
  userName
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
                <Input id="ae-csm-name" value={localAeCsmName} onChange={e => {
                setLocalAeCsmName(e.target.value);
                onAeCsmNameChange(e.target.value);
              }} placeholder="Enter AE/CSM name" />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ftes"># FTEs</Label>
                <Input id="ftes" type="number" value={ftes === null ? '' : ftes} onChange={e => handleNumberChange(e.target.value, onFtesChange)} placeholder="Enter number of FTEs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vacancies"># Vacancies</Label>
                <Input id="vacancies" type="number" value={vacancies === null ? '' : vacancies} onChange={e => handleNumberChange(e.target.value, onVacanciesChange)} placeholder="Enter number of Vacancies" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applications"># Applications</Label>
                <Input id="applications" type="number" value={applications === null ? '' : applications} onChange={e => handleNumberChange(e.target.value, onApplicationsChange)} placeholder="Enter number of Applications" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default Metrics;