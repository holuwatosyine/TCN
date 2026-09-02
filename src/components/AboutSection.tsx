import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Users, Target, Heart, ArrowRight, Sparkles, Globe, BookOpen } from "lucide-react";

export const AboutSection: React.FC = () => {
  const achievements = [
    {
      icon: <Users className="w-7 h-7 text-[#ecc131]" />,
      number: "1000+",
      label: "Graduates Worldwide",
      description: "Professionals transformed",
    },
    {
      icon: <Award className="w-7 h-7 text-[#b81d1d]" />,
      number: "25+",
      label: "Years of Excellence",
      description: "Industry experience",
    },
    {
      icon: <Globe className="w-7 h-7 text-[#ecc131]" />,
      number: "CCC",
      label: "Commonwealth Coaching Council Accredited",
      description: "Global recognition",
    },
    {
      icon: <Target className="w-7 h-7 text-[#1d8a4e]" />,
      number: "100%",
      label: "Success Rate",
      description: "Graduate satisfaction",
    },
  ];

  return (
    <section className="py-24 bg-[#070a12] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="space-y-6">
            <Badge className="bg-amber-400/10 text-[#ecc131] border border-amber-400/30 font-bold px-5 py-2 text-xs sm:text-sm rounded-full inline-flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              About Kingshill
            </Badge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-outfit leading-tight">
              A School of <span className="gradient-text-gold">Discovery</span>
            </h2>

            <div className="space-y-4 text-slate-300 font-dmsans text-base sm:text-lg leading-relaxed">
              <p className="font-semibold text-white">
                At KingsHill, We Unlock Potential. We Raise Builders and Reformers.
              </p>

              <p className="text-amber-400 font-bold">
                We Make You See The Future and Secure it.
              </p>

              <p className="font-extrabold text-white tracking-wide uppercase text-sm">
                LIFE TRANSFORMATION & SOCIAL DEVELOPMENT
              </p>

              <p>
                At Kingshill Coaching Academy, we believe in the power of human potential. Founded as Nigeria's first registered coaching academy, we have been pioneering excellence in coaching education for over two decades.
              </p>

              <p>
                Our internationally accredited programs combine global best practices with local insights, creating transformative learning experiences that empower individuals to unlock their potential and create lasting positive change.
              </p>

              <p>
                We don't just teach coaching - we cultivate leaders, change-makers, and visionaries who go on to transform communities across Nigeria and beyond.
              </p>
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-6 rounded-xl text-base shadow-[0_0_20px_rgba(236,193,49,0.3)] transition-all duration-300 hover:scale-105"
                onClick={() => (window.location.href = "/about")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Our Story
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="glass-card border-white/10 rounded-2xl p-6 hover:border-amber-400/40 transition-all duration-300"
              >
                <CardContent className="p-0 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-white font-outfit">
                      {achievement.number}
                    </div>
                    <div className="text-sm font-bold text-slate-200 font-outfit mt-1">
                      {achievement.label}
                    </div>
                    <div className="text-xs text-slate-400 font-dmsans mt-0.5">
                      {achievement.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Card */}
        <div className="mt-16">
          <div className="liquid-border">
            <Card className="liquid-border-inner border-none glass-panel p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(236,193,49,0.2)]">
                <Heart className="w-8 h-8 text-amber-400" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
                Our Mission: Transforming Lives Through{" "}
                <span className="gradient-text-gold">Excellence in Coaching Education</span>
              </h3>

              <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-dmsans leading-relaxed">
                We are committed to developing world-class coaching professionals who create positive,
                lasting change in their communities. Through our internationally accredited programs,
                we empower individuals to discover their purpose, maximize their potential, and
                transform both their own lives and the lives of others.
              </p>

              <div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600 text-white font-bold px-10 py-6 rounded-xl text-base shadow-[0_0_25px_rgba(236,193,49,0.3)] transition-all duration-300 hover:scale-105"
                  onClick={() => (window.location.href = "/contact")}
                >
                  <Target className="w-5 h-5 mr-2" />
                  Join Our Community
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
