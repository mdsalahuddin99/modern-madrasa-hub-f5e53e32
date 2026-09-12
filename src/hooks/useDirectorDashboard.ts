import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { MadrasaFormData } from "@/types/madrasa"; // Assuming we have or will create this type

const defaultFormData: MadrasaFormData = {
  name: "",
  tagline: "",
  bannerImage: "",
  division: "",
  district: "",
  thana: "",
  category: "",
  board: "",
  established: "",
  description: "",
  history: "",
  mission: "",
  vision: "",
  principalMessage: "",
  principalName: "",
  principalRole: "",
  departments: [{ name: "", students: "", desc: "" }],
  courses: [""],
  facilities: [],
  studentCount: "",
  teacherCount: "",
  alumniCount: "",
  notableAlumni: "",
  admissionRules: [""],
  admissionOpen: false,
  admissionFile: "",
  admissionFileType: "",
  admissionImages: [],
  galleryImages: [],
  phone: "",
  email: "",
  address: "",
  website: "",
  subdomain: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  teachersList: [],
  notices: [],
  achievements: [],
  galleryVideos: [],
  admissionContent: "",
};

export const useDirectorDashboard = (userId: string | undefined) => {
  const [formData, setFormData] = useState<MadrasaFormData>(defaultFormData);
  const [madrasaId, setMadrasaId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["directorMadrasa", userId],
    queryFn: async () => {
      const response = await fetch(`/api/madrasas?directorId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch madrasa data");
      return response.json();
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  useEffect(() => {
    if (data?.madrasas && data.madrasas.length > 0) {
      const m = data.madrasas[0];
      setMadrasaId(m.id);
      
      const mappedData: Partial<MadrasaFormData> = {
        id: m.id,
        name: m.name,
        division: m.division,
        district: m.district,
        thana: m.thana,
        category: m.category,
        board: m.board,
        established: m.established,
        description: m.description,
        address: m.address,
        phone: m.phone,
        email: m.email,
        website: m.website || "",
        subdomain: m.subdomain || "",
        tagline: m.tagline || "",
        history: m.history || "",
        mission: m.mission || "",
        vision: m.vision || "",
        principalName: m.principalName || "",
        principalRole: m.principalRole || "",
        principalMessage: m.principalMessage || "",
        studentCount: m.students.toString(),
        teacherCount: m.teachers.toString(),
        alumniCount: m.alumniCount || "",
        notableAlumni: m.notableAlumni || "",
        bannerImage: m.bannerImage || "",
        admissionRules: m.admissionRules || [""],
        admissionOpen: m.admissionOpen,
        departments: m.departments || [{ name: "", students: "", desc: "" }],
        metaTitle: m.metaTitle || "",
        metaDescription: m.metaDescription || "",
        metaKeywords: m.metaKeywords || "",
        courses: m.courses?.map((c: any) => c.name) || [""],
        facilities: m.facilities?.map((f: any) => f.name) || [],
        teachersList: m.staffList || [],
        notices: m.contents || [],
        galleryImages: m.galleryImages?.map((img: any) => img.url) || [],
        galleryVideos: m.galleryVideos || [],
        achievements: m.achievements || [],
        admissionContent: m.admissionContent || "",
        status: m.status,
        createdAt: m.createdAt,
        allowedFeatures: m.allowedFeatures || [],
      };
      
      setFormData(prev => ({ ...prev, ...mappedData }));
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error("মাদ্রাসার তথ্য লোড করতে সমস্যা হয়েছে");
    }
  }, [isError]);

  const update = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

  // Helper functions
  const addRule = () => update("admissionRules", [...formData.admissionRules, ""]);
  const removeRule = (i: number) => update("admissionRules", formData.admissionRules.filter((_, idx) => idx !== i));
  const updateRule = (i: number, val: string) => {
    const rules = [...formData.admissionRules];
    rules[i] = val;
    update("admissionRules", rules);
  };

  const addDepartment = () => update("departments", [...formData.departments, { name: "", students: "", desc: "" }]);
  const removeDepartment = (i: number) => update("departments", formData.departments.filter((_, idx) => idx !== i));
  const updateDepartment = (i: number, field: string, val: string) => {
    const deps = [...formData.departments];
    deps[i] = { ...deps[i], [field]: val };
    update("departments", deps);
  };

  const addCourse = () => update("courses", [...formData.courses, ""]);
  const removeCourse = (i: number) => update("courses", formData.courses.filter((_, idx) => idx !== i));
  const updateCourse = (i: number, val: string) => {
    const c = [...formData.courses];
    c[i] = val;
    update("courses", c);
  };

  const addFacility = () => update("facilities", [...(formData.facilities || []), ""]);
  const updateFacility = (i: number, val: string) => {
    const facs = [...(formData.facilities || [])];
    facs[i] = val;
    update("facilities", facs);
  };
  const removeFacility = (i: number) => update("facilities", formData.facilities.filter((_, idx) => idx !== i));

  const handleFileUpload = async (field: "bannerImage" | "admissionFile", file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("ফাইল সাইজ ২MB এর বেশি হতে পারবে না");
      return null;
    }

    const toastId = toast.loading("ফাইল আপলোড হচ্ছে...");
    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append("folder", field === "bannerImage" ? "banners" : "admissions");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      update(field, data.url);
      
      if (field === "admissionFile") {
        update("admissionFileType", file.type);
      }
      
      toast.success("ফাইল আপলোড সফল!", { id: toastId });
      return data.url;
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("ফাইল আপলোড ব্যর্থ হয়েছে", { id: toastId });
      return null;
    }
  };

  const uploadMultipleImages = async (files: FileList, field: "galleryImages" | "admissionImages") => {
    const toastId = toast.loading(`${files.length}টি ছবি যোগ হচ্ছে...`);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`${file.name} — ২MB এর বেশি`);
          continue;
        }

        const payload = new FormData();
        payload.append("file", file);
        payload.append("folder", field === "galleryImages" ? "gallery" : "admissions");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: payload,
        });

        const data = await response.json();

        if (response.ok) {
          newUrls.push(data.url);
        } else {
          console.error(`${field} upload individual error:`, data.error?.message);
        }
      }

      update(field, [...formData[field], ...newUrls]);
      toast.success("ছবি যোগ হয়েছে!", { id: toastId });
      return newUrls;
    } catch (err) {
      console.error(`${field} upload error:`, err);
      toast.error("কিছু ছবি আপলোড ব্যর্থ হয়েছে", { id: toastId });
      return [];
    }
  };

  const addGalleryImages = (files: FileList) => uploadMultipleImages(files, "galleryImages");
  const addAdmissionImages = (files: FileList) => uploadMultipleImages(files, "admissionImages");

  const removeGalleryImage = (i: number) => update("galleryImages", formData.galleryImages.filter((_, idx) => idx !== i));
  const removeAdmissionImage = (i: number) => update("admissionImages", formData.admissionImages.filter((_, idx) => idx !== i));

  const addGalleryVideo = () => update("galleryVideos", [...(formData.galleryVideos || []), { youtubeUrl: "", title: "" }]);
  const removeGalleryVideo = (i: number) => update("galleryVideos", (formData.galleryVideos || []).filter((_, idx) => idx !== i));
  const updateGalleryVideo = (i: number, field: string, val: string) => {
    const videos = [...(formData.galleryVideos || [])];
    videos[i] = { ...videos[i], [field]: val };
    update("galleryVideos", videos);
  };

  return {
    formData,
    madrasaId,
    isLoading,
    update,
    addRule,
    removeRule,
    updateRule,
    addDepartment,
    removeDepartment,
    updateDepartment,
    addCourse,
    removeCourse,
    updateCourse,
    addFacility,
    updateFacility,
    removeFacility,
    handleFileUpload,
    addGalleryImages,
    addAdmissionImages,
    removeGalleryImage,
    removeAdmissionImage,
    addGalleryVideo,
    removeGalleryVideo,
    updateGalleryVideo,
  };
};
