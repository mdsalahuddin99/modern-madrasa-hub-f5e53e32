"use client";

import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationOption {
  id: string;
  nameBn: string;
  nameEn: string;
}

interface LocationSelectorProps {
  divisionId?: string;
  onDivisionChange: (id: string, nameBn: string) => void;
  districtId?: string;
  onDistrictChange: (id: string, nameBn: string) => void;
  thanaId?: string;
  onThanaChange: (id: string, nameBn: string) => void;
  className?: string; // e.g., "contents" to fit into a parent grid seamlessly
  disabled?: boolean;
  hideDivisionOnDesktop?: boolean;
}

export function LocationSelector({
  divisionId,
  onDivisionChange,
  districtId,
  onDistrictChange,
  thanaId,
  onThanaChange,
  className = "grid grid-cols-1 md:grid-cols-3 gap-4",
  disabled = false,
  hideDivisionOnDesktop = false,
}: LocationSelectorProps) {
  const [divisions, setDivisions] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [thanas, setThanas] = useState<LocationOption[]>([]);

  const [loadingDiv, setLoadingDiv] = useState(false);
  const [loadingDist, setLoadingDist] = useState(false);
  const [loadingThana, setLoadingThana] = useState(false);

  // Load Divisions on mount
  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoadingDiv(true);
      try {
        const res = await fetch("/api/locations?type=divisions");
        const json = await res.json();
        if (active && json.data) setDivisions(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoadingDiv(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  // Load Districts when division changes
  useEffect(() => {
    let active = true;
    if (!divisionId) {
      setDistricts([]);
      return;
    }
    const load = async () => {
      setLoadingDist(true);
      try {
        const res = await fetch(`/api/locations?type=districts&parentId=${divisionId}`);
        const json = await res.json();
        if (active && json.data) {
          setDistricts(json.data);
          // If the currently selected district is not in the new list, reset it
          if (districtId && !json.data.some((d: any) => d.id === districtId)) {
            onDistrictChange("", "");
            onThanaChange("", "");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoadingDist(false);
      }
    };
    load();
    return () => { active = false; };
  }, [divisionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load Thanas when district changes
  useEffect(() => {
    let active = true;
    if (!districtId) {
      setThanas([]);
      return;
    }
    const load = async () => {
      setLoadingThana(true);
      try {
        const res = await fetch(`/api/locations?type=thanas&parentId=${districtId}`);
        const json = await res.json();
        if (active && json.data) {
          setThanas(json.data);
          // If the currently selected thana is not in the new list, reset it
          if (thanaId && !json.data.some((t: any) => t.id === thanaId)) {
            onThanaChange("", "");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoadingThana(false);
      }
    };
    load();
    return () => { active = false; };
  }, [districtId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectTriggerClass = "h-12 sm:h-13 rounded-lg border-border/40 bg-background/70 text-sm shadow-sm transition-all data-[state=open]:ring-2 data-[state=open]:ring-primary/20";

  return (
    <div className={className}>
      <div className={hideDivisionOnDesktop ? "hidden lg:contents" : "contents"}>
        <div className={hideDivisionOnDesktop ? "lg:hidden" : ""}>
          <Select
            value={divisionId || undefined}
            onValueChange={(v) => {
              const name = divisions.find((d) => d.id === v)?.nameBn || "";
              onDivisionChange(v, name);
              onDistrictChange("", "");
              onThanaChange("", "");
            }}
            disabled={disabled || loadingDiv}
          >
            <SelectTrigger className={selectTriggerClass} aria-label="বিভাগ">
              {loadingDiv ? (
                <Loader2 className="w-4 h-4 mr-2 text-muted-foreground animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
              )}
              <SelectValue placeholder="বিভাগ নির্বাচন" />
            </SelectTrigger>
            <SelectContent className="rounded-lg">
              {divisions.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.nameBn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Select
        value={districtId || undefined}
        onValueChange={(v) => {
          const name = districts.find((d) => d.id === v)?.nameBn || "";
          onDistrictChange(v, name);
          onThanaChange("", "");
        }}
        disabled={disabled || !divisionId || loadingDist}
      >
        <SelectTrigger className={selectTriggerClass} aria-label="জেলা">
          {loadingDist ? (
            <Loader2 className="w-4 h-4 mr-2 text-muted-foreground animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          <SelectValue
            placeholder={divisionId ? "জেলা নির্বাচন" : "আগে বিভাগ বাছুন"}
          />
        </SelectTrigger>
        <SelectContent className="rounded-lg">
          {districts.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.nameBn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={thanaId || undefined}
        onValueChange={(v) => {
          const name = thanas.find((t) => t.id === v)?.nameBn || "";
          onThanaChange(v, name);
        }}
        disabled={disabled || !districtId || loadingThana}
      >
        <SelectTrigger className={selectTriggerClass} aria-label="থানা">
          {loadingThana ? (
            <Loader2 className="w-4 h-4 mr-2 text-muted-foreground animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          <SelectValue
            placeholder={districtId ? "থানা/উপজেলা" : "আগে জেলা বাছুন"}
          />
        </SelectTrigger>
        <SelectContent className="rounded-lg max-h-60">
          {thanas.length > 0 ? (
            thanas.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.nameBn}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-center text-muted-foreground">
              কোনো ডেটা নেই
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
