import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata = {
  title: "Conservation Actions | Seaview",
  description: "Take action to protect our oceans and marine biodiversity.",
};

export default function ActionsPage() {
  return (
    <ComingSoon
      title="Conservation Actions"
      description="Discover meaningful ways to protect our oceans — from beach cleanups and sustainable seafood choices to supporting marine protected areas and reducing plastic pollution. Every action counts."
      iconName="Heart"
    />
  );
}
