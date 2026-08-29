import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Madrasa } from "@/data/madrasas";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

const ContactTab = ({ madrasa }: { madrasa: Madrasa }) => {
  const contactItems = [
    { icon: MapPin, label: "ঠিকানা", value: madrasa.address },
    { icon: Phone, label: "ফোন", value: madrasa.phone },
    { icon: Mail, label: "ইমেইল", value: madrasa.email },
  ];

  const locationItems = [
    { label: "বিভাগ", value: madrasa.division },
    { label: "জেলা", value: madrasa.district },
    { label: "থানা", value: madrasa.thana },
  ];

  return (
    <div className="space-y-5 md:space-y-6">
      <motion.div {...fadeUp(0.05)} className="float-card bg-card rounded-lg border border-border/60 p-5 md:p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">যোগাযোগ তথ্য</h3>
        <div className="space-y-3.5">
          {contactItems.map((item, idx) => (
            <div key={idx}>
              {idx > 0 && <Separator className="mb-3.5 bg-border/40" />}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="text-sm text-foreground break-all">{item.value}</div>
                </div>
              </div>
            </div>
          ))}
          {madrasa.website && (
            <>
              <Separator className="bg-border/40" />
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs text-muted-foreground mb-0.5">ওয়েবসাইট</div>
                  <a href={madrasa.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                    {madrasa.website}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <Separator className="my-4 bg-border/40" />

        <h4 className="text-sm font-bold text-foreground mb-3">অবস্থান</h4>
        <div className="space-y-2.5">
          {locationItems.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground text-xs">{item.label}</span>
              <span className="font-medium text-foreground text-xs">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactTab;
