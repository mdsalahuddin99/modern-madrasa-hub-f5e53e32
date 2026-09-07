"use client";

import { use } from "react";
import { 
  NavbarFooterEditor, 
  HomepageEditor, 
  MadrasaListEditor, 
  MadrasaProfileEditor,
  AboutPageEditor,
  ContactPageEditor,
  RegisterPageEditor,
  SubscriptionPageEditor,
  LoginPageEditor,
  SignupPageEditor,
  InstallPageEditor
} from "@/components/dashboard/admin/PageEditors";
import { notFound } from "next/navigation";

const EDITOR_MAP: Record<string, React.ComponentType> = {
  "navbar-footer": NavbarFooterEditor,
  "homepage": HomepageEditor,
  "madrasa-list": MadrasaListEditor,
  "madrasa-profile": MadrasaProfileEditor,
  "about": AboutPageEditor,
  "contact": ContactPageEditor,
  "register": RegisterPageEditor,
  "subscription": SubscriptionPageEditor,
  "login": LoginPageEditor,
  "signup": SignupPageEditor,
  "install": InstallPageEditor,
};

export default function PageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const Editor = EDITOR_MAP[slug];

  if (!Editor) {
    notFound();
  }

  return (
    <Editor />
  );
}
