import React from 'react';
import { Sprout, ShieldCheck, Heart, Users, Target, CheckCircle2 } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
          Our Vision & Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          About AgroDirect
        </h1>
        <p className="text-stone-600 text-sm max-w-2xl mx-auto">
          Founded to protect the dignity and prosperity of Indian farmers through sovereign AI tools, transparent market discovery, and fair direct trade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">The Problem We Solve</h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            In India, smallholder farmers lose over ₹50,000 crores annually to distress sales at APMC yards, unrecorded commission deductions, delayed payment cycles, and unwritten verbal agreements that middlemen break when prices fluctuate.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-stone-900">The AgroDirect Solution</h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            AgroDirect provides a sovereign platform where farmers own their customer relationships, set their own prices, receive AI advice, sign enforceable digital contracts with a flat ₹20 fee, and collect 100% of their earnings.
          </p>
        </div>
      </div>
    </div>
  );
};
