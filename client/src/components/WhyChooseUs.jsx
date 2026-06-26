import React from "react";
import { CheckCircle2 } from "lucide-react";

function WhyChooseUs() {
  const features = [
    {
      title: "Data Driven Strategies",
      description: "We base campaign setups and content angles on rigorous keyword analysis, conversion testing, and competitive positioning metrics.",
    },
    {
      title: "ROI Focused Campaigns",
      description: "Every dollar spent is tracked. We optimize campaign pathways to continuously bring down customer acquisition costs (CAC).",
    },
    {
      title: "Fast Support",
      description: "Communicate seamlessly with our strategists through direct Slack integrations, email, and scheduled weekly reviews.",
    },
    {
      title: "Transparent Reporting",
      description: "Access custom interactive reporting dashboards mapping out your campaign progression with absolute clarity, 24/7.",
    },
  ];

  return (
    <section id="why-choose-us" className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto mb-16" data-reveal="fade-in">
          <span className="font-headings font-bold text-xs uppercase tracking-[2px] text-primary bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-4">
            Why NextGen Digital
          </span>
          <h2 className="font-headings font-extrabold text-3xl sm:text-4xl text-dark mb-4 tracking-tight leading-tight">
            Engineered to Drive Maximum Return
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed font-normal">
            We don't focus on vanity metrics. We measure our success entirely on lead quality, revenue growth, and scalable marketing frameworks.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-cardBg border border-borderBg rounded-xl p-8 flex gap-5 transition-all duration-350 hover:bg-white hover:border-primary hover:shadow-md hover:-translate-y-0.5"
              data-reveal="slide-up"
            >
              <span className="text-success flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-6 h-6" />
              </span>
              <div className="flex flex-col">
                <h3 className="font-headings font-bold text-lg text-dark mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;
