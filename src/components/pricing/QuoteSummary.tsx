
import { PricingModule } from "@/types/databaseTypes";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface QuoteSummaryProps {
  selectedModules: PricingModule[];
  quantities: Record<string, number>;
}

const QuoteSummary = ({ selectedModules, quantities }: QuoteSummaryProps) => {
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
    return calculateMonthlyCost() * 12;
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

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center bg-[#F9FAFB] p-3 rounded-md">
          Total Annual Cost: {formatCurrency(annualCost)}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
          </div>

          <div>
            <h3 className="uppercase text-sm font-semibold text-muted-foreground mb-3">
              LINE ITEMS
            </h3>
            <Separator className="mb-4" />

            {Object.keys(groupedItems).length > 0 ? (
              <>
                {Object.entries(groupedItems).map(([moduleName, items]) => (
                  <div key={moduleName} className="mb-6">
                    <h4 className="uppercase text-sm font-semibold text-muted-foreground mb-2">
                      {moduleName}
                    </h4>
                    
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between py-1">
                        <span className="text-sm">
                          {item.feature} × {quantities[item.id]} {quantities[item.id] === 1 ? item.unit : `${item.unit}s`}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.monthly_price * quantities[item.id])}
                        </span>
                      </div>
                    ))}
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
