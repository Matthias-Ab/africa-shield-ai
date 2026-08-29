import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ClipboardList,
  Languages,
  LifeBuoy,
  Mail,
  Map,
  MessageCircle,
  PhoneCall,
  Radio,
  ShieldCheck,
  Smartphone,
  Users,
  Volume2,
} from "lucide-react";
import { useState } from "react";

function HelpSupport() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "What is AfriShield?",
      answer:
        "AfriShield is an AI-assisted flood intelligence and early-warning platform designed to help monitor regional flood risk, identify areas requiring attention, and support communication of warnings to communities.",
    },
    {
      question: "How does AfriShield identify flood risk?",
      answer:
        "The platform combines environmental indicators, regional monitoring data and AI-supported risk assessment to classify areas according to their current flood risk.",
    },
    {
      question: "Why are community reports important?",
      answer:
        "Automated systems provide valuable information, but people on the ground can confirm what is actually happening. Community reports can provide information about rising water, blocked roads, damaged infrastructure and people who may need assistance.",
    },
    {
      question: "What should I do when I receive a high-risk alert?",
      answer:
        "Follow guidance from local authorities and emergency responders, move away from dangerous floodwater, avoid crossing flooded roads and help vulnerable people reach a safer location when it is safe to do so.",
    },
    {
      question: "Does AfriShield depend on smartphones?",
      answer:
        "No. The intelligence produced by the platform can support multiple last-mile communication channels including SMS, voice communication, radio and community leaders.",
    },
    {
      question: "Can people with disabilities use the warning system?",
      answer:
        "The platform is designed around multiple communication pathways. Voice alerts, readable messages, local-language communication and community-based warning channels can help reach people with different accessibility needs.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <main className="min-h-full bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />

              <p className="text-[10px] font-extrabold uppercase tracking-[1.7px] text-blue-600">
                SUPPORT CENTER
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Help & Support
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Learn how AfriShield works, how communities can participate,
              and how flood intelligence becomes actionable warning.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <CheckCircle2 size={17} className="text-emerald-600" />

            <div>
              <p className="text-[10px] font-extrabold text-emerald-700">
                SYSTEM OPERATIONAL
              </p>

              <p className="text-[9px] text-emerald-600">
                Monitoring network active
              </p>
            </div>
          </div>
        </div>

        {/* Main support banner */}
        <div className="mt-7 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-6 text-white shadow-lg shadow-blue-100">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <LifeBuoy size={19} />

                <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-blue-100">
                  AFRISHIELD SUPPORT
                </p>
              </div>

              <h2 className="mt-3 text-2xl font-extrabold">
                Flood intelligence should be understandable and actionable.
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                AfriShield connects monitoring, AI-assisted risk assessment,
                community information and last-mile warning channels to
                support faster disaster preparedness.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[430px]">
              <div className="rounded-xl bg-white/10 p-4">
                <Map size={18} />
                <p className="mt-2 text-[10px] font-bold text-blue-100">
                  Monitor
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <BellRing size={18} />
                <p className="mt-2 text-[10px] font-bold text-blue-100">
                  Warn
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <Users size={18} />
                <p className="mt-2 text-[10px] font-bold text-blue-100">
                  Include
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <ShieldCheck size={18} />
                <p className="mt-2 text-[10px] font-bold text-blue-100">
                  Protect
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
              HOW IT WORKS
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              From Flood Risk to Community Action
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
              AfriShield connects several stages of the disaster-warning
              process.
            </p>
          </div>

          <div className="grid md:grid-cols-4">
            {[
              {
                icon: Map,
                title: "1. Monitor",
                text: "Regional environmental and flood-risk information is continuously monitored.",
              },
              {
                icon: ShieldCheck,
                title: "2. Assess",
                text: "AI-assisted risk assessment helps identify areas requiring greater attention.",
              },
              {
                icon: ClipboardList,
                title: "3. Verify",
                text: "Community information can provide valuable ground-level confirmation.",
              },
              {
                icon: BellRing,
                title: "4. Warn",
                text: "Warnings can be communicated through channels suitable for local communities.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="border-b border-slate-100 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={18} />
                  </div>

                  <p className="mt-4 text-sm font-extrabold text-slate-800">
                    {item.title}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Community & accessibility */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Users size={19} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-purple-600">
                  COMMUNITY PARTICIPATION
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  People are part of the warning system
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {[
                {
                  icon: ClipboardList,
                  title: "Report ground conditions",
                  text: "Report flooding, rising water, blocked roads, damaged infrastructure or evacuation needs.",
                },
                {
                  icon: Map,
                  title: "Help verify risk",
                  text: "Ground-level information can complement automated monitoring and AI predictions.",
                },
                {
                  icon: Users,
                  title: "Support local response",
                  text: "Community leaders and responders can use verified information to coordinate action.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-xl bg-slate-50 p-4"
                  >
                    <Icon
                      size={18}
                      className="mt-0.5 shrink-0 text-purple-600"
                    />

                    <div>
                      <p className="text-xs font-extrabold text-slate-800">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Languages size={19} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-emerald-600">
                  INCLUSIVE WARNING
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Designed beyond the smartphone
                </h2>
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Flood warnings are most effective when communities can
              receive and understand them regardless of device,
              connectivity, language or accessibility needs.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 p-4">
                <Smartphone size={17} className="text-blue-600" />

                <p className="mt-2 text-xs font-extrabold text-slate-800">
                  SMS
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-400">
                  Useful where mobile data is limited.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <Volume2 size={17} className="text-purple-600" />

                <p className="mt-2 text-xs font-extrabold text-slate-800">
                  Voice
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-400">
                  Supports accessible audio warnings.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <Radio size={17} className="text-orange-600" />

                <p className="mt-2 text-xs font-extrabold text-slate-800">
                  Radio
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-400">
                  Extends warnings beyond apps.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <Languages size={17} className="text-emerald-600" />

                <p className="mt-2 text-xs font-extrabold text-slate-800">
                  Local language
                </p>

                <p className="mt-1 text-[9px] leading-4 text-slate-400">
                  Helps communities understand warnings.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* FAQ */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CircleHelp size={19} />
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
                  FREQUENTLY ASKED QUESTIONS
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                  Common Questions
                </h2>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-slate-50"
                  >
                    <span className="text-sm font-bold text-slate-700">
                      {faq.question}
                    </span>

                    {open ? (
                      <ChevronUp
                        size={17}
                        className="shrink-0 text-blue-600"
                      />
                    ) : (
                      <ChevronDown
                        size={17}
                        className="shrink-0 text-slate-400"
                      />
                    )}
                  </button>

                  {open && (
                    <div className="px-6 pb-5">
                      <p className="max-w-4xl text-xs leading-6 text-slate-500">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Support cards */}
        <section className="mt-6">
          <div className="mb-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[1.4px] text-blue-600">
              NEED ASSISTANCE?
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-slate-900">
              Support & Response
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageCircle size={18} />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-800">
                Community report
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Use the Reports page to submit information about flooding
                and ground conditions.
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-600">
                <ClipboardList size={13} />
                Community reporting
                <ArrowRight size={13} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <PhoneCall size={18} />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-800">
                Emergency response
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                For immediate danger, follow instructions from local
                authorities and emergency response organizations.
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-purple-600">
                <AlertTriangle size={13} />
                Immediate danger
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Mail size={18} />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-800">
                Technical support
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                For dashboard or system issues, contact the AfriShield
                project support team.
              </p>

              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                <LifeBuoy size={13} />
                Platform support
              </div>
            </div>
          </div>
        </section>

        {/* Safety note */}
        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <AlertTriangle
            size={19}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>
            <p className="text-xs font-extrabold text-amber-800">
              Important safety information
            </p>

            <p className="mt-1 text-[10px] leading-5 text-amber-700">
              AfriShield is an intelligence and early-warning support
              platform. During an actual emergency, users should follow
              instructions from authorized local authorities and emergency
              responders.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-1 py-6 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            AfriShield Help & Support • Flood Intelligence
          </span>

          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            System operational
          </span>
        </div>
      </section>
    </main>
  );
}

export default HelpSupport;