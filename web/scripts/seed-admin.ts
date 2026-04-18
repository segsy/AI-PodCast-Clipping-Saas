import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, adminUsersTable } from "../db/schema";
import { hash } from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL || "";

async function main() {
  console.log("🔌 Connecting to database...");
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql);

  const email = "admin@admin.com";
  const name = "admin";
  const password = "admin123"; // You can change this password
  const userId = "admin_user_001";

  console.log("🔐 Hashing password...");
  const hashedPassword = await hash(password, 12);

  console.log("👤 Creating user...");
  
  // Insert or update user
  await db.insert(users)
    .values({
      id: userId,
      email,
      name,
      password: hashedPassword,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name,
        password: hashedPassword,
      },
    });

  console.log("⭐ Granting admin role...");
  
  // Insert or update admin role
  await db.insert(adminUsersTable)
    .values({
      userId,
      role: "SUPER_ADMIN",
    })
    .onConflictDoUpdate({
      target: adminUsersTable.userId,
      set: {
        role: "SUPER_ADMIN",
      },
    });

  console.log("✅ Admin user created successfully!");
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role: SUPER_ADMIN`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
