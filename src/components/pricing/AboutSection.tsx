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
        <li>✅ Do we want the LINE ITEMS in the quote summary with monthly or annual prices? <strong>Added both.</strong></li>
        <li>✅ Added 'Metrics' section. All these values are now stored together with each Quote.</li>
        <li>✅ Cleaned up the 'Quote Summary' a bit. </li>
        <li>✅ Created the ability to name and save quotes. If there was a discrepancy between an already saved quote and the currently available pricing modules it should warn you.</li>
        <li>🚧 Unclear if pricing versions are required. Needs scoping. <strong>Semi-implemented it anyway in the above point.</strong></li>
        <li>❓Enable copying or exporting the "Quote Summary" for use in other docs.</li>
        <li className="ml-4">Discovery needed - what do we want here? What format is useful? .pdf? Slick copy+paste?</li>
        <li>❓ TBD on other points in your email Jake, needs scope.</li>
      </ul>
    </div>;
};
export default AboutSection;