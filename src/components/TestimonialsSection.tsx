import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Heart, Award } from "lucide-react";
import TiltCard from "@/components/animations/TiltCard";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Adunni Okonkwo",
      role: "Life Coach & Entrepreneur",
      location: "Lagos, Nigeria",
      graduation: "Graduated 2023",
      content: "Training with Kingshill School of Discovery was the springboard to transforming my career. The practical approach and expert guidance helped me build a successful coaching practice that has impacted over 200 clients.",
      rating: 5,
      avatar: "AO",
      gradient: "bg-gradient-primary"
    },
    {
      name: "Emeka Chibueze",
      role: "Corporate Trainer",
      location: "Abuja, Nigeria", 
      graduation: "Graduated 2022",
      content: "The NLP training program at Kingshill exceeded my expectations. The skills I learned have not only enhanced my professional capabilities but also transformed my personal relationships and leadership style.",
      rating: 5,
      avatar: "EC",
      gradient: "bg-gradient-secondary"
    },
    {
      name: "Fatima Ibrahim",
      role: "Youth Development Specialist",
      location: "Kano, Nigeria",
      graduation: "Graduated 2023",
      content: "The Youth Coaching Program gave me the tools and confidence to make a real impact in young people's lives. I've since launched a youth empowerment organization that has reached over 500 young Nigerians.",
      rating: 5,
      avatar: "FI",
      gradient: "bg-gradient-accent"
    },
    {
      name: "Olumide Adebayo",
      role: "Business Coach",
      location: "Ibadan, Nigeria",
      graduation: "Graduated 2021",
      content: "Kingshill's approach to coaching education is exceptional. The international standards combined with local relevance made the learning experience truly transformative. I now run a thriving coaching consultancy.",
      rating: 5,
      avatar: "OA",
      gradient: "bg-coaching-green"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-coaching-navy via-coaching-royal-blue to-coaching-purple relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-coaching-gold/10 rounded-full animate-float blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-coaching-red/10 rounded-full animate-float-delayed blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-coaching-blue/5 rounded-full animate-pulse blur-3xl"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-10 left-1/3 w-6 h-6 bg-coaching-red/20 rounded-full animate-bounce-in" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-10 right-1/4 w-4 h-4 bg-coaching-gold/30 rotate-45 animate-bounce-in" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-coaching-purple/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-20 animate-fade-in-up">
          <Badge className="glass-card bg-coaching-red/20 text-coaching-red border-coaching-red/30 font-bold px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Kingshill Alumni
          </Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white text-shadow leading-tight">
            Meet some of our <span className="bg-gradient-to-r from-coaching-gold to-coaching-orange bg-clip-text text-transparent">1000+ graduates</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            We love keeping in touch with our students after they have graduated and celebrating
            their success stories and transformative journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16 px-2 sm:px-0">
          {testimonials.map((testimonial, index) => (
            <TiltCard key={index} className="w-full">
              <Card
                className="group hover:shadow-glow transition-all duration-700 border-0 shadow-card glass-card rounded-2xl sm:rounded-3xl overflow-hidden hover:scale-[1.02] hover-lift animate-fade-in-scale"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <CardContent className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4 lg:space-y-6 relative">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-glass opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Enhanced quote icon */}
                  <div className="flex justify-between items-start mb-3 sm:mb-4 lg:mb-6">
                    <div className={`p-2 sm:p-3 lg:p-4 ${testimonial.gradient} rounded-lg sm:rounded-xl lg:rounded-2xl shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                      <Quote className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-coaching-gold fill-current animate-bounce-in group-hover:scale-110 transition-transform duration-300"
                          style={{animationDelay: `${i * 0.1}s`}}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Enhanced content */}
                  <blockquote className="text-white text-xs sm:text-sm lg:text-base leading-relaxed font-medium italic mb-3 sm:mb-4 lg:mb-6 group-hover:text-coaching-gold transition-colors duration-300">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Enhanced author info */}
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 pt-3 sm:pt-4 lg:pt-6 border-t border-coaching-gray-light">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${testimonial.gradient} rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base lg:text-lg text-white group-hover:text-coaching-gold transition-colors duration-300 truncate">{testimonial.name}</div>
                      <div className="text-white/80 font-semibold text-xs sm:text-sm lg:text-base truncate">{testimonial.role}</div>
                      <div className="text-white/60 text-xs mt-1 truncate">{testimonial.location} • {testimonial.graduation}</div>
                    </div>
                    <div className="p-1.5 sm:p-2 lg:p-3 bg-coaching-red/10 rounded-md sm:rounded-lg lg:rounded-xl">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-coaching-red" />
                    </div>
                  </div>
                </div>
              </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>

        {/* Enhanced Trust Score */}
        <div className="text-center animate-fade-in-up px-4 sm:px-0" style={{animationDelay: '0.8s'}}>
          <Card className="max-w-sm mx-auto border-0 shadow-glow glass-card rounded-2xl sm:rounded-3xl hover:scale-105 transition-all duration-500">
            <CardContent className="p-4 sm:p-6 lg:p-8 relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-2xl sm:rounded-3xl"></div>

              <div className="space-y-4 sm:space-y-6 relative z-10">
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 bg-gradient-primary rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-glow animate-pulse-glow">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white" />
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">4.9/5</div>

                <div className="flex justify-center gap-1 sm:gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                    key={i}
                    className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-coaching-gold fill-current animate-bounce-in"
                    style={{animationDelay: `${i * 0.1}s`}}
                  />
                  ))}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-white">500+ Reviews</div>
                  <div className="text-white/80 text-xs sm:text-sm lg:text-base">From our satisfied graduates</div>
                  <div className="text-coaching-gold font-semibold text-xs sm:text-sm">Transforming lives since 1999</div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 sm:h-2 bg-coaching-gray-light rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-primary rounded-full animate-shimmer"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
