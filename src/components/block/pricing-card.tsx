import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@judix/icon";
import { Check } from "lucide-react";
export type PricingFeature = {
  label: string;
  value: string | boolean;
};

export type PricingCardProps = {
  tier: string;
  description: string;
  price: number | string;
  isPopular?: boolean;
  buttonLabel?: string;
  billingText?: string;
  usage: PricingFeature[];
  features: PricingFeature[];
  support: PricingFeature[];
  onSelect?: (tier: string) => void;
  buttonDisabled?: boolean;
};

function FeatureRow({ label, value }: PricingFeature) {
  return (
    <div className="flex items-center justify-between text-style-secondary-regular-b2 text-color-text-neutral-default">
      <span className="p-1 w-fit">{label}</span>
      <span className={cn("text-right", typeof value !== "boolean" && "p-1")}>
        {typeof value === "boolean" ? (
          value ? (
            <Check className="w-5 h-5 text-color-text-neutral-default" />
          ) : (
            <Icon name="cross" className="w-4 h-4 text-color-text-neutral-secondary/50" />
          )
        ) : (
          value
        )}
      </span>
    </div>
  );
}

function Section({ title, items }: { title: string; items: PricingFeature[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="p-1 text-style-secondary-medium-b2 text-color-text-neutral-placeholder uppercase tracking-wider">
        {title}
      </h4>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <FeatureRow key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}

export function PricingCard({
  tier,
  description,
  price,
  isPopular,
  buttonLabel = "Select plan",
  billingText,
  usage,
  features,
  support,
  onSelect,
  buttonDisabled
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-full max-w-[600px] lg:w-full h-full border relative border-color-border-neutral-default bg-color-surface-neutral-default"
      )}
    >
      {isPopular && (
        <div className="absolute top-[-64px] -left-px -right-px h-14 border border-color-border-neutral-default flex items-center justify-between px-5 py-3 bg-color-surface-neutral-default">
          <span className="p-1 text-style-secondary-medium-b1 text-color-text-neutral-emphasis">
            Most popular
          </span>
          <Icon name="flash-a" className="w-5 h-5 text-color-icon-neutral-default" />
        </div>
      )}

      <div className="flex flex-col h-full relative z-10 gap-4">
        <div className="p-5 md:px-8 lg:px-5 flex flex-col gap-4">
          <div className="flex flex-col">
            <h4 className="p-1  text-style-primary-regular-h4 text-color-text-neutral-default">
              {tier}
            </h4>
            <p className="p-1 w-full max-w-[500px] lg:max-w-none text-style-secondary-regular-b1 text-color-text-neutral-tertiary">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <span className="p-1 lg:text-style-secondary-medium-h4  text-style-secondary-medium-h2 text-color-text-neutral-default h-fit">
              {price}
            </span>
            {price !== "Custom" && (
              <div className="flex flex-col gap-2">
                <span className="px-1 text-style-secondary-regular-b2-trim text-color-text-neutral-default h-[10px] flex items-center">INR</span>
                <span className="px-1 text-style-secondary-regular-b2-trim  text-color-text-neutral-default h-[10px] flex items-center">{billingText || "per month"}</span>
              </div>
            )}
          </div>

          <Button
            variant="neutral"
            size="small"
            className="w-full h-12 px-4 py-2 bg-color-bg-contrast lg:text-style-secondary-regular-b1   text-color-text-neutral-onneutral border-none hover:bg-color-bg-contrast/90 hover:border-none hover:text-color-text-neutral-onneutral rounded-radius-small"
            onClick={() => onSelect?.(tier)}
            disabled={buttonDisabled}
          >
            {buttonLabel}
          </Button>
        </div>
        <div className="p-5 pt-0 md:px-8 lg:px-5 flex flex-col gap-6">
          <Section title="USAGE" items={usage} />
          <Section title="FEATURES" items={features} />
          <Section title="SUPPORT" items={support} />
        </div>
      </div>
    </div>
  );
}
