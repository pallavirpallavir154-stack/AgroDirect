import { FarmerBuyerAgreement, PlatformFeeConfig } from './types';

export const AGREEMENT_VERSION = 'v2026.1-AGRODIRECT-ESCROW';

export function calculateAgreementFinances(
  quantity: number,
  pricePerUnit: number,
  feeConfig: PlatformFeeConfig
) {
  const productSubtotal = Math.round(quantity * pricePerUnit * 100) / 100;
  const platformFeeApplied = feeConfig.active ? feeConfig.feeAmount : 0;
  const totalPayableAmount =
    feeConfig.feePayer === 'BUYER'
      ? productSubtotal + platformFeeApplied
      : productSubtotal;

  const farmerSettlementAmount =
    feeConfig.feePayer === 'FARMER'
      ? productSubtotal - platformFeeApplied
      : productSubtotal;

  return {
    productSubtotal,
    platformFeeApplied,
    platformFeeMode: (feeConfig.feePayer === 'BUYER' ? 'BUYER_PAYS' : 'FARMER_DEDUCTION') as 'BUYER_PAYS' | 'FARMER_DEDUCTION',
    totalPayableAmount,
    farmerSettlementAmount,
  };
}

export function generateAgreementLegalText(data: {
  farmerName: string;
  buyerName: string;
  productName: string;
  quantity: number;
  unit: string;
  agreedPricePerUnit: number;
  totalPayableAmount: number;
  platformFeeApplied: number;
  harvestDate: string;
  deliveryMethod: string;
  deliveryAddress: string;
}): string {
  return `
AGRODIRECT DIGITAL AGRICULTURAL TRADE & HARVEST ESCROW AGREEMENT
Agreement Version: ${AGREEMENT_VERSION}
Jurisdiction: Indian Contract Act 1872 & Electronic Commerce Rules

1. PARTIES:
   - CULTIVATOR / SELLER: ${data.farmerName} (Verified AgroDirect Registered Farmer)
   - PROCURER / BUYER: ${data.buyerName} (Authenticated AgroDirect Procuring Entity)

2. COMMODITY & QUANTITY SPECIFICATIONS:
   - Agricultural Produce: ${data.productName}
   - Committed Volume: ${data.quantity} ${data.unit}
   - Agreed Unit Base Rate: ₹${data.agreedPricePerUnit} per ${data.unit}
   - Total Crop Subtotal: ₹${data.quantity * data.agreedPricePerUnit}

3. PLATFORM FEE & TRANSPARENCY:
   - Platform Maintenance & Verification Fee: ₹${data.platformFeeApplied}
   - Transparent Breakdown: AgroDirect charges a flat ₹20 nominal infrastructure fee per completed transaction to provide digital identity verification, escrow dispute settlement, and AI agronomy tools. No hidden brokerage or percentage commission is extracted.
   - Total Settlement Value: ₹${data.totalPayableAmount}

4. HARVEST TIMELINE & FULFILLMENT:
   - Projected Harvest / Handover Date: ${data.harvestDate}
   - Fulfillment Mode: ${data.deliveryMethod}
   - Dispatch / Handover Location: ${data.deliveryAddress}

5. QUALITY & DISPUTE PROTOCOL:
   - Produce shall conform to agreed quality grade samples at dispatch.
   - AgroDirect platform provides dispute arbitration within 48 hours of physical inspection.
   - Both parties digitally affix their mutual consent via tamper-evident timestamped cryptographic logging.
`.trim();
}
