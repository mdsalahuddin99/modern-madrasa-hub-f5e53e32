import { prisma } from "@/lib/prisma";
import { Prisma, UserRole } from "@prisma/client";

export class UserRepository {
  static async findUnique(args: Prisma.UserFindUniqueArgs) {
    return prisma.user.findUnique(args);
  }

  static async findMany(args: Prisma.UserFindManyArgs) {
    return prisma.user.findMany(args);
  }

  static async create(args: Prisma.UserCreateArgs) {
    return prisma.user.create(args);
  }

  static async update(args: Prisma.UserUpdateArgs) {
    return prisma.user.update(args);
  }

  static async delete(args: Prisma.UserDeleteArgs) {
    return prisma.user.delete(args);
  }

  static async count(args: Prisma.UserCountArgs) {
    return prisma.user.count(args);
  }
}
