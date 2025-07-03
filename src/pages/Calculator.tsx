import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImpactEstimator from "@/components/ImpactEstimator";

const Calculator = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Impact Calculator
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Calculate the potential financial and social impact of implementing 
              shared wealth practices in your organization.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Component */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <ImpactEstimator />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Calculator;