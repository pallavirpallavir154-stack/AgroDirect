import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Download, CheckCircle, Clock, X, AlertCircle } from 'lucide-react';
import { FarmerBuyerAgreement } from '../../shared/types';
import { useAuth } from '../context/AuthContext';
import { TRANSLATIONS } from '../../shared/i18n';

interface DigitalAgreementModalProps {
  agreement: FarmerBuyerAgreement | null;
  isOpen: boolean;
  onClose: () => void;
  onAgreementSigned: (updated: FarmerBuyerAgreement) => void;
}

export const DigitalAgreementModal: React.FC<DigitalAgreementModalProps> = ({
  agreement,
  isOpen,
  onClose,
  onAgreementSigned,
}) => {
  const { user, language } = useAuth();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen || !agreement) return null;

  const canFarmerSign = user?.role === 'FARMER' && user.id === agreement.farmerId && !agreement.farmerAcceptedAt;
  const canBuyerSign = user?.role === 'BUYER' && user.id === agreement.buyerId && !agreement.buyerAcceptedAt;
  const isFullyExecuted = agreement.farmerAcceptedAt && agreement.buyerAcceptedAt;

  const handleSign = async () => {
    if (!user) {
      alert('Please sign in to execute this agreement.');
      return;
    }

    setIsSigning(true);
    try {
      const res = await fetch(`/api/agreements/${agreement.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userRole: user.role,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to sign agreement');
        return;
      }

      const updated = await res.json();
      onAgreementSigned(updated);
    } catch (e) {
      console.error('Sign error', e);
    } finally {
      setIsSigning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="digital-agreement-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#faf8f5] text-stone-900 border border-stone-300 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#1a4329] to-[#255f3a] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                AgroDirect Digital Escrow Contract
              </span>
              <h2 className="text-xl font-serif font-bold text-white">
                {agreement.productName} Trade Agreement
              </h2>
            </div>
          </div>
          <button
            id="agreement-modal-close"
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm">
          {/* Status Badge Bar */}
          <div className="flex flex-wrap items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-2">
              {isFullyExecuted ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <span className="font-semibold text-emerald-900">
                    Agreement Status: Legally Executed & Bound
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span className="font-semibold text-amber-900">
                    Agreement Status: Pending Mutual Counterparty Signature
                  </span>
                </>
              )}
            </div>
            <span className="text-xs text-stone-600 font-mono">
              Ref: {agreement.id} ({agreement.agreementVersion})
            </span>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Cultivator / Seller (Farmer)
              </span>
              <p className="font-semibold text-stone-900 text-base">{agreement.farmerName}</p>
              <p className="text-stone-600 text-xs mt-1">Contact: {agreement.farmerContact}</p>
              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs">
                {agreement.farmerAcceptedAt ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Digitally Signed ({new Date(agreement.farmerAcceptedAt).toLocaleDateString()})
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Signature Pending
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Procuring Entity / Buyer
              </span>
              <p className="font-semibold text-stone-900 text-base">{agreement.buyerName}</p>
              <p className="text-stone-600 text-xs mt-1">Contact: {agreement.buyerContact}</p>
              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-1.5 text-xs">
                {agreement.buyerAcceptedAt ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Digitally Signed ({new Date(agreement.buyerAcceptedAt).toLocaleDateString()})
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Signature Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Financial Breakdown Card (Transparent ₹20 Fee) */}
          <div className="p-5 bg-stone-100/90 border border-stone-300 rounded-2xl">
            <h4 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Transparent Transaction & Fee Accounting
            </h4>
            <div className="space-y-2 text-stone-700">
              <div className="flex justify-between">
                <span>Committed Harvest Quantity:</span>
                <span className="font-semibold">{agreement.quantity} {agreement.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Agreed Base Rate:</span>
                <span className="font-semibold">₹{agreement.agreedPricePerUnit} / {agreement.unit}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2">
                <span>Crop Subtotal:</span>
                <span className="font-semibold">₹{agreement.productSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-medium">
                <span className="flex items-center gap-1">
                  AgroDirect Platform Verification & Escrow Fee:
                </span>
                <span>₹{agreement.platformFeeApplied.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-stone-300 pt-2 text-base font-bold text-stone-900">
                <span>Total Settlement Amount:</span>
                <span className="text-emerald-800 font-serif text-lg">
                  ₹{agreement.totalPayableAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {t.agreement.platformFeeNotice}
              </span>
            </div>
          </div>

          {/* Fulfillment Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-white border border-stone-200 rounded-xl">
              <span className="text-stone-500 font-semibold uppercase block mb-1">Harvest / Handover Date:</span>
              <p className="font-semibold text-stone-900 text-sm">{agreement.harvestDate}</p>
            </div>
            <div className="p-3.5 bg-white border border-stone-200 rounded-xl">
              <span className="text-stone-500 font-semibold uppercase block mb-1">Delivery / Handover Mode:</span>
              <p className="font-semibold text-stone-900 text-sm">{agreement.deliveryMethod.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Full Legal Text Box */}
          <div>
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
              Full Contractual Terms & Dispute Arbitration:
            </span>
            <pre className="p-4 bg-white border border-stone-200 rounded-2xl text-[11px] text-stone-700 whitespace-pre-wrap font-mono leading-relaxed max-h-48 overflow-y-auto">
              {agreement.termsAndConditions}
            </pre>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-stone-100 border-t border-stone-300 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-800 transition"
          >
            <Download className="w-4 h-4 text-stone-600" />
            {t.agreement.downloadPdf}
          </button>

          <div className="flex items-center gap-2">
            {(canFarmerSign || canBuyerSign) && (
              <button
                id="sign-agreement-submit-btn"
                disabled={isSigning}
                onClick={handleSign}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-md transition active:scale-95 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {isSigning ? t.common.loading : t.agreement.signAgreement}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-800 transition"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
