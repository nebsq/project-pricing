
import { Input } from "@/components/ui/input";

interface ImplementationSectionProps {
  implementationFee: number | null;
  annualDiscount: number | null;
  onImplementationFeeChange: (value: number | null) => void;
  onAnnualDiscountChange: (value: number | null) => void;
}

const ImplementationSection = ({
  implementationFee,
  annualDiscount,
  onImplementationFeeChange,
  onAnnualDiscountChange
}: ImplementationSectionProps) => {
  const handleImplementationFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseFloat(e.target.value);
    onImplementationFeeChange(value);
  };

  const handleAnnualDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : parseFloat(e.target.value);
    onAnnualDiscountChange(value);
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-[#F97316] text-white p-4 w-full">
        <h3 className="text-xl font-bold">
          Implementation & Others
        </h3>
      </div>
      
      <div className="px-6">
        <div className="grid grid-cols-12 py-4 font-semibold text-sm text-muted-foreground">
          <div className="col-span-5">ITEM</div>
          <div className="col-span-4">DESCRIPTION</div>
          <div className="col-span-3 text-right">PERCENTAGE</div>
        </div>
        
        <div className="py-4 grid grid-cols-12 items-center border-t border-gray-100">
          <div className="col-span-5">
            <p className="text-sm font-medium">Implementation Fee</p>
            <p className="text-xs text-muted-foreground">One-time fee</p>
          </div>
          <div className="col-span-4 text-xs text-muted-foreground">
            Applied to annual cost
          </div>
          <div className="col-span-3 flex justify-end">
            <Input
              type="number"
              inputMode="decimal"
              value={implementationFee === null ? '' : implementationFee}
              onChange={handleImplementationFeeChange}
              className="w-24 text-right"
              placeholder=""
            />
          </div>
        </div>
        
        <div className="py-4 grid grid-cols-12 items-center border-t border-gray-100">
          <div className="col-span-5">
            <p className="text-sm font-medium">Discount on Annual Total</p>
            <p className="text-xs text-muted-foreground">Annual discount</p>
          </div>
          <div className="col-span-4 text-xs text-muted-foreground">
            Reduces annual total
          </div>
          <div className="col-span-3 flex justify-end">
            <Input
              type="number"
              inputMode="decimal"
              value={annualDiscount === null ? '' : annualDiscount}
              onChange={handleAnnualDiscountChange}
              className="w-24 text-right"
              placeholder=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationSection;
