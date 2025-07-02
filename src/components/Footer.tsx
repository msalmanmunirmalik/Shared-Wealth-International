import { Link } from "react-router-dom";
import { Mail, MapPin, Users } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "About",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Leadership Team", href: "/about#leadership" },
        { name: "Our Model", href: "/model" },
        { name: "Core Pillars", href: "/model#pillars" }
      ]
    },
    {
      title: "Network",
      links: [
        { name: "Our Companies", href: "/network" },
        { name: "Partnerships", href: "/partnerships" },
        { name: "Impact Stories", href: "/impact" },
        { name: "Join Network", href: "/get-involved" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Consulting", href: "/services" },
        { name: "Training Programs", href: "/services#training" },
        { name: "Summer Schools", href: "/services#summer-schools" },
        { name: "Certification", href: "/services#certification" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog & News", href: "/resources" },
        { name: "White Papers", href: "/resources#library" },
        { name: "Case Studies", href: "/resources#case-studies" },
        { name: "Toolkits", href: "/resources#toolkits" }
      ]
    }
  ];

  return (
    <footer className="bg-charcoal text-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-gold rounded-sm flex items-center justify-center">
                  <span className="text-charcoal font-bold text-sm">SW</span>
                </div>
                <span className="text-lg font-bold">Shared Wealth International</span>
              </Link>
              
              <p className="text-background/80 mb-6 leading-relaxed">
                Building a global network of companies committed to shared wealth creation, 
                inclusive decision-making, and value-led approaches to business.
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-background/80">
                  <Users className="w-4 h-4 mr-3 text-gold" />
                  <span className="text-sm">20+ Partner Companies</span>
                </div>
                <div className="flex items-center text-background/80">
                  <MapPin className="w-4 h-4 mr-3 text-gold" />
                  <span className="text-sm">Global Network</span>
                </div>
                <div className="flex items-center text-background/80">
                  <Mail className="w-4 h-4 mr-3 text-gold" />
                  <span className="text-sm">contact@sharedwealthintl.org</span>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-gold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-background/80 hover:text-gold transition-colors duration-200 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/20">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-background/60 text-sm">
              © {currentYear} Shared Wealth International. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link to="/privacy" className="text-background/60 hover:text-gold transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-background/60 hover:text-gold transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-background/60 hover:text-gold transition-colors text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;