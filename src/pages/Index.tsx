import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CorePillars from "@/components/CorePillars";
import NetworkShowcase from "@/components/NetworkShowcase";
import KeyPartnerships from "@/components/KeyPartnerships";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CorePillars />
      <NetworkShowcase />
      <KeyPartnerships />
      <Footer />
    </div>
  );
};

export default Index;
