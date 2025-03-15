
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
      <h3 className="text-lg font-bold mb-2 sticky top-0 bg-background z-10 py-2">
        {moduleName}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {features[0]?.unit}
      </p>
      
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
