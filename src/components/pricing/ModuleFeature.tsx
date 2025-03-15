import { Input } from "@/components/ui/input";
import { PricingModule } from "@/types/databaseTypes";
import { formatCurrency } from "@/lib/utils";

interface ModuleFeatureProps {
  feature: PricingModule;
  quantity: number;
  onChange: (id: string, quantity: number) => void;
}

const ModuleFeature = ({ feature, quantity, onChange }: ModuleFeatureProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
    onChange(feature.id, value);
  };

  const calculatePrice = () => {
    return quantity * feature.monthly_price;
  };

  return (
    <div className="py-4 grid grid-cols-12 items-center">
      <div className="col-span-5">
        <p className="text-sm font-medium">{feature.feature}</p>
        <p className="text-xs text-muted-foreground">{feature.unit}</p>
      </div>
      <div className="col-span-4 text-xs text-muted-foreground">
        {formatCurrency(feature.monthly_price)}/{feature.increment} {feature.unit}
      </div>
      <div className="col-span-3 flex justify-end">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          value={quantity || ''} // Use empty string when quantity is 0
          onChange={handleChange}
          className="w-24 text-right"
          placeholder="-"
        />
      </div>
      {quantity > 0 && (
        <div className="col-span-12 text-right text-sm mt-1 text-gray-700 font-medium">
          Monthly cost: {formatCurrency(calculatePrice())}
        </div>
      )}
    </div>
  );
};

export default ModuleFeature;
