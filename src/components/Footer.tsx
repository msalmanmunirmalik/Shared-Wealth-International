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
    <footer className="bg-navy text-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                <img 
                  src="/lovable-uploads/9fe137a2-80b1-40f6-a858-9330b4e5f96b.png" 
                  alt="Shared Wealth International Logo" 
                  className="w-8 h-8"
                />
                <span className="text-base lg:text-lg font-bold">Shared Wealth International</span>
              </Link>
              
              <p className="text-background/80 mb-6 leading-relaxed text-sm lg:text-base">
                Building a global network of companies committed to shared wealth creation, 
                inclusive decision-making, and value-led approaches to business.
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-background/80">
                  <Users className="w-4 h-4 mr-3 text-gold flex-shrink-0" />
                  <span className="text-sm">20+ Partner Companies</span>
                </div>
                <div className="flex items-center text-background/80">
                  <MapPin className="w-4 h-4 mr-3 text-gold flex-shrink-0" />
                  <span className="text-sm">Global Network</span>
                </div>
                <div className="flex items-center text-background/80">
                  <Mail className="w-4 h-4 mr-3 text-gold flex-shrink-0" />
                  <span className="text-sm break-all sm:break-normal">contact@sharedwealthintl.org</span>
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="md:col-span-1">
                <h3 className="font-semibold text-gold mb-3 lg:mb-4 text-base">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-background/80 hover:text-gold transition-colors duration-200 text-sm block py-1"
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
        <div className="py-4 lg:py-6 border-t border-background/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-xs lg:text-sm text-center sm:text-left">
              © {currentYear} Shared Wealth International. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 lg:gap-6">
              <Link to="/privacy" className="text-background/60 hover:text-gold transition-colors text-xs lg:text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-background/60 hover:text-gold transition-colors text-xs lg:text-sm">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-background/60 hover:text-gold transition-colors text-xs lg:text-sm">
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