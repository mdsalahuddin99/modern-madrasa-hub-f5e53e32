import { useState } from "react";
import Image from "next/image";
import { Save, RotateCcw, Plus, Trash2, Eye, EyeOff, Palette, Type, Image as ImageIcon, Layout, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";
import { defaultSiteContent, SiteContent, PageHeader, AboutPageContent, ContactPageContent } from "@/data/siteContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DynamicListItem, { moveUp, moveDown, DraggableList, reorder } from "./DynamicListItem";

/* ── Shared field helpers ── */
const Field = ({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
    {multiline ? (
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl text-sm min-h-[80px]" />
    ) : (
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl text-sm h-10" />
    )}
  </div>
);

const NumberField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
    <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="rounded-xl text-sm h-10" />
  </div>
);

/* ── Shared save/reset bar ── */
const useContentEditor = () => {
  const { content, updateContent } = useSiteContent();
  const { toast } = useToast();
  const [draft, setDraft] = useState<SiteContent>(content);

  const save = () => { updateContent(draft); toast({ title: "✅ কনটেন্ট সেভ হয়েছে" }); };
  const resetAll = () => { setDraft(defaultSiteContent); updateContent(defaultSiteContent); toast({ title: "🔄 ডিফল্টে ফিরে গেছে" }); };

  return { draft, setDraft, save, resetAll };
};

const ActionBar = ({ onSave, onReset, inline }: { onSave: () => void; onReset: () => void; inline?: boolean }) => (
  <div className={`flex gap-2 ${inline ? "" : "sticky bottom-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/40 p-4 -mx-4 md:-mx-6 mt-8 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]"}`}>
    <Button onClick={onSave} size="sm" className="gap-1.5 rounded-xl text-xs">
      <Save className="w-3.5 h-3.5" /> সেভ করুন
    </Button>
    <Button onClick={onReset} variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs">
      <RotateCcw className="w-3.5 h-3.5" /> ডিফল্ট
    </Button>
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="glass-card rounded-2xl p-5 space-y-4 mb-5">
    <h3 className="text-sm font-bold text-foreground border-b border-border/40 pb-2">{title}</h3>
    {children}
  </div>
);

/* ════════════════════════════════════════════
   PAGE EDITORS
   ════════════════════════════════════════════ */

/* ── নেভবার ও ফুটার ── */
export const NavbarFooterEditor = () => {
  const { draft, setDraft, save, resetAll } = useContentEditor();
  return (
    <div className="max-w-3xl">
      <h1 className="text-lg font-extrabold text-foreground mb-2">🧭 নেভবার ও ফুটার</h1>
      <ActionBar onSave={save} onReset={resetAll} />

      <SectionCard title="নেভবার">
        <Field label="সাইটের নাম" value={draft.navbar.siteName} onChange={(v) => setDraft({ ...draft, navbar: { ...draft.navbar, siteName: v } })} />
          <DraggableList items={draft.navbar.links} onReorder={(links) => setDraft({ ...draft, navbar: { ...draft.navbar, links } })}>
          <p className="text-xs font-medium text-muted-foreground">নেভ লিংক</p>
          {draft.navbar.links.map((link, i) => (
            <DynamicListItem
              key={i}
              index={i}
              total={draft.navbar.links.length}
              onMoveUp={() => setDraft({ ...draft, navbar: { ...draft.navbar, links: moveUp(draft.navbar.links, i) } })}
              onMoveDown={() => setDraft({ ...draft, navbar: { ...draft.navbar, links: moveDown(draft.navbar.links, i) } })}
              onDelete={() => setDraft({ ...draft, navbar: { ...draft.navbar, links: draft.navbar.links.filter((_, j) => j !== i) } })}
              canDelete={draft.navbar.links.length > 1}
              renderView={() => (
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-medium">{link.label}</span>
                  <span className="text-muted-foreground">→ {link.href}</span>
                </div>
              )}
              renderEdit={() => (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="লেবেল" value={link.label} onChange={(v) => { const links = [...draft.navbar.links]; links[i] = { ...links[i], label: v }; setDraft({ ...draft, navbar: { ...draft.navbar, links } }); }} />
                  <Field label="লিংক" value={link.href} onChange={(v) => { const links = [...draft.navbar.links]; links[i] = { ...links[i], href: v }; setDraft({ ...draft, navbar: { ...draft.navbar, links } }); }} />
                </div>
              )}
            />
          ))}
          <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, navbar: { ...draft.navbar, links: [...draft.navbar.links, { label: "নতুন", href: "/" }] } })} className="gap-1 text-xs rounded-xl">
            <Plus className="w-3 h-3" /> লিংক যোগ করুন
          </Button>
          </DraggableList>
      </SectionCard>

      <SectionCard title="ফুটার">
        <Field label="সাইটের নাম" value={draft.footer.siteName} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, siteName: v } })} />
        <Field label="সাইটের বিবরণ" value={draft.footer.siteDescription} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, siteDescription: v } })} multiline />
        <div className="grid grid-cols-3 gap-3">
          <Field label="লিংক শিরোনাম" value={draft.footer.linksTitle} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, linksTitle: v } })} />
          <Field label="সেবা শিরোনাম" value={draft.footer.servicesTitle} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, servicesTitle: v } })} />
          <Field label="যোগাযোগ শিরোনাম" value={draft.footer.contactTitle} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, contactTitle: v } })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="ফোন" value={draft.footer.phone} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, phone: v } })} />
          <Field label="ইমেইল" value={draft.footer.email} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, email: v } })} />
        </div>
        <Field label="ঠিকানা" value={draft.footer.address} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, address: v } })} />
        <Field label="কপিরাইট" value={draft.footer.copyright} onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, copyright: v } })} />
        
        <DraggableList items={draft.footer.serviceLinks || []} onReorder={(items) => setDraft({ ...draft, footer: { ...draft.footer, serviceLinks: items } })}>
          <p className="text-xs font-medium text-muted-foreground">সেবা লিংক</p>
          {(draft.footer.serviceLinks || []).map((link, i) => (
            <DynamicListItem
              key={i}
              index={i}
              total={(draft.footer.serviceLinks || []).length}
              onMoveUp={() => setDraft({ ...draft, footer: { ...draft.footer, serviceLinks: moveUp(draft.footer.serviceLinks || [], i) } })}
              onMoveDown={() => setDraft({ ...draft, footer: { ...draft.footer, serviceLinks: moveDown(draft.footer.serviceLinks || [], i) } })}
              onDelete={() => setDraft({ ...draft, footer: { ...draft.footer, serviceLinks: (draft.footer.serviceLinks || []).filter((_, j) => j !== i) } })}
              canDelete={(draft.footer.serviceLinks || []).length > 1}
              renderView={() => (
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-medium">{link.label}</span>
                  <span className="text-muted-foreground">→ {link.href}</span>
                </div>
              )}
              renderEdit={() => (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="লেবেল" value={link.label} onChange={(v) => { const serviceLinks = [...(draft.footer.serviceLinks || [])]; serviceLinks[i] = { ...serviceLinks[i], label: v }; setDraft({ ...draft, footer: { ...draft.footer, serviceLinks } }); }} />
                  <Field label="লিংক" value={link.href} onChange={(v) => { const serviceLinks = [...(draft.footer.serviceLinks || [])]; serviceLinks[i] = { ...serviceLinks[i], href: v }; setDraft({ ...draft, footer: { ...draft.footer, serviceLinks } }); }} />
                </div>
              )}
            />
          ))}
          <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, footer: { ...draft.footer, serviceLinks: [...(draft.footer.serviceLinks || []), { label: "নতুন", href: "#" }] } })} className="gap-1 text-xs rounded-xl">
            <Plus className="w-3 h-3" /> সেবা লিংক যোগ করুন
          </Button>
        </DraggableList>
      </SectionCard>
    </div>
  );
};

/* ── হোমপেজ ── */
export const HomepageEditor = () => {
  const { draft, setDraft, save, resetAll } = useContentEditor();
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const sectionCounts = {
    hero: 6,
    stats: draft.stats.length,
    search: 4,
    categories: draft.categories.items.length,
    howItWorks: draft.howItWorks.steps.length,
    featured: 4,
    boards: draft.boards.items.length,
    cta: draft.cta.benefits.length,
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> হোমপেজ এডিটর
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">হোমপেজের সকল সেকশন এখান থেকে পরিবর্তন করুন</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setPreview(!preview)} variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs">
            {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {preview ? "এডিট মোড" : "প্রিভিউ"}
          </Button>
          <ActionBar onSave={save} onReset={resetAll} inline />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/30 p-1.5 rounded-xl mb-4">
          {[
            { id: "hero", label: "হিরো", icon: Layout },
            { id: "stats", label: "পরিসংখ্যান", icon: Type },
            { id: "search", label: "সার্চ", icon: Eye },
            { id: "categories", label: "বিভাগ", icon: Palette },
            { id: "howItWorks", label: "কিভাবে কাজ করে", icon: Sparkles },
            { id: "featured", label: "শীর্ষ মাদ্রাসা", icon: ImageIcon },
            { id: "boards", label: "শিক্ষা বোর্ড", icon: Layout },
            { id: "cta", label: "CTA", icon: Type },
          ].map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-[10px] rounded-lg px-2.5 py-1.5 gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
              <Badge variant="secondary" className="text-[8px] h-3.5 px-1 ml-0.5 bg-background/50">
                {sectionCounts[tab.id as keyof typeof sectionCounts]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="hero">
          <SectionCard title="হিরো সেকশন">
            {preview ? (
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center space-y-2">
                <p className="text-[10px] text-muted-foreground">{draft.hero.subtitle}</p>
                <h2 className="text-lg font-extrabold">{draft.hero.title} <span className="text-primary">{draft.hero.titleHighlight}</span></h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">{draft.hero.description}</p>
                <div className="flex gap-2 justify-center mt-3">
                  <span className="text-[10px] bg-primary text-primary-foreground px-3 py-1 rounded-full">{draft.hero.searchBtnText}</span>
                  <span className="text-[10px] border border-border px-3 py-1 rounded-full">{draft.hero.registerBtnText}</span>
                </div>
              </div>
            ) : (
              <>
                <Field label="সাবটাইটেল" value={draft.hero.subtitle} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, subtitle: v } })} />
                <Field label="শিরোনাম" value={draft.hero.title} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, title: v } })} />
                <Field label="হাইলাইট টেক্সট" value={draft.hero.titleHighlight} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, titleHighlight: v } })} />
                <Field label="বিবরণ" value={draft.hero.description} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, description: v } })} multiline />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="সার্চ বাটন" value={draft.hero.searchBtnText} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, searchBtnText: v } })} />
                  <Field label="নিবন্ধন বাটন" value={draft.hero.registerBtnText} onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, registerBtnText: v } })} />
                </div>
              </>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="stats">
          <SectionCard title="পরিসংখ্যান বার">
            {preview ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {draft.stats.map((s, i) => (
                  <div key={i} className="rounded-xl bg-muted/30 p-3 text-center">
                    <div className="text-lg font-extrabold text-primary">{s.value}{s.suffix}</div>
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <DraggableList items={draft.stats} onReorder={(items) => setDraft({ ...draft, stats: items })}>
                {draft.stats.map((stat, i) => (
                  <DynamicListItem
                    key={i}
                    index={i}
                    total={draft.stats.length}
                    onMoveUp={() => setDraft({ ...draft, stats: moveUp(draft.stats, i) })}
                    onMoveDown={() => setDraft({ ...draft, stats: moveDown(draft.stats, i) })}
                    onDelete={() => setDraft({ ...draft, stats: draft.stats.filter((_, j) => j !== i) })}
                    canDelete={draft.stats.length > 1}
                    renderView={() => (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-primary">{stat.value}{stat.suffix}</span>
                        <span className="text-muted-foreground">{stat.label}</span>
                      </div>
                    )}
                    renderEdit={() => (
                      <div className="grid grid-cols-3 gap-3">
                        <NumberField label="মান" value={stat.value} onChange={(v) => { const stats = [...draft.stats]; stats[i] = { ...stats[i], value: v }; setDraft({ ...draft, stats }); }} />
                        <Field label="প্রত্যয়" value={stat.suffix} onChange={(v) => { const stats = [...draft.stats]; stats[i] = { ...stats[i], suffix: v }; setDraft({ ...draft, stats }); }} />
                        <Field label="লেবেল" value={stat.label} onChange={(v) => { const stats = [...draft.stats]; stats[i] = { ...stats[i], label: v }; setDraft({ ...draft, stats }); }} />
                      </div>
                    )}
                  />
                ))}
              </DraggableList>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="search">
          <SectionCard title="সার্চ সেকশন">
            {preview ? (
              <div className="rounded-xl bg-muted/20 p-6 text-center space-y-2">
                <Badge variant="secondary" className="text-[10px]">{draft.search.badge}</Badge>
                <h3 className="text-base font-bold">{draft.search.title}</h3>
                <p className="text-xs text-muted-foreground">{draft.search.subtitle}</p>
                <span className="inline-block text-[10px] bg-primary text-primary-foreground px-3 py-1 rounded-full mt-2">{draft.search.buttonText}</span>
              </div>
            ) : (
              <>
                <Field label="ব্যাজ" value={draft.search.badge} onChange={(v) => setDraft({ ...draft, search: { ...draft.search, badge: v } })} />
                <Field label="শিরোনাম" value={draft.search.title} onChange={(v) => setDraft({ ...draft, search: { ...draft.search, title: v } })} />
                <Field label="সাবটাইটেল" value={draft.search.subtitle} onChange={(v) => setDraft({ ...draft, search: { ...draft.search, subtitle: v } })} multiline />
                <Field label="বাটন টেক্সট" value={draft.search.buttonText} onChange={(v) => setDraft({ ...draft, search: { ...draft.search, buttonText: v } })} />
              </>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="categories">
          <SectionCard title="বিভাগসমূহ">
            <Field label="ব্যাজ" value={draft.categories.badge} onChange={(v) => setDraft({ ...draft, categories: { ...draft.categories, badge: v } })} />
            <Field label="শিরোনাম" value={draft.categories.title} onChange={(v) => setDraft({ ...draft, categories: { ...draft.categories, title: v } })} />
            <Field label="সাবটাইটেল" value={draft.categories.subtitle} onChange={(v) => setDraft({ ...draft, categories: { ...draft.categories, subtitle: v } })} />
            
            {preview ? (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {draft.categories.items.map((item, i) => (
                  <div key={i} className="rounded-xl bg-muted/20 border border-border/30 p-3">
                    <p className="text-xs font-bold">{item.name}</p>
                    <p className="text-primary text-sm font-extrabold">{item.count}</p>
                    <p className="text-[9px] text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <DraggableList items={draft.categories.items} onReorder={(items) => setDraft({ ...draft, categories: { ...draft.categories, items } })}>
                {draft.categories.items.map((item, i) => (
                  <DynamicListItem
                    key={i}
                    index={i}
                    total={draft.categories.items.length}
                    onMoveUp={() => setDraft({ ...draft, categories: { ...draft.categories, items: moveUp(draft.categories.items, i) } })}
                    onMoveDown={() => setDraft({ ...draft, categories: { ...draft.categories, items: moveDown(draft.categories.items, i) } })}
                    onDelete={() => setDraft({ ...draft, categories: { ...draft.categories, items: draft.categories.items.filter((_, j) => j !== i) } })}
                    canDelete={draft.categories.items.length > 1}
                    renderView={() => (
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold">{item.name}</span>
                        <Badge variant="secondary" className="text-[9px]">{item.count}</Badge>
                        <span className="text-muted-foreground">{item.desc}</span>
                      </div>
                    )}
                    renderEdit={() => (
                      <div className="grid grid-cols-3 gap-2">
                        <Field label="নাম" value={item.name} onChange={(v) => { const items = [...draft.categories.items]; items[i] = { ...items[i], name: v }; setDraft({ ...draft, categories: { ...draft.categories, items } }); }} />
                        <Field label="সংখ্যা" value={item.count} onChange={(v) => { const items = [...draft.categories.items]; items[i] = { ...items[i], count: v }; setDraft({ ...draft, categories: { ...draft.categories, items } }); }} />
                        <Field label="বিবরণ" value={item.desc} onChange={(v) => { const items = [...draft.categories.items]; items[i] = { ...items[i], desc: v }; setDraft({ ...draft, categories: { ...draft.categories, items } }); }} />
                      </div>
                    )}
                  />
                ))}
                <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, categories: { ...draft.categories, items: [...draft.categories.items, { name: "নতুন", count: "০+", desc: "বিবরণ" }] } })} className="gap-1 text-xs rounded-xl">
                  <Plus className="w-3 h-3" /> বিভাগ যোগ করুন
                </Button>
              </DraggableList>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="howItWorks">
          <SectionCard title="কিভাবে কাজ করে">
            <Field label="ব্যাজ" value={draft.howItWorks.badge} onChange={(v) => setDraft({ ...draft, howItWorks: { ...draft.howItWorks, badge: v } })} />
            <Field label="শিরোনাম" value={draft.howItWorks.title} onChange={(v) => setDraft({ ...draft, howItWorks: { ...draft.howItWorks, title: v } })} />
            
            {preview ? (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {draft.howItWorks.steps.map((step, i) => (
                  <div key={i} className="rounded-xl bg-muted/20 border border-border/30 p-3 text-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center mx-auto mb-2">{step.num}</div>
                    <p className="text-xs font-bold">{step.title}</p>
                    <p className="text-[9px] text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <DraggableList items={draft.howItWorks.steps} onReorder={(items) => setDraft({ ...draft, howItWorks: { ...draft.howItWorks, steps: items } })}>
                {draft.howItWorks.steps.map((step, i) => (
                  <DynamicListItem
                    key={i}
                    index={i}
                    total={draft.howItWorks.steps.length}
                    onMoveUp={() => setDraft({ ...draft, howItWorks: { ...draft.howItWorks, steps: moveUp(draft.howItWorks.steps, i) } })}
                    onMoveDown={() => setDraft({ ...draft, howItWorks: { ...draft.howItWorks, steps: moveDown(draft.howItWorks.steps, i) } })}
                    onDelete={() => setDraft({ ...draft, howItWorks: { ...draft.howItWorks, steps: draft.howItWorks.steps.filter((_, j) => j !== i) } })}
                    canDelete={draft.howItWorks.steps.length > 1}
                    renderView={() => (
                      <div className="flex items-center gap-3 text-xs">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">{step.num}</span>
                        <span className="font-medium">{step.title}</span>
                        <span className="text-muted-foreground truncate">{step.desc}</span>
                      </div>
                    )}
                    renderEdit={() => (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Field label="নম্বর" value={step.num} onChange={(v) => { const steps = [...draft.howItWorks.steps]; steps[i] = { ...steps[i], num: v }; setDraft({ ...draft, howItWorks: { ...draft.howItWorks, steps } }); }} />
                          <Field label="শিরোনাম" value={step.title} onChange={(v) => { const steps = [...draft.howItWorks.steps]; steps[i] = { ...steps[i], title: v }; setDraft({ ...draft, howItWorks: { ...draft.howItWorks, steps } }); }} />
                        </div>
                        <Field label="বিবরণ" value={step.desc} onChange={(v) => { const steps = [...draft.howItWorks.steps]; steps[i] = { ...steps[i], desc: v }; setDraft({ ...draft, howItWorks: { ...draft.howItWorks, steps } }); }} multiline />
                      </div>
                    )}
                  />
                ))}
                <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, howItWorks: { ...draft.howItWorks, steps: [...draft.howItWorks.steps, { num: `০${draft.howItWorks.steps.length + 1}`, title: "নতুন ধাপ", desc: "বিবরণ" }] } })} className="gap-1 text-xs rounded-xl">
                  <Plus className="w-3 h-3" /> ধাপ যোগ করুন
                </Button>
              </DraggableList>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="featured">
          <SectionCard title="শীর্ষ মাদ্রাসা সেকশন">
            {preview ? (
              <div className="rounded-xl bg-muted/20 p-6 text-center space-y-2">
                <Badge variant="secondary" className="text-[10px]">{draft.featured.badge}</Badge>
                <h3 className="text-base font-bold">{draft.featured.title}</h3>
                <div className="flex gap-2 justify-center mt-2">
                  <span className="text-[10px] border border-border px-3 py-1 rounded-full">{draft.featured.viewAllText}</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full">{draft.featured.detailsText}</span>
                </div>
              </div>
            ) : (
              <>
                <Field label="ব্যাজ" value={draft.featured.badge} onChange={(v) => setDraft({ ...draft, featured: { ...draft.featured, badge: v } })} />
                <Field label="শিরোনাম" value={draft.featured.title} onChange={(v) => setDraft({ ...draft, featured: { ...draft.featured, title: v } })} />
                <Field label="সকল দেখুন বাটন" value={draft.featured.viewAllText} onChange={(v) => setDraft({ ...draft, featured: { ...draft.featured, viewAllText: v } })} />
                <Field label="বিস্তারিত বাটন" value={draft.featured.detailsText} onChange={(v) => setDraft({ ...draft, featured: { ...draft.featured, detailsText: v } })} />
              </>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="boards">
          <SectionCard title="শিক্ষা বোর্ড">
            <Field label="ব্যাজ" value={draft.boards.badge} onChange={(v) => setDraft({ ...draft, boards: { ...draft.boards, badge: v } })} />
            <Field label="শিরোনাম" value={draft.boards.title} onChange={(v) => setDraft({ ...draft, boards: { ...draft.boards, title: v } })} />
            <Field label="সাবটাইটেল" value={draft.boards.subtitle} onChange={(v) => setDraft({ ...draft, boards: { ...draft.boards, subtitle: v } })} />
            
            {preview ? (
              <div className="space-y-2 mt-3">
                {draft.boards.items.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20 border border-border/30">
                    <Badge variant="outline" className="text-[9px] shrink-0">{b.abbr}</Badge>
                    <span className="text-xs">{b.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <DraggableList items={draft.boards.items} onReorder={(items) => setDraft({ ...draft, boards: { ...draft.boards, items } })}>
                {draft.boards.items.map((b, i) => (
                  <DynamicListItem
                    key={i}
                    index={i}
                    total={draft.boards.items.length}
                    onMoveUp={() => setDraft({ ...draft, boards: { ...draft.boards, items: moveUp(draft.boards.items, i) } })}
                    onMoveDown={() => setDraft({ ...draft, boards: { ...draft.boards, items: moveDown(draft.boards.items, i) } })}
                    onDelete={() => setDraft({ ...draft, boards: { ...draft.boards, items: draft.boards.items.filter((_, j) => j !== i) } })}
                    canDelete={draft.boards.items.length > 1}
                    renderView={() => (
                      <div className="flex items-center gap-3 text-xs">
                        <Badge variant="outline" className="text-[9px] shrink-0">{b.abbr}</Badge>
                        <span className="font-medium">{b.name}</span>
                      </div>
                    )}
                    renderEdit={() => (
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="পূর্ণ নাম" value={b.name} onChange={(v) => { const items = [...draft.boards.items]; items[i] = { ...items[i], name: v }; setDraft({ ...draft, boards: { ...draft.boards, items } }); }} />
                        <Field label="সংক্ষিপ্ত" value={b.abbr} onChange={(v) => { const items = [...draft.boards.items]; items[i] = { ...items[i], abbr: v }; setDraft({ ...draft, boards: { ...draft.boards, items } }); }} />
                      </div>
                    )}
                  />
                ))}
                <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, boards: { ...draft.boards, items: [...draft.boards.items, { name: "নতুন বোর্ড", abbr: "নতুন" }] } })} className="gap-1 text-xs rounded-xl">
                  <Plus className="w-3 h-3" /> বোর্ড যোগ করুন
                </Button>
              </DraggableList>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="cta">
          <SectionCard title="CTA সেকশন">
            {preview ? (
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-6 text-center space-y-3">
                <h3 className="text-base font-extrabold">{draft.cta.title} <span className="text-primary">{draft.cta.titleLine2}</span></h3>
                <p className="text-xs text-muted-foreground">{draft.cta.description}</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {draft.cta.benefits.map((b, i) => (
                    <Badge key={i} variant="secondary" className="text-[9px]">✓ {b}</Badge>
                  ))}
                </div>
                <span className="inline-block text-[10px] bg-primary text-primary-foreground px-4 py-1.5 rounded-full mt-2">{draft.cta.buttonText}</span>
              </div>
            ) : (
              <>
                <Field label="শিরোনাম ১" value={draft.cta.title} onChange={(v) => setDraft({ ...draft, cta: { ...draft.cta, title: v } })} />
                <Field label="শিরোনাম ২" value={draft.cta.titleLine2} onChange={(v) => setDraft({ ...draft, cta: { ...draft.cta, titleLine2: v } })} />
                <Field label="বিবরণ" value={draft.cta.description} onChange={(v) => setDraft({ ...draft, cta: { ...draft.cta, description: v } })} multiline />
                <Field label="বাটন টেক্সট" value={draft.cta.buttonText} onChange={(v) => setDraft({ ...draft, cta: { ...draft.cta, buttonText: v } })} />
                <DraggableList items={draft.cta.benefits} onReorder={(items) => setDraft({ ...draft, cta: { ...draft.cta, benefits: items } })}>
                  <p className="text-xs font-medium text-muted-foreground">সুবিধা তালিকা</p>
                  {draft.cta.benefits.map((b, i) => (
                    <DynamicListItem
                      key={i}
                      index={i}
                      total={draft.cta.benefits.length}
                      onMoveUp={() => setDraft({ ...draft, cta: { ...draft.cta, benefits: moveUp(draft.cta.benefits, i) } })}
                      onMoveDown={() => setDraft({ ...draft, cta: { ...draft.cta, benefits: moveDown(draft.cta.benefits, i) } })}
                      onDelete={() => setDraft({ ...draft, cta: { ...draft.cta, benefits: draft.cta.benefits.filter((_, j) => j !== i) } })}
                      canDelete={draft.cta.benefits.length > 1}
                      renderView={() => <span className="text-xs">✓ {b}</span>}
                      renderEdit={() => (
                        <Input value={b} onChange={(e) => { const benefits = [...draft.cta.benefits]; benefits[i] = e.target.value; setDraft({ ...draft, cta: { ...draft.cta, benefits } }); }} className="rounded-xl text-sm h-9" />
                      )}
                    />
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, cta: { ...draft.cta, benefits: [...draft.cta.benefits, "নতুন সুবিধা"] } })} className="gap-1 text-xs rounded-xl">
                    <Plus className="w-3 h-3" /> সুবিধা যোগ করুন
                  </Button>
                </DraggableList>
              </>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* ── মাদ্রাসা তালিকা পেজ ── */
export const MadrasaListEditor = () => {
  const { draft, setDraft, save, resetAll } = useContentEditor();
  const ml = draft.pages.madrasaList;
  const update = (field: string, value: string) => setDraft({ ...draft, pages: { ...draft.pages, madrasaList: { ...ml, [field]: value } } });
  return (
    <div className="max-w-3xl">
      <h1 className="text-lg font-extrabold text-foreground mb-2">📋 মাদ্রাসা তালিকা পেজ</h1>
      <ActionBar onSave={save} onReset={resetAll} />
      <SectionCard title="পেজ হেডার ও টেক্সট">
        <Field label="শিরোনাম" value={ml.title} onChange={(v) => update("title", v)} />
        <Field label="সাবটাইটেল" value={ml.subtitle} onChange={(v) => update("subtitle", v)} />
        <Field label="সার্চ প্লেসহোল্ডার" value={ml.searchPlaceholder} onChange={(v) => update("searchPlaceholder", v)} />
        <Field label="ফলাফল গণনা (আগে)" value={ml.resultCountPrefix} onChange={(v) => update("resultCountPrefix", v)} />
        <Field label="ফলাফল গণনা (পরে)" value={ml.resultCountSuffix} onChange={(v) => update("resultCountSuffix", v)} />
        <Field label="কোনো ফলাফল নেই শিরোনাম" value={ml.noResultTitle} onChange={(v) => update("noResultTitle", v)} />
        <Field label="কোনো ফলাফল নেই বিবরণ" value={ml.noResultDesc} onChange={(v) => update("noResultDesc", v)} />
        <Field label="ফিল্টার মুছুন বাটন" value={ml.clearFilterText} onChange={(v) => update("clearFilterText", v)} />
      </SectionCard>
    </div>
  );
};

/* ── মাদ্রাসা প্রোফাইল পেজ ── */
export const MadrasaProfileEditor = () => {
  const { draft, setDraft, save, resetAll } = useContentEditor();
  return (
    <div className="max-w-3xl">
      <h1 className="text-lg font-extrabold text-foreground mb-2">🕌 মাদ্রাসা প্রোফাইল পেজ</h1>
      <ActionBar onSave={save} onReset={resetAll} />

      <SectionCard title="মুহতামিমের বাণী">
        <Field label="শিরোনাম" value={draft.profile.principalMessageTitle} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, principalMessageTitle: v } })} />
        <Field label="বাণী" value={draft.profile.principalMessage} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, principalMessage: v } })} multiline />
        <div className="grid grid-cols-2 gap-3">
          <Field label="নাম" value={draft.profile.principalName} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, principalName: v } })} />
          <Field label="পদবী" value={draft.profile.principalRole} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, principalRole: v } })} />
        </div>
      </SectionCard>

      <SectionCard title="বিভাগসমূহ">
        <Field label="শিরোনাম" value={draft.profile.departmentsTitle} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, departmentsTitle: v } })} />
        <DraggableList items={draft.profile.departments} onReorder={(items) => setDraft({ ...draft, profile: { ...draft.profile, departments: items } })}>
          {draft.profile.departments.map((dept, i) => (
            <DynamicListItem
              key={i}
              index={i}
              total={draft.profile.departments.length}
              onMoveUp={() => setDraft({ ...draft, profile: { ...draft.profile, departments: moveUp(draft.profile.departments, i) } })}
              onMoveDown={() => setDraft({ ...draft, profile: { ...draft.profile, departments: moveDown(draft.profile.departments, i) } })}
              onDelete={() => setDraft({ ...draft, profile: { ...draft.profile, departments: draft.profile.departments.filter((_, j) => j !== i) } })}
              canDelete={draft.profile.departments.length > 1}
              renderView={() => (
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold">{dept.name}</span>
                  <Badge variant="secondary" className="text-[9px]">{dept.students}</Badge>
                  <span className="text-muted-foreground">{dept.desc}</span>
                </div>
              )}
              renderEdit={() => (
                <div className="grid grid-cols-3 gap-2">
                  <Field label="নাম" value={dept.name} onChange={(v) => { const d = [...draft.profile.departments]; d[i] = { ...d[i], name: v }; setDraft({ ...draft, profile: { ...draft.profile, departments: d } }); }} />
                  <Field label="শিক্ষার্থী" value={dept.students} onChange={(v) => { const d = [...draft.profile.departments]; d[i] = { ...d[i], students: v }; setDraft({ ...draft, profile: { ...draft.profile, departments: d } }); }} />
                  <Field label="বিবরণ" value={dept.desc} onChange={(v) => { const d = [...draft.profile.departments]; d[i] = { ...d[i], desc: v }; setDraft({ ...draft, profile: { ...draft.profile, departments: d } }); }} />
                </div>
              )}
            />
          ))}
          <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, profile: { ...draft.profile, departments: [...draft.profile.departments, { name: "নতুন", students: "০+", desc: "বিবরণ" }] } })} className="gap-1 text-xs rounded-xl">
            <Plus className="w-3 h-3" /> বিভাগ যোগ
          </Button>
        </DraggableList>
      </SectionCard>

      <SectionCard title="ভর্তি নিয়মাবলী">
        <Field label="শিরোনাম" value={draft.profile.admissionTitle} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, admissionTitle: v } })} />
        <DraggableList items={draft.profile.admissionRules} onReorder={(items) => setDraft({ ...draft, profile: { ...draft.profile, admissionRules: items } })}>
          {draft.profile.admissionRules.map((rule, i) => (
            <DynamicListItem
              key={i}
              index={i}
              total={draft.profile.admissionRules.length}
              onMoveUp={() => setDraft({ ...draft, profile: { ...draft.profile, admissionRules: moveUp(draft.profile.admissionRules, i) } })}
              onMoveDown={() => setDraft({ ...draft, profile: { ...draft.profile, admissionRules: moveDown(draft.profile.admissionRules, i) } })}
              onDelete={() => setDraft({ ...draft, profile: { ...draft.profile, admissionRules: draft.profile.admissionRules.filter((_, j) => j !== i) } })}
              canDelete={draft.profile.admissionRules.length > 1}
              renderView={() => <span className="text-xs">{rule}</span>}
              renderEdit={() => (
                <Input value={rule} onChange={(e) => { const r = [...draft.profile.admissionRules]; r[i] = e.target.value; setDraft({ ...draft, profile: { ...draft.profile, admissionRules: r } }); }} className="rounded-xl text-sm h-9" />
              )}
            />
          ))}
          <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, profile: { ...draft.profile, admissionRules: [...draft.profile.admissionRules, "নতুন নিয়ম"] } })} className="gap-1 text-xs rounded-xl">
            <Plus className="w-3 h-3" /> নিয়ম যোগ
          </Button>
        </DraggableList>
      </SectionCard>

      <SectionCard title="গ্যালারি ইমেজ">
        <p className="text-xs text-muted-foreground">খালি থাকলে ডিফল্ট ছবি দেখাবে</p>
        <DraggableList items={draft.profile.galleryImages} onReorder={(items) => setDraft({ ...draft, profile: { ...draft.profile, galleryImages: items } })}>
          {draft.profile.galleryImages.map((img, i) => (
            <DynamicListItem
              key={i}
              index={i}
              total={draft.profile.galleryImages.length}
              onMoveUp={() => setDraft({ ...draft, profile: { ...draft.profile, galleryImages: moveUp(draft.profile.galleryImages, i) } })}
              onMoveDown={() => setDraft({ ...draft, profile: { ...draft.profile, galleryImages: moveDown(draft.profile.galleryImages, i) } })}
              onDelete={() => setDraft({ ...draft, profile: { ...draft.profile, galleryImages: draft.profile.galleryImages.filter((_, j) => j !== i) } })}
              renderView={() => (
                <div className="flex items-center gap-3 text-xs">
                  {img.src && (
                    <div className="relative w-12 h-8 rounded overflow-hidden border border-border/40 flex-shrink-0">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.parentElement) target.parentElement.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <span className="text-muted-foreground">{img.alt}</span>
                </div>
              )}
              renderEdit={() => (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="ইমেজ URL" value={img.src} onChange={(v) => { const g = [...draft.profile.galleryImages]; g[i] = { ...g[i], src: v }; setDraft({ ...draft, profile: { ...draft.profile, galleryImages: g } }); }} />
                  <Field label="Alt" value={img.alt} onChange={(v) => { const g = [...draft.profile.galleryImages]; g[i] = { ...g[i], alt: v }; setDraft({ ...draft, profile: { ...draft.profile, galleryImages: g } }); }} />
                </div>
              )}
            />
          ))}
          <Button variant="outline" size="sm" onClick={() => setDraft({ ...draft, profile: { ...draft.profile, galleryImages: [...draft.profile.galleryImages, { src: "", alt: "নতুন ছবি" }] } })} className="gap-1 text-xs rounded-xl">
            <Plus className="w-3 h-3" /> ছবি যোগ
          </Button>
        </DraggableList>
      </SectionCard>

      <SectionCard title="সেকশন লেবেল">
        <div className="grid grid-cols-2 gap-3">
          <Field label="পরিচিতি" value={draft.profile.sectionLabels.intro} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, sectionLabels: { ...draft.profile.sectionLabels, intro: v } } })} />
          <Field label="কোর্স" value={draft.profile.sectionLabels.courses} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, sectionLabels: { ...draft.profile.sectionLabels, courses: v } } })} />
          <Field label="গ্যালারি" value={draft.profile.sectionLabels.gallery} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, sectionLabels: { ...draft.profile.sectionLabels, gallery: v } } })} />
          <Field label="সুবিধা" value={draft.profile.sectionLabels.facilities} onChange={(v) => setDraft({ ...draft, profile: { ...draft.profile, sectionLabels: { ...draft.profile.sectionLabels, facilities: v } } })} />
        </div>
      </SectionCard>
    </div>
  );
};

/* ── Simple page header editors ── */
const SimplePageEditor = ({ title, pageKey }: { title: string; pageKey: string }) => {
  const { draft, setDraft, save, resetAll } = useContentEditor();
  const pageData = (draft.pages as { [key: string]: PageHeader })[pageKey];
  const updateField = (field: string, value: string) => {
    setDraft({ ...draft, pages: { ...draft.pages, [pageKey]: { ...pageData, [field]: value } } });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-lg font-extrabold text-foreground mb-2">{title}</h1>
      <ActionBar onSave={save} onReset={resetAll} />
      <SectionCard title="পেজ কনটেন্ট">
        <Field label="শিরোনাম" value={pageData.title} onChange={(v) => updateField("title", v)} />
        {pageData.subtitle !== undefined && <Field label="সাবটাইটেল" value={pageData.subtitle} onChange={(v) => updateField("subtitle", v)} />}
        {(pageData as any).description !== undefined && <Field label="বিবরণ" value={(pageData as any).description} onChange={(v) => updateField("description", v)} multiline />}
      </SectionCard>
    </div>
  );
};

export const RegisterPageEditor = () => <SimplePageEditor title="📝 নিবন্ধন পেজ" pageKey="register" />;
export const SubscriptionPageEditor = () => <SimplePageEditor title="💳 সাবস্ক্রিপশন পেজ" pageKey="subscription" />;
export const LoginPageEditor = () => <SimplePageEditor title="🔐 লগইন পেজ" pageKey="login" />;
export const SignupPageEditor = () => <SimplePageEditor title="📋 সাইন আপ পেজ" pageKey="signup" />;
export const InstallPageEditor = () => <SimplePageEditor title="📱 ইনস্টল পেজ" pageKey="install" />;

/* ── সম্পর্কে পেজ ── */
export const AboutPageEditor = () => {
  const { draft, setDraft, save, resetAll } = useContentEditor();
  const about = draft.pages.about;
  const updateAbout = (obj: Partial<AboutPageContent>) => setDraft({ ...draft, pages: { ...draft.pages, about: { ...about, ...obj } } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-lg font-extrabold text-foreground mb-2">📖 সম্পর্কে পেজ</h1>
      <ActionBar onSave={save} onReset={resetAll} />

      <SectionCard title="পেজ হেডার">
        <Field label="শিরোনাম" value={about.title} onChange={(v) => updateAbout({ title: v })} />
        <Field label="সাবটাইটেল" value={about.subtitle} onChange={(v) => updateAbout({ subtitle: v })} />
      </SectionCard>

      <SectionCard title="মিশন">
        <Field label="শিরোনাম" value={about.mission.title} onChange={(v) => updateAbout({ mission: { ...about.mission, title: v } })} />
        <Field label="বিবরণ" value={about.mission.description} onChange={(v) => updateAbout({ mission: { ...about.mission, description: v } })} multiline />
      </SectionCard>

      <SectionCard title="ভিশন">
        <Field label="শিরোনাম" value={about.vision.title} onChange={(v) => updateAbout({ vision: { ...about.vision, title: v } })} />
        <Field label="বিবরণ" value={about.vision.description} onChange={(v) => updateAbout({ vision: { ...about.vision, description: v } })} multiline />
      </SectionCard>

      <SectionCard title="সেবাসমূহ">
        <Field label="সেকশন শিরোনাম" value={about.features.title} onChange={(v) => updateAbout({ features: { ...about.features, title: v } })} />
        <DraggableList items={about.features.items} onReorder={(items) => updateAbout({ features: { ...about.features, items } })}>
          {about.features.items.map((item, i) => (
            <DynamicListItem
              key={i}
              index={i}
              total={about.features.items.length}
              onMoveUp={() => updateAbout({ features: { ...about.features, items: moveUp(about.features.items, i) } })}
              onMoveDown={() => updateAbout({ features: { ...about.features, items: moveDown(about.features.items, i) } })}
              onDelete={() => updateAbout({ features: { ...about.features, items: about.features.items.filter((_: any, j: number) => j !== i) } })}
              canDelete={about.features.items.length > 1}
              renderView={() => (
                <div className="text-xs">
                  <span className="font-bold">{item.title}</span>
                  <span className="text-muted-foreground ml-2">{item.desc}</span>
                </div>
              )}
              renderEdit={() => (
                <div className="grid grid-cols-2 gap-2">
                  <Field label="শিরোনাম" value={item.title} onChange={(v) => {
                    const items = [...about.features.items]; items[i] = { ...items[i], title: v };
                    updateAbout({ features: { ...about.features, items } });
                  }} />
                  <Field label="বিবরণ" value={item.desc} onChange={(v) => {
                    const items = [...about.features.items]; items[i] = { ...items[i], desc: v };
                    updateAbout({ features: { ...about.features, items } });
                  }} />
                </div>
              )}
            />
          ))}
          <Button variant="outline" size="sm" onClick={() => updateAbout({ features: { ...about.features, items: [...about.features.items, { title: "নতুন সেবা", desc: "বিবরণ" }] } })} className="gap-1 text-xs rounded-xl">
            <Plus className="w-3 h-3" /> সেবা যোগ
          </Button>
        </DraggableList>
      </SectionCard>
    </div>
  );
};

/* ── যোগাযোগ পেজ ── */
export const ContactPageEditor = () => {
  const { draft, setDraft, save, resetAll } = useContentEditor();
  const contact = draft.pages.contact;
  const updateContact = (obj: Partial<ContactPageContent>) => setDraft({ ...draft, pages: { ...draft.pages, contact: { ...contact, ...obj } } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-lg font-extrabold text-foreground mb-2">📞 যোগাযোগ পেজ</h1>
      <ActionBar onSave={save} onReset={resetAll} />

      <SectionCard title="পেজ হেডার">
        <Field label="শিরোনাম" value={contact.title} onChange={(v) => updateContact({ title: v })} />
        <Field label="সাবটাইটেল" value={contact.subtitle} onChange={(v) => updateContact({ subtitle: v })} multiline />
      </SectionCard>

      <SectionCard title="ফর্ম লেবেল">
        <Field label="ফর্ম শিরোনাম" value={contact.formTitle} onChange={(v) => updateContact({ formTitle: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="নাম লেবেল" value={contact.nameLabel} onChange={(v) => updateContact({ nameLabel: v })} />
          <Field label="ইমেইল লেবেল" value={contact.emailLabel} onChange={(v) => updateContact({ emailLabel: v })} />
        </div>
        <Field label="মেসেজ লেবেল" value={contact.messageLabel} onChange={(v) => updateContact({ messageLabel: v })} />
        <Field label="বাটন টেক্সট" value={contact.buttonText} onChange={(v) => updateContact({ buttonText: v })} />
      </SectionCard>

      <SectionCard title="যোগাযোগ তথ্য">
        <Field label="তথ্য শিরোনাম" value={contact.infoTitle} onChange={(v) => updateContact({ infoTitle: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="ফোন" value={contact.phone} onChange={(v) => updateContact({ phone: v })} />
          <Field label="ইমেইল" value={contact.email} onChange={(v) => updateContact({ email: v })} />
        </div>
        <Field label="ঠিকানা" value={contact.address} onChange={(v) => updateContact({ address: v })} />
        <Field label="অফিস সময়" value={contact.officeHours} onChange={(v) => updateContact({ officeHours: v })} />
      </SectionCard>
    </div>
  );
};
