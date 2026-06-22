import { AdminRepository } from "@/repositories/admin.repository";
import { UserRepository } from "@/repositories/user.repository";
import { MadrasaRepository } from "@/repositories/madrasa.repository";
import { UserRole, MadrasaStatus } from "@prisma/client";

export class AdminService {
  /**
   * ড্যাশবোর্ড স্ট্যাটস
   */
  static async getStats() {
    return AdminRepository.getDashboardStats();
  }

  /**
   * সব ইউজার ম্যানেজমেন্ট
   */
  static async getUsers(roleFilter?: string) {
    const where: any = {};
    if (roleFilter) {
      const upper = roleFilter.toUpperCase();
      if (["ADMIN", "DIRECTOR"].includes(upper)) {
        where.role = upper as UserRole;
      }
    }
    return AdminRepository.findAllUsers(where);
  }

  /**
   * ইউজারের রোল পরিবর্তন
   */
  static async updateUserRole(userId: string, role: UserRole, adminId: string) {
    if (userId === adminId) {
      throw new Error("CANNOT_CHANGE_OWN_ROLE");
    }

    return UserRepository.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, role: true },
    });
  }

  /**
   * সব মাদ্রাসা ম্যানেজমেন্ট
   */
  static async getMadrasas() {
    const madrasas = await AdminRepository.findAllMadrasas();
    return madrasas.map((m) => ({
      id: m.id,
      name: m.name,
      division: m.division,
      district: m.district,
      thana: m.thana,
      category: m.category,
      board: m.board,
      established: m.established,
      students: m.students,
      teachers: m.teachers,
      description: m.description,
      address: m.address,
      phone: m.phone,
      email: m.email,
      website: m.website,
      rating: m.rating,
      featured: m.featured,
      image: m.image,
      courses: m.courses.map((c) => c.name),
      facilities: m.facilities.map((f) => f.name),
      status: m.status,
    }));
  }

  /**
   * মাদ্রাসার স্ট্যাটাস আপডেট (Approval/Rejection)
   */
  static async updateMadrasaStatus(id: string, status: MadrasaStatus) {
    return MadrasaRepository.update({
      where: { id },
      data: { status },
    });
  }
}
