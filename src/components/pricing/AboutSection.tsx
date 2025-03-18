import { Card } from "@/components/ui/card";
const AboutSection = () => {
  return <div className="bg-white/50 backdrop-blur-sm rounded-lg border border-[#FF4D00]/10 p-6 mb-8">
      <h2 className="text-xl font-semibold font-display tracking-tight mb-4">
        <span className="bg-gradient-to-r from-[#F97316] to-[#FF9A3C] bg-clip-text text-transparent">
          About
        </span>
      </h2>
      <p className="text-muted-foreground">
        This calculator reads the line items and values directly from the 'Pricing' google sheet.
      </p>
      <p className="text-muted-foreground mb-4">
        Only items with column <code className="px-1.5 py-0.5 rounded bg-[#FF4D00]/5 text-[#FF4D00] font-mono text-sm font-medium border border-[#FF4D00]/10">release_stage = Available (General)</code> are imported.
      </p>
      <p className="text-muted-foreground">
        <strong>Things to do (last update: 9pm Tuesday March 18th):</strong>
      </p>
      
      <ul className="list-disc list-inside mt-2 text-muted-foreground">
        <li>✅ Updated 'Metrcs' section to include more metrics.</li>
        <li>✅ Added sense checks once metrics + annual cost are greater than 0</li>
        <li>✅ Cleaned up the 'Quote Summary' a bit </li>
        <li>✅ Cleaned up the logo and the favicon </li>
      </ul>
    </div>;
};
export default AboutSection;