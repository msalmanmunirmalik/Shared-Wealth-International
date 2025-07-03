import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModelConfigurator from "@/components/ModelConfigurator";

const Configurator = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero text-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Model Configurator
            </h1>
            <p className="text-xl lg:text-2xl text-background/80 mb-8">
              Build your custom Shared Wealth model by selecting and combining 
              mechanisms that fit your organization's needs.
            </p>
          </div>
        </div>
      </section>

      {/* Configurator Component */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <ModelConfigurator />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Configurator;