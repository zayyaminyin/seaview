import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata = {
  title: "Research Hub | Seaview",
  description: "Access marine research papers, datasets, and analytical tools.",
};

export default function ResearchPage() {
  return (
    <ComingSoon
      title="Research Hub"
      description="Access curated marine research papers, open datasets, species distribution models, and powerful analytical tools. We're building a comprehensive research platform for marine scientists and citizen scientists alike."
      iconName="BookOpen"
    />
  );
}
