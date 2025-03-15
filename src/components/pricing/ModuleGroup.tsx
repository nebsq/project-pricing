
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
    <div className="mb-8 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-[#F97316] text-white p-4 w-full">
        <h3 className="text-xl font-bold">
          {moduleName}
        </h3>
      </div>
      
      <div className="px-6">
        <div className="grid grid-cols-12 py-4 font-semibold text-sm text-muted-foreground">
          <div className="col-span-5">MODULE</div>
          <div className="col-span-4">MONTHLY PRICE</div>
          <div className="col-span-3 text-right">QUANTITY</div>
        </div>
        
        {features.map((feature, index) => (
          <div key={feature.id}>
            <ModuleFeature 
              feature={feature} 
              quantity={quantities[feature.id] || 0}
              onChange={onChange}
            />
            {index < features.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleGroup;
