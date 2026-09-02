import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, ArrowRight, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { useRef } from "react";
import useMagnetic from "@/hooks/useMagnetic";

const CTASection = () => {
  const primaryRef = useRef<HTMLButtonElement | null>(null);
  useMagnetic(primaryRef, 10);

  const webinars = [
    {
      title: "Introduction to Life Coaching",
      date: "Today, 7:00pm",
      duration: "60 minutes",
      attendees: "45+ registered",
      gradient: "bg-gradient-primary",
      color: "text-coaching-red"
    },
    {
      title: "NLP Fundamentals Workshop", 
      date: "Tomorrow, 6:00pm",
      duration: "90 minutes",
      attendees: "32+ registered",
      gradient: "bg-gradient-secondary",
      color: "text-coaching-purple"
    },
    {
      title: "Youth Coaching Essentials",
      date: "Friday, 2:00pm",
      duration: "75 minutes", 
      attendees: "28+ registered",
      gradient: "bg-gradient-accent",
      color: "text-coaching-gold"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-coaching-navy via-coaching-navy-light to-coaching-navy relative overflow-hidden">
      {/* Morphing gradient and noise overlays */}
      <div className="absolute inset-0 bg-gradient-hero bg-animated animate-gradient-shift opacity-[0.05]" aria-hidden></div>
      <div className="absolute inset-0 noise-overlay" aria-hidden></div>

      {/* Enhanced animated background with better contrast */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-coaching-navy/85"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-coaching-gold/10 rounded-full animate-float blur-2xl"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-coaching-green/10 rounded-full animate-float-delayed blur-xl"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-coaching-blue/10 rounded-full animate-float blur-lg" style={{animationDelay: '3s'}}></div>

        {/* Premium floating elements */}
        <div className="absolute top-20 left-1/4 w-10 h-10 bg-coaching-gold/30 rotate-45 animate-subtle-float shadow-glow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-coaching-green/40 rounded-full animate-gentle-bounce shadow-glow-green" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-coaching-blue/30 rounded-full animate-subtle-float shadow-glow-purple" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start lg:items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in-up text-center lg:text-left px-3 sm:px-4 md:px-0">
            <div className="space-y-4 sm:space-y-6">
              <Badge className="glass-card bg-coaching-gold/30 text-white border-coaching-gold/50 font-bold px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg shadow-glow">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Get Started Today
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight" style={{textShadow: '0 4px 12px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.6)'}}>
                Ready to{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-coaching-gold to-coaching-gold-light bg-clip-text text-transparent animate-text-glow">discover your purpose</span>
                  <div className="absolute inset-0 bg-white/20 -skew-y-1 transform scale-110 rounded-lg animate-pulse-glow"></div>
                </span>{" "}
                and transform lives?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
                Join thousands of professionals who have already started their coaching journey
                with Nigeria's first registered coaching academy. Begin with our free introduction webinars.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 animate-fade-in-up justify-center lg:justify-start" style={{animationDelay: '0.3s'}}>
              <span className="inline-block">
                <Button
                  ref={primaryRef}
                  size="lg"
                  className="relative overflow-hidden group bg-white text-coaching-red hover:bg-coaching-gold hover:text-coaching-navy font-bold px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg hover:shadow-glow transition-all duration-500 hover:scale-105 shadow-glow w-full sm:w-auto"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  Join Free Webinar
                  <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Button>
              </span>
              <Button
                size="lg"
                variant="outline"
                className="relative overflow-hidden group glass-card border-2 border-coaching-gold/50 text-white hover:bg-coaching-gold hover:text-coaching-navy font-bold px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-xl text-base sm:text-lg transition-all duration-500 hover:scale-105 shadow-glow w-full sm:w-auto"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-coaching-gold/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                Download Brochure
              </Button>
            </div>

            {/* Enhanced Contact Info */}
            <Card className="glass-card border-0 shadow-glow rounded-2xl sm:rounded-3xl hover:scale-[1.02] transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-white mb-4 flex items-center gap-3" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-coaching-gold rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-coaching-navy" />
                  </div>
                  Contact Information
                </h3>
                <div className="space-y-3 sm:space-y-4 text-white/90">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 glass-card rounded-xl sm:rounded-2xl hover:bg-white/10 transition-colors">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-coaching-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base font-bold text-white leading-tight" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>No #14 Adedotun Dina Street, Mende - Maryland, Lagos</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-card rounded-xl sm:rounded-2xl hover:bg-white/10 transition-colors">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-coaching-gold flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-white" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>09090550072, 09090550073</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-card rounded-xl sm:rounded-2xl hover:bg-white/10 transition-colors">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-coaching-gold flex-shrink-0" />
                    <span className="text-sm sm:text-base font-bold text-white break-all" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>PG@kingshillcoachingacademy.org</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Enhanced Upcoming Webinars */}
          <div className="space-y-6 sm:space-y-8 animate-slide-in-right">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4" style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'}}>Upcoming Free Webinars</h3>
              <p className="text-white text-sm sm:text-base md:text-lg" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'}}>Choose a session that fits your schedule</p>
            </div>

            <div className="space-y-6">
              {webinars.map((webinar, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-glow transition-all duration-700 border-0 shadow-card glass-card rounded-3xl hover:scale-105 hover-lift animate-fade-in-scale"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <CardContent className="p-4 sm:p-6 lg:p-8 relative">
                    <div className="absolute inset-0 bg-gradient-glass opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="space-y-2 sm:space-y-3 flex-1">
                          <h4 className="font-bold text-base sm:text-lg text-white group-hover:text-coaching-gold transition-colors">
                            {webinar.title}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 lg:gap-4 text-white" style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-coaching-gold" />
                              <span className="font-semibold text-sm sm:text-base">{webinar.date}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-coaching-gold" />
                              <span className="text-sm sm:text-base">{webinar.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-coaching-green" />
                              <span className="text-coaching-green font-semibold text-sm sm:text-base">{webinar.attendees}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className={`${webinar.gradient} hover:shadow-glow font-bold px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base hover:scale-110 transition-all duration-300 relative overflow-hidden group`}
                        >
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"/>
                          Register
                        </Button>
                      </div>

                      {/* Progress indicator */}
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${webinar.gradient} rounded-full animate-shimmer`}
                          style={{animationDelay: `${index * 0.3}s`}}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                className="relative overflow-hidden group glass-card border-2 border-coaching-gold/50 text-white hover:bg-coaching-gold hover:text-coaching-navy font-bold px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl md:rounded-2xl text-base sm:text-lg md:text-xl hover:shadow-glow transition-all duration-500 hover:scale-105 animate-premium-glow shadow-glow"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-coaching-gold/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                View All Webinars
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
