"use client";

import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MadrasaFormData } from "@/types/madrasa";

interface ContactTabProps {
  formData: any;
  update: (field: keyof MadrasaFormData, value: string) => void;
  readOnly?: boolean;
  onLockedAction?: () => void;
}

export const ContactTab = ({ formData, update, readOnly = false, onLockedAction }: ContactTabProps) => {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 relative">
      {readOnly && (
        <button
          type="button"
          aria-label="লকড ফিচার"
          className="absolute inset-0 z-10 cursor-not-allowed bg-transparent"
          onClick={onLockedAction}
        />
      )}
      <h3 className="text-base font-bold text-foreground">যোগাযোগ তথ্য</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">ফোন নম্বর</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => update("phone", e.target.value)}
              disabled={readOnly}
              placeholder="01XXXXXXXXX"
              className="h-11 pl-10 rounded-xl bg-background/60 border-border/50"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">ইমেইল</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => update("email", e.target.value)}
              disabled={readOnly}
              placeholder="info@madrasa.com"
              className="h-11 pl-10 rounded-xl bg-background/60 border-border/50"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">ঠিকানা</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Textarea
            value={formData.address}
            onChange={(e) => update("address", e.target.value)}
            disabled={readOnly}
            placeholder="সম্পূর্ণ ঠিকানা লিখুন..."
            className="min-h-[70px] pl-10 rounded-xl bg-background/60 border-border/50 text-sm resize-none"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">ওয়েবসাইট (ঐচ্ছিক)</label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={formData.website}
            onChange={(e) => update("website", e.target.value)}
            disabled={readOnly}
            placeholder="www.example.com"
            className="h-11 pl-10 rounded-xl bg-background/60 border-border/50"
          />
        </div>
      </div>
    </div>
  );
};
