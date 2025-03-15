
import { PricingModule } from "@/types/databaseTypes";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface QuoteSummaryProps {
  selectedModules: PricingModule[];
  quantities: Record<string, number>;
  implementationFee: number | null;
  annualDiscount: number | null;
}

const QuoteSummary = ({ 
  selectedModules, 
  quantities,
  implementationFee,
  annualDiscount
}: QuoteSummaryProps) => {
  // Filter selected modules (those with quantity > 0)
  const selectedItems = selectedModules.filter(
    (module) => quantities[module.id] && quantities[module.id] > 0
  );

  // Calculate monthly cost
  const calculateMonthlyCost = () => {
    return selectedItems.reduce(
      (total, module) => total + module.monthly_price * quantities[module.id],
      0
    );
  };

  // Calculate annual cost (monthly * 12)
  const calculateAnnualCost = () => {
    const baseAnnual = calculateMonthlyCost() * 12;
    if (annualDiscount) {
      return baseAnnual * (1 - annualDiscount / 100);
    }
    return baseAnnual;
  };

  // Calculate implementation fee
  const calculateImplementationFee = () => {
    if (implementationFee === null) return 0;
    return calculateAnnualCost() * (implementationFee / 100);
  };

  // Group items by module
  const groupedItems = selectedItems.reduce((acc, item) => {
    if (!acc[item.module]) {
      acc[item.module] = [];
    }
    acc[item.module].push(item);
    return acc;
  }, {} as Record<string, PricingModule[]>);

  const monthlyCost = calculateMonthlyCost();
  const annualCost = calculateAnnualCost();
  const implFee = calculateImplementationFee();

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 bg-white rounded-t-lg border-b">
        <CardTitle className="text-xl font-bold">
          Quote Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 bg-white">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Monthly Cost</span>
              <span className="font-bold">{formatCurrency(monthlyCost)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Annual Cost</span>
              <span className="font-bold">{formatCurrency(annualCost)}</span>
            </div>
            {implementationFee !== null && implementationFee > 0 && (
              <div className="flex justify-between text-base text-gray-600">
                <span>Implementation Fee ({implementationFee}%)</span>
                <span className="font-medium">{formatCurrency(implFee)}</span>
              </div>
            )}
            {(implementationFee !== null && implementationFee > 0) && (
              <div className="flex justify-between text-lg pt-2 border-t">
                <span>Total Cost</span>
                <span className="font-bold">{formatCurrency(annualCost + implFee)}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="uppercase text-sm font-semibold text-muted-foreground mb-3">
              LINE ITEMS
            </h3>
            <Separator className="mb-4" />

            {Object.keys(groupedItems).length > 0 ? (
              <>
                {Object.entries(groupedItems).map(([moduleName, items], index) => (
                  <div key={moduleName} className="mb-4">
                    <h4 className="uppercase text-sm font-semibold text-muted-foreground mb-2 bg-gray-50 p-2 rounded">
                      {moduleName}
                    </h4>
                    
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between py-1">
                        <span className="text-sm">
                          {item.feature} × {quantities[item.id]} {quantities[item.id] === 1 ? item.unit : `${item.unit}s`}
                        </span>
                        <span className="font-medium text-gray-700">
                          {formatCurrency(item.monthly_price * quantities[item.id])}
                        </span>
                      </div>
                    ))}
                    
                    {index < Object.entries(groupedItems).length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No items selected yet
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteSummary;
