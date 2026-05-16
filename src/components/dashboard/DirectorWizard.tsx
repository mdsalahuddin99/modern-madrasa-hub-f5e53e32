import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, MapPin, Phone, Mail, BookOpen, Users,
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const categories = ["মাদ্রাসা", "জামিয়া", "নূরানী", "হিফয", "ইসলামিক ইনস্টিটিউট"];
const sampleFacilities = ["লাইব্রেরি", "হোস্টেল", "মসজিদ", "কম্পিউটার ল্যাব", "খেলার মাঠ", "ক্যান্টিন"];

interface WizardData {
  madrasaName: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  facilities: string[];
}

const steps = [
  { title: "প্রতিষ্ঠানের তথ্য", subtitle: "আপনার মাদ্রাসার মৌলিক তথ্য দিন" },
  { title: "যোগাযোগ", subtitle: "যোগাযোগের তথ্য যুক্ত করুন" },
  { title: "বিবরণ ও সুবিধা", subtitle: "বিস্তারিত তথ্য ও সুবিধাসমূহ" },
];

const DirectorWizard = () => {
  const { user, completeWizard } = useAuth();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [data, setData] = useState<WizardData>({
    madrasaName: "",
    category: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    facilities: [],
  });

  const update = (field: keyof WizardData, value: string | string[]) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const toggleFacility = (f: string) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f) ? prev.facilities.filter((x) => x !== f) : [...prev.facilities, f],
    }));
  };

  const handleComplete = () => {
    console.log("[Wizard] Madrasa data submitted:", data);
    setCompleted(true);
    setTimeout(() => completeWizard(), 2000);
  };

  const handleSkip = () => {
    console.log("[Wizard] Skipped — user will complete later");
    completeWizard();
  };

  if (completed) {
    return (
      <div className="min-h-[100svh] bg-background font-bengali flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20"
          >
            <PartyPopper className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">সেটআপ সম্পন্ন! 🎉</h2>
          <p className="text-muted-foreground">ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-background font-bengali flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 glass-card border-b border-border/40 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">স্বাগতম, {user?.email?.split("@")[0]}</p>
            <p className="text-sm font-bold text-foreground">সেটআপ উইজার্ড</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-muted-foreground h-8">
            পরে করব →
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center p-4 pt-6">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center gap-1 mb-6">
            {steps.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: step >= i ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            ))}
          </div>

          {/* Step header */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-accent">ধাপ {step + 1}/{steps.length}</span>
            </div>
            <h2 className="text-xl font-extrabold text-foreground">{steps[step].title}</h2>
            <p className="text-sm text-muted-foreground">{steps[step].subtitle}</p>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-3xl p-5 md:p-6"
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">মাদ্রাসার নাম</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={data.madrasaName}
                        onChange={(e) => update("madrasaName", e.target.value)}
                        placeholder="যেমন: জামিয়া ইসলামিয়া"
                        className="h-12 pl-10 rounded-xl bg-background/60 border-border/50 text-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">ক্যাটাগরি</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => update("category", c)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                            data.category === c
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ঠিকানা</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={data.address}
                        onChange={(e) => update("address", e.target.value)}
                        placeholder="সম্পূর্ণ ঠিকানা"
                        className="h-12 pl-10 rounded-xl bg-background/60 border-border/50 text-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ফোন নম্বর</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="h-12 pl-10 rounded-xl bg-background/60 border-border/50 text-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ইমেইল</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="info@madrasa.com"
                        className="h-12 pl-10 rounded-xl bg-background/60 border-border/50 text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">সংক্ষিপ্ত বিবরণ</label>
                    <Textarea
                      value={data.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder="আপনার মাদ্রাসা সম্পর্কে কিছু লিখুন..."
                      className="min-h-[100px] rounded-xl bg-background/60 border-border/50 text-base resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">সুবিধাসমূহ</label>
                    <div className="flex flex-wrap gap-2">
                      {sampleFacilities.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => toggleFacility(f)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                            data.facilities.includes(f)
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {data.facilities.includes(f) && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-5">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => (s - 1) as 0 | 1)} className="flex-1 h-12 rounded-xl text-base gap-2">
                <ArrowLeft className="w-4 h-4" /> পূর্ববর্তী
              </Button>
            )}
            {step < 2 ? (
              <Button onClick={() => setStep((s) => (s + 1) as 1 | 2)} className="flex-1 h-12 rounded-xl shimmer-btn text-base font-semibold gap-2">
                পরবর্তী <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="flex-1 h-12 rounded-xl shimmer-btn text-base font-semibold gap-2">
                <CheckCircle2 className="w-4 h-4" /> সম্পন্ন করুন
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorWizard;
