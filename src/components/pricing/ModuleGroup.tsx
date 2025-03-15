
import { PricingModule } from "@/types/databaseTypes";
import ModuleFeature from "./ModuleFeature";
import { Separator } from "@/components/ui/separator";

interface ModuleGroupProps {
  moduleName: string;
  features: PricingModule[];
  quantities: Record<string, number>;
  onChange: (id: string, quantity: number) => void;
}

const ModuleGroup = ({ moduleName, features, quantities, onChange }: ModuleGroupProps) => {
  return (
    <div className="mb-6">
      <div className="bg-[#F97316] text-white p-4 rounded-md mb-4">
        <h3 className="text-lg font-bold">
          {moduleName}
        </h3>
      </div>
      
      {features.map((feature) => (
        <div key={feature.id}>
          <ModuleFeature 
            feature={feature} 
            quantity={quantities[feature.id] || 0}
            onChange={onChange}
          />
          <Separator />
        </div>
      ))}
    </div>
  );
};

export default ModuleGroup;
