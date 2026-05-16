import { MadrasaRepository } from "@/repositories/madrasa.repository";
import { Prisma, MadrasaStatus, MadrasaCategory, MadrasaBoard } from "@prisma/client";
import { createMadrasaSchema, updateMadrasaSchema, madrasaFilterSchema } from "@/lib/validations";
import { z } from "zod";

// Mapping Bengali labels to Prisma Enum keys
const CATEGORY_MAP: Record<string, MadrasaCategory> = {
  "জামিয়া": MadrasaCategory.JAMIA,
  "আলিয়া মাদ্রাসা": "ALIA" as MadrasaCategory,
  "মাদ্রাসা": MadrasaCategory.MADRASA,
  "হিফজুল কুরআন": MadrasaCategory.HIFZ,
  "নূরানী": MadrasaCategory.NURANI,
  "মহিলা মাদ্রাসা": MadrasaCategory.MOHILA,
  "ইসলামিক স্কুল": MadrasaCategory.ISLAMIC_SCHOOL,
  "উচ্চতর শিক্ষা প্রতিষ্ঠান": MadrasaCategory.HIGHER_EDU,
  "অন্যান্য": MadrasaCategory.OTHERS,
};

const BOARD_MAP: Record<string, MadrasaBoard> = {
  "বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ (বেফাক)": MadrasaBoard.BEFAQ,
  "বেফাকুল মাদারিসিল আরাবিয়া": MadrasaBoard.BEFAQ, // Alias for seed data
  "বেফাকুল মাদারিসিল কওমিয়া গওহরডাঙ্গা বাংলাদেশ": MadrasaBoard.GAWHARDANGA,
  "আঞ্জুমানে ইত্তেহাদুল মাদারিস বাংলাদেশ": MadrasaBoard.ITTEHADUL,
  "আযাদ দ্বীনী এদারায়ে তালীম বাংলাদেশ": MadrasaBoard.AZAD_DEENI,
  "তানজিমুল মাদারিসিদ দ্বীনিয়া বাংলাদেশ": MadrasaBoard.TANZIMUL,
  "তানজিমুল মাদারিস": MadrasaBoard.TANZIMUL, // Alias for seed data
  "বেফাকুল মাদারিসিল দ্বীনিয়া বাংলাদেশ (জাতীয় দ্বীনি মাদ্রাসা শিক্ষা বোর্ড)": MadrasaBoard.JATIYA_DEENI,
};

// Reverse mappings for frontend display
const REVERSE_CATEGORY_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

const REVERSE_BOARD_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(BOARD_MAP).map(([k, v]) => [v, k])
);

// Helper to transform Prisma Madrasa to Frontend Madrasa
const transformMadrasa = (m: any) => ({
  ...m,
  category: REVERSE_CATEGORY_MAP[m.category] || m.category,
  board: REVERSE_BOARD_MAP[m.board] || m.board,
});

export type MadrasaFilters = z.infer<typeof madrasaFilterSchema>;
export type CreateMadrasaInput = z.infer<typeof createMadrasaSchema>;
export type UpdateMadrasaInput = z.infer<typeof updateMadrasaSchema>;

export class MadrasaService {
  /**
   * গেট অল মাদ্রাসা (ফিল্টার এবং পেজিনেশন সহ)
   */
  static async getAll(filters: any) {
    const { division, district, thana, category, board, search, featured, page, limit, directorId, status } = filters;
    const pageNumber = page ?? 1;
    const pageLimit = limit ?? 12;

    const where: Prisma.MadrasaWhereInput = {};

    // ১. স্ট্যাটাস ফিল্টারিং লজিক
    if (status) {
      where.status = status;
    } else if (!directorId) {
      // যদি পাবলিকলি সার্চ করা হয় (কোন directorId নেই), তবে শুধু APPROVED গুলো দেখাবে
      where.status = "APPROVED";
    }
    // অন্যথায় (যদি directorId থাকে এবং status না থাকে), সব স্ট্যাটাস দেখাবে (ডিরেক্টরের নিজের জন্য)

    if (directorId) where.directorId = directorId;
    if (division) where.division = division;
    if (district) where.district = district;
    if (thana) where.thana = thana;

    // Handle Category Mapping (Bengali Label to Enum Key)
    if (category) {
      const enumCategory = CATEGORY_MAP[category] || (Object.values(MadrasaCategory).includes(category as any) ? category : null);
      if (enumCategory) {
        where.category = enumCategory as MadrasaCategory;
      }
    }

    // Handle Board Mapping (Bengali Label to Enum Key)
    if (board) {
      const enumBoard = BOARD_MAP[board] || (Object.values(MadrasaBoard).includes(board as any) ? board : null);
      if (enumBoard) {
        where.board = enumBoard as MadrasaBoard;
      }
    }

    if (featured === "true") where.featured = true;
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [madrasas, total] = await Promise.all([
      MadrasaRepository.findMany({
        where,
        include: { 
          courses: true, 
          facilities: true,
          _count: {
            select: { galleryImages: true }
          }
        },
        skip: (pageNumber - 1) * pageLimit,
        take: pageLimit,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      }),
      MadrasaRepository.count({ where }),
    ]);

    return {
      madrasas: madrasas.map(transformMadrasa),
      pagination: {
        page: pageNumber,
        limit: pageLimit,
        total,
        totalPages: Math.ceil(total / pageLimit),
      },
    };
  }

  /**
   * আইডি দিয়ে মাদ্রাসা খুঁজে বের করা
   */
  static async getById(id: string) {
    const madrasa = await MadrasaRepository.findUnique({
      where: { id },
      include: {
        courses: true,
        facilities: true,
        galleryImages: {
          orderBy: { order: "asc" }
        },
        teachersList: {
          orderBy: { createdAt: "desc" }
        },
        director: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });

    return madrasa ? transformMadrasa(madrasa) : null;
  }

  /**
   * নতুন মাদ্রাসা তৈরি করা
   */
  static async create(data: any, directorId: string) {
    // ১. সাব-ডোমেইন ইউনিকনেস চেক
    if (data.subdomain) {
      const existing = await MadrasaRepository.findUnique({
        where: { subdomain: data.subdomain }
      });
      if (existing) {
        throw new Error("এই সাব-ডোমেইনটি ইতিমধ্যে ব্যবহার করা হয়েছে।");
      }
    }

    const madrasa = await MadrasaRepository.create({
      data: {
        ...Object.fromEntries(
          Object.entries(data).filter(([key]) => !['courses', 'facilities', 'departments', 'teachersList', 'category', 'board'].includes(key))
        ),
        directorId,
        status: "PENDING",
        category: CATEGORY_MAP[data.category] || data.category as MadrasaCategory,
        board: BOARD_MAP[data.board] || data.board as MadrasaBoard,
        departments: data.departments as any,
        courses: {
          create: (data.courses ?? []).map((name: string) => ({ name })),
        },
        facilities: {
          create: (data.facilities ?? []).map((name: string) => ({ name })),
        },
        teachersList: {
          create: (data.teachersList ?? []).map((t: any) => ({
            name: t.name,
            designation: t.designation,
            department: t.department,
            image: t.image,
            bio: t.bio,
          })),
        },
      } as any,
      include: { courses: true, facilities: true, teachersList: true },
    });

    return transformMadrasa(madrasa);
  }

  /**
   * মাদ্রাসা আপডেট করা
   */
  static async update(id: string, data: any) {
    const { courses, facilities, teachersList, subdomain, category, board, ...rest } = data;

    // ১. সাব-ডোমেইন ইউনিকনেস চেক
    if (subdomain) {
      const existing = await MadrasaRepository.findUnique({
        where: { subdomain }
      });
      if (existing && existing.id !== id) {
        throw new Error("এই সাব-ডোমেইনটি ইতিমধ্যে ব্যবহার করা হয়েছে।");
      }
    }

    const updateData: Prisma.MadrasaUpdateInput = { 
      ...Object.fromEntries(
        Object.entries(rest).filter(([key]) => !['category', 'board'].includes(key))
      ),
      subdomain,
      category: category ? (CATEGORY_MAP[category] || category as MadrasaCategory) : undefined,
      board: board ? (BOARD_MAP[board] || board as MadrasaBoard) : undefined,
      status: "PENDING" // ২. আপডেট করার পর স্ট্যাটাস PENDING হয়ে যাবে (Admin Approval Required)
    } as any;

    if (courses) {
      updateData.courses = {
        deleteMany: {},
        create: courses.map((name: string) => ({ name }))
      };
    }

    if (facilities) {
      updateData.facilities = {
        deleteMany: {},
        create: facilities.map((name: string) => ({ name }))
      };
    }

    if (teachersList) {
      updateData.teachersList = {
        deleteMany: {},
        create: teachersList.map((t: any) => ({
          name: t.name,
          designation: t.designation,
          department: t.department,
          image: t.image,
          bio: t.bio,
        }))
      };
    }

    const updated = await MadrasaRepository.update({
      where: { id },
      data: updateData,
      include: { courses: true, facilities: true, teachersList: true }
    });

    return transformMadrasa(updated);
  }

  /**
   * মাদ্রাসা ডিলিট করা
   */
  static async delete(id: string) {
    return MadrasaRepository.delete({
      where: { id }
    });
  }

  /**
   * মাদ্রাসার স্ট্যাটাস আপডেট করা
   */
  static async updateStatus(id: string, status: MadrasaStatus) {
    return MadrasaRepository.update({
      where: { id },
      data: { status }
    });
  }
}
