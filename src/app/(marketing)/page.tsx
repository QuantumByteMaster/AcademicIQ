"use client";

import { BookOpen, Brain, Clock } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesGrid } from "@/components/sections/FeatureGrid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaqSection } from "@/components/sections/FaqSection";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/home");
    }
  }, [session, router]);

  const features = [
    {
      icon: <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#2563EB]" />,
      title: "Personalized Study Plans",
      description:
        "Get tailored study plans based on your goals and learning style.",
    },
    {
      icon: <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-[#2563EB]" />,
      title: "AI-Curated Resources",
      description: "Access the best learning materials curated by our AI.",
    },
    {
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#2563EB]" />,
      title: "Time Management",
      description:
        "Manage your time effectively and stay on top of your studies.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16 bg-[#F8F6F0]">
      <HeroSection
        title="Welcome to"
        highlightedText="AcademicIQ"
        description="Your AI-powered study assistant for accelerated learning"
        ctaText={session ? "Go to Dashboard" : "Get Started"}
        ctaLink={session ? "/home" : "/register"}
      />

      <FeaturesGrid features={features} />

      {/* Trusted by Leading Institutions */}
      <section className="py-8 sm:py-16">
        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          Trusted by Leading Institutions
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <div className="flex flex-col items-center">
            <img
              src="/institutions/bits-pilani.png"
              alt="BITS Pilani"
              className="h-12 mb-2"
            />
            <span className="text-sm font-medium">BITS Pilani</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/institutions/iit-delhi.png"
              alt="IIT Delhi"
              className="h-12 mb-2"
            />
            <span className="text-sm font-medium">IIT Delhi</span>
          </div>
          <div className="flex flex-col items-center">
            <img src="/institutions/mit.png" alt="MIT" className="h-12 mb-2" />
            <span className="text-sm font-medium">MIT</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/institutions/stanford.png"
              alt="Stanford"
              className="h-12 mb-2"
            />
            <span className="text-sm font-medium">Stanford</span>
          </div>
        </div>
      </section>

      <FaqSection />
    </div>
  );
}
