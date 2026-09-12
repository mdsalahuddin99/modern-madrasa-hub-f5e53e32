import { notFound } from "next/navigation";
import { MadrasaService } from "@/services/madrasa.service";

// Import all the original page components from the slug directory
import MadrasaAboutPage from "@/app/[slug]/page";
import AcademicPage from "@/app/[slug]/academic/page";
import AdmissionPage from "@/app/[slug]/admission/page";
import ContactPage from "@/app/[slug]/contact/page";
import GalleryPage from "@/app/[slug]/gallery/page";
import NoticesPage from "@/app/[slug]/notices/page";
import NoticeDetailsPage from "@/app/[slug]/notices/[noticeSlug]/page";
import StudentsPage from "@/app/[slug]/students/page";
import TeachersPage from "@/app/[slug]/teachers/page";
import AchievementsPage from "@/app/[slug]/achievements/page";

interface Props {
  params: Promise<{ domain: string; path?: string[] }>;
}

export default async function SiteCatchAll({ params }: Props) {
  const { domain, path } = await params;
  const madrasa = await MadrasaService.getByCustomDomain(domain);
  
  if (!madrasa) {
    notFound();
  }

  // Construct the mock params that the original pages expect
  const mockParams = Promise.resolve({ slug: madrasa.slug });

  if (!path || path.length === 0) {
    return <MadrasaAboutPage params={mockParams} />;
  }

  const route = path[0];

  switch(route) {
    case 'academic': 
      return <AcademicPage params={mockParams} />;
    case 'admission': 
      return <AdmissionPage params={mockParams} />;
    case 'contact': 
      return <ContactPage params={mockParams} />;
    case 'achievements': 
      return <AchievementsPage params={mockParams} />;
    case 'gallery': 
      return <GalleryPage params={mockParams} />;
    case 'students': 
      return <StudentsPage params={mockParams} />;
    case 'teachers': 
      return <TeachersPage params={mockParams} />;
    case 'notices': 
      if (path[1]) {
        return <NoticeDetailsPage params={Promise.resolve({ slug: madrasa.slug, noticeSlug: path[1] })} />;
      }
      return <NoticesPage params={mockParams} />;
    default:
      notFound();
  }
}
