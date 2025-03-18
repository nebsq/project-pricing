
import { useState } from 'react';
import { Profile, PricingModule, Quote } from "@/types/databaseTypes";
import { groupBy } from "@/lib/utils";
import ModuleGroup from "@/components/pricing/ModuleGroup";
import QuoteSummary from "@/components/pricing/QuoteSummary";
import ImplementationSection from "@/components/pricing/ImplementationSection";
import Metrics from "@/components/pricing/Metrics";
import QuoteHeader from "@/components/pricing/QuoteHeader";
import AboutSection from "@/components/pricing/AboutSection";

interface DashboardContentProps {
  profile: Profile;
  pricingModules: PricingModule[];
  quantities: Record<string, number>;
  implementationFee: number | null;
  annualDiscount: number | null;
  aeCsmName: string | null;
  championName: string | null;
  economicBuyerName: string | null;
  ftes: number | null;
  vacancies: number | null;
  applications: number | null;
  recruitmentMarketingSpend: number | null;
  staffingAgencySpend: number | null;
  sector: string | null;
  currentQuote: Quote | null;
  draftQuoteName: string;
  onQuantityChange: (id: string, quantity: number) => void;
  onImplementationFeeChange: (value: number | null) => void;
  onAnnualDiscountChange: (value: number | null) => void;
  onAeCsmNameChange: (value: string) => void;
  onChampionNameChange: (value: string) => void;
  onEconomicBuyerNameChange: (value: string) => void;
  onFtesChange: (value: number | null) => void;
  onVacanciesChange: (value: number | null) => void;
  onApplicationsChange: (value: number | null) => void;
  onRecruitmentMarketingSpendChange: (value: number | null) => void;
  onStaffingAgencySpendChange: (value: number | null) => void;
  onSectorChange: (value: string) => void;
  onDraftQuoteNameChange: (value: string) => void;
  onSaveClick: () => void;
}

const DashboardContent = ({
  profile,
  pricingModules,
  quantities,
  implementationFee,
  annualDiscount,
  aeCsmName,
  championName,
  economicBuyerName,
  ftes,
  vacancies,
  applications,
  recruitmentMarketingSpend,
  staffingAgencySpend,
  sector,
  currentQuote,
  draftQuoteName,
  onQuantityChange,
  onImplementationFeeChange,
  onAnnualDiscountChange,
  onAeCsmNameChange,
  onChampionNameChange,
  onEconomicBuyerNameChange,
  onFtesChange,
  onVacanciesChange,
  onApplicationsChange,
  onRecruitmentMarketingSpendChange,
  onStaffingAgencySpendChange,
  onSectorChange,
  onDraftQuoteNameChange,
  onSaveClick
}: DashboardContentProps) => {
  const calculateAnnualCost = () => {
    const selectedItems = pricingModules.filter(
      (module) => quantities[module.id] && quantities[module.id] > 0
    );
    
    const monthlyCost = selectedItems.reduce(
      (total, module) => total + module.monthly_price * quantities[module.id],
      0
    );
    
    const baseAnnual = monthlyCost * 12;
    if (annualDiscount) {
      return baseAnnual * (1 - annualDiscount / 100);
    }
    return baseAnnual;
  };

  const groupedModules = groupBy(pricingModules, 'module');
  const annualCost = calculateAnnualCost();

  return (
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
          <AboutSection />

          <QuoteHeader 
            currentQuoteName={currentQuote?.name || null} 
            draftQuoteName={draftQuoteName} 
            setDraftQuoteName={onDraftQuoteNameChange}
            isNew={!currentQuote}
          />

          <Metrics 
            aeCsmName={aeCsmName} 
            championName={championName} 
            economicBuyerName={economicBuyerName} 
            ftes={ftes} 
            vacancies={vacancies} 
            applications={applications}
            recruitmentMarketingSpend={recruitmentMarketingSpend}
            staffingAgencySpend={staffingAgencySpend}
            sector={sector}
            onAeCsmNameChange={onAeCsmNameChange} 
            onChampionNameChange={onChampionNameChange} 
            onEconomicBuyerNameChange={onEconomicBuyerNameChange} 
            onFtesChange={onFtesChange} 
            onVacanciesChange={onVacanciesChange} 
            onApplicationsChange={onApplicationsChange}
            onRecruitmentMarketingSpendChange={onRecruitmentMarketingSpendChange}
            onStaffingAgencySpendChange={onStaffingAgencySpendChange}
            onSectorChange={onSectorChange}
            userName={profile?.full_name || ''} 
            annualCost={annualCost}
          />

          <div className="space-y-6">
            {Object.entries(groupedModules).map(([moduleName, features]) => (
              <ModuleGroup 
                key={moduleName} 
                moduleName={moduleName} 
                features={features} 
                quantities={quantities} 
                onChange={onQuantityChange} 
              />
            ))}
            
            <ImplementationSection 
              implementationFee={implementationFee} 
              annualDiscount={annualDiscount} 
              onImplementationFeeChange={onImplementationFeeChange} 
              onAnnualDiscountChange={onAnnualDiscountChange} 
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
              onSaveClick={onSaveClick} 
              quoteName={draftQuoteName || currentQuote?.name} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
