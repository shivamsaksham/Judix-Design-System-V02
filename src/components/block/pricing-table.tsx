"use client";

import React, { useState } from "react";
import { PricingCard, PricingCardProps } from "./pricing-card";
import { Button } from "../ui/button";

export const monthlyPlans: PricingCardProps[] = [
  {
    tier: "Lite",
    description: "For lawyers just getting started with AI research",
    price: 0,
    usage: [
      { label: "AI queries", value: "50" },
      { label: "Number of pages", value: "100" },
      { label: "Storage", value: "1 GB" },
      { label: "Projects", value: "3" },
      { label: "Multi-court search", value: false },
    ],
    features: [
      { label: "Supreme Court judgments", value: true },
      { label: "High Courts judgments", value: false },
      { label: "Central acts", value: true },
      { label: "State legislation acts", value: false },
      { label: "In-line citations", value: true },
      { label: "Judgment summaries", value: true },
      { label: "Download judgment pdf", value: false },
      { label: "Full judgment view", value: true },
      { label: "Research history", value: "30 days" },
      { label: "Export usage data", value: "Last 60 days" },
    ],
    support: [
      { label: "Email and Whatsapp support", value: true },
      { label: "Priority support", value: false },
      { label: "Dedicated account manager", value: false },
    ],
  },
  {
    tier: "Basic",
    description: "Best for individual lawyers and solo practitioners",
    price: 1499,
    isPopular: true,
    usage: [
      { label: "AI queries", value: "500" },
      { label: "Number of pages", value: "1000" },
      { label: "Storage", value: "100 GB" },
      { label: "Projects", value: "100" },
      { label: "Multi-court search", value: "max. 3 courts" },
    ],
    features: [
      { label: "Supreme Court judgments", value: true },
      { label: "High Courts judgments", value: true },
      { label: "Central acts", value: true },
      { label: "State legislation acts", value: true },
      { label: "In-line citations", value: true },
      { label: "Judgment summaries", value: true },
      { label: "Download judgment pdf", value: true },
      { label: "Full judgment view", value: true },
      { label: "Research history", value: "180 days" },
      { label: "Export usage data", value: "Last 180 days" },
    ],
    support: [
      { label: "Email and Whatsapp support", value: true },
      { label: "Priority support", value: true },
      { label: "Dedicated account manager", value: false },
    ],
  },
  {
    tier: "Pro",
    description: "Collaborative research for serious practices.",
    price: 3299,
    usage: [
      { label: "AI queries", value: "1500" },
      { label: "Number of pages", value: "5000" },
      { label: "Storage", value: "250 GB" },
      { label: "Projects", value: "Unlimited" },
      { label: "Multi-court search", value: "max. 5 courts" },
    ],
    features: [
      { label: "Supreme Court judgments", value: true },
      { label: "High Courts judgments", value: true },
      { label: "Central acts", value: true },
      { label: "State legislation acts", value: true },
      { label: "In-line citations", value: true },
      { label: "Judgment summaries", value: true },
      { label: "Download judgment pdf", value: true },
      { label: "Full judgment view", value: true },
      { label: "Research history", value: "Lifetime" },
      { label: "Export usage data", value: "Lifetime" },
    ],
    support: [
      { label: "Email and Whatsapp support", value: true },
      { label: "Priority support", value: true },
      { label: "Dedicated account manager", value: true },
    ],
  },
];

export const yearlyPlans: PricingCardProps[] = monthlyPlans.map(plan => ({
  ...plan,
  price: typeof plan.price === "number" && plan.price > 0 ? Math.floor(plan.price * 0.8) : plan.price,
}));

export interface PricingTableProps {
  onSelectPlan?: (planName: string, billingCycle: "monthly" | "yearly") => void;
  backendPlans?: any[]; // Array of plans from the backend
}

export function PricingTable({ onSelectPlan, backendPlans = [] }: PricingTableProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Merge backend prices with hardcoded features
  const mergedPlans = (billingCycle === "monthly" ? monthlyPlans : yearlyPlans).map(plan => {
    const backendPlan = backendPlans.find(bp => 
      bp.name.toLowerCase() === plan.tier.toLowerCase() && 
      bp.interval === billingCycle
    );
    
    return {
      ...plan,
      price: backendPlan ? backendPlan.price : plan.price,
      // If we want to override usage metrics, we could do it here too:
      // usage: ...
    };
  });

  return (
    <div className="w-full max-w-[1264px] lg:max-w-[1280px] xl:max-w-[1312px] mx-auto flex flex-col items-center">
      {/* Toggle */}
      <div className="flex items-center lg:mb-8 mb-6 mt-4 gap-2 overflow-hidden">
        <button
          className={`px-4 py-2 text-style-secondary-regular-b1 border transition-colors ${billingCycle === "monthly"
              ? "bg-color-surface-neutral-default text-color-text-neutral-default border-color-border-neutral-strong button-border-weight-large"
              : "bg-color-surface-neutral-default text-color-text-neutral-secondary hover:text-color-text-neutral-default border-color-border-neutral-default button-border-weight-default"
            }`}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 text-style-secondary-regular-b1 transition-colors border ${billingCycle === "yearly"
              ? "bg-color-surface-neutral-default text-color-text-neutral-default border-color-border-neutral-strong button-border-weight-large"
              : "bg-color-surface-neutral-default text-color-text-neutral-secondary hover:text-color-text-neutral-default border-color-border-neutral-default button-border-weight-default"
            }`}
          onClick={() => setBillingCycle("yearly")}
        >
          Yearly (save 20%)
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 gap-y-24 mb-9 pt-20 justify-items-center">
        {mergedPlans.map((plan) => (
          <PricingCard key={plan.tier} {...plan} onSelect={() => onSelectPlan?.(plan.tier, billingCycle)} />
        ))}
      </div>
    </div>
  );
}
