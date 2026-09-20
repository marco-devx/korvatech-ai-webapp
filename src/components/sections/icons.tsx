import {
  Boxes,
  Cloud,
  Database,
  Factory,
  GraduationCap,
  HeartPulse,
  Landmark,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Truck,
  Workflow,
} from "lucide-react";
import type { ComponentType } from "react";

type IconProps = { className?: string; strokeWidth?: number };

export const serviceIcons: Record<string, ComponentType<IconProps>> = {
  "custom-software": Boxes,
  "generative-ai": Sparkles,
  "predictive-ai": TrendingUp,
  integrations: Workflow,
  data: Database,
  cloud: Cloud,
};

export const industryIcons: Record<string, ComponentType<IconProps>> = {
  retail: ShoppingBag,
  education: GraduationCap,
  finance: Landmark,
  logistics: Truck,
  health: HeartPulse,
  manufacturing: Factory,
};
