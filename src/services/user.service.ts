import { UserRepository } from "@/repositories/user.repository";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validations";
import { z } from "zod";

export type SignupInput = z.infer<typeof signupSchema>;

export class UserService {
  static async createUser(data: SignupInput) {
    const { name, email: rawEmail, password } = data;
    const email = rawEmail.toLowerCase();

    // Check existing
    const existing = await UserRepository.findUnique({ where: { email } });
    if (existing) {
      throw new Error("ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    return UserRepository.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "DIRECTOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return UserRepository.findUnique({ where: { email: email.toLowerCase() } });
  }

  static async findById(id: string) {
    return UserRepository.findUnique({ where: { id } });
  }

  static async updateProfile(id: string, data: any) {
    return UserRepository.update({
      where: { id },
      data,
    });
  }
}
