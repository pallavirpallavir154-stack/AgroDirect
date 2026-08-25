import React from 'react';
import {
  Sprout,
  ShieldCheck,
  FileCheck,
  Truck,
  TrendingUp,
  Coins,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
          Transparent Farm-to-Market Protocol
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          How AgroDirect Works
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl mx-auto">
          We eliminate middleman exploitation by replacing commission agents with direct digital agreements, transparent ₹20 platform fees, and AI agronomy guidance.
        </p>
      </div>

      <div className="space-y-8">
        {[
          {
            step: '1',
            title: 'Sowing & AI Crop Advisory',
            desc: 'Cultivators input their district, soil type, and season into AgroDirect’s AI engine to receive data-backed crop suitability scores and Mandi price forecasts before planting.',
            icon: Sprout,
          },
          {
            step: '2',
            title: 'Pre-Harvest Direct Listing',
            desc: '4 to 8 weeks before harvesting, farmers publish upcoming yield estimates. Wholesale and retail buyers discover these lots directly without visiting physical APMC yards.',
            icon: TrendingUp,
          },
          {
            step: '3',
            title: 'Direct Negotiation & Digital Agreement',
            desc: 'Buyers submit price proposals and quantities. When mutually agreed, AgroDirect automatically compiles a binding legal contract with locked-in ₹20 flat platform fee.',
            icon: FileCheck,
          },
          {
            step: '4',
            title: 'Direct Dispatch & Instant Payout',
            desc: 'Produce is inspected and picked up directly at the farm gate or delivered to the buyer warehouse. Funds held in escrow are released 100% to the cultivator with zero percentage deductions.',
            icon: Truck,
          },
        ].map((item) => (
          <div
            key={item.step}
            className="p-6 sm:p-8 bg-white border border-stone-200 rounded-3xl shadow-xs flex flex-col sm:flex-row gap-6 items-start"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-amber-300 font-serif font-bold text-2xl flex items-center justify-center shrink-0 shadow-xs">
              {item.step}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="bg-stone-100 border border-stone-200 rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-800" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700">
          <div>
            <h4 className="font-bold text-stone-900">Why does AgroDirect charge a flat ₹20 fee instead of a percentage?</h4>
            <p className="mt-1 text-stone-600">
              Traditional brokers take 8% to 18% of crop value. On a ₹50,000 harvest, a broker takes ₹4,000 to ₹9,000 from the farmer! AgroDirect charges a flat ₹20 to cover server escrow and document maintenance, leaving the remaining produce value in the farmer's pocket.
            </p>
          </div>

          <div className="border-t border-stone-200 pt-3">
            <h4 className="font-bold text-stone-900">Are the digital agreements legally enforceable?</h4>
            <p className="mt-1 text-stone-600">
              Yes. All agreements generated through AgroDirect comply with the Indian Contract Act and the Information Technology Act (electronic records & digital signatures), including arbitration clauses for dispute resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
