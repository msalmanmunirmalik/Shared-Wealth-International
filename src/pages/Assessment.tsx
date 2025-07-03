import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReadinessAssessment from "@/components/ReadinessAssessment";

const Assessment = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Shared Wealth Readiness Assessment
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Discover your organization's readiness for shared wealth implementation 
              and get personalized recommendations for your journey.
            </p>
          </div>
        </div>
      </section>

      {/* Assessment Component */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <ReadinessAssessment />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Assessment;