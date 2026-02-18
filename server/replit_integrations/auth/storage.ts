import { users, type User, type UpsertUser } from "@shared/schema";
import { db } from "../../db";
import { eq } from "drizzle-orm";

const ADMIN_EMAILS = ["goldservicepoland@gmail.com", "grzegorzdur3@gmail.com"];

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const isAdminEmail = ADMIN_EMAILS.some(e => userData.email?.toLowerCase() === e.toLowerCase());
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        isAdmin: isAdminEmail,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          isAdmin: isAdminEmail,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
}

export const authStorage = new AuthStorage();
