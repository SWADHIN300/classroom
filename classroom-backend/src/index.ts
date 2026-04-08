import { eq } from "drizzle-orm";
import { db, pool } from "./db/index.js";
import { departments } from "./db/schema/index.js";

async function main() {
  try {
    console.log("Performing CRUD operations...");

    const [newDepartment] = await db
      .insert(departments)
      .values({
        code: `DEMO-${Date.now()}`,
        name: "Demo Department",
        description: "Temporary record for CRUD validation",
      })
      .returning();

    if (!newDepartment) {
      throw new Error("Failed to create department");
    }

    console.log("CREATE: New department created:", newDepartment);

    const [foundDepartment] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, newDepartment.id));

    console.log("READ: Found department:", foundDepartment);

    const [updatedDepartment] = await db
      .update(departments)
      .set({ name: "Updated Demo Department" })
      .where(eq(departments.id, newDepartment.id))
      .returning();

    if (!updatedDepartment) {
      throw new Error("Failed to update department");
    }

    console.log("UPDATE: Department updated:", updatedDepartment);

    await db.delete(departments).where(eq(departments.id, newDepartment.id));
    console.log("DELETE: Department deleted.");

    console.log("CRUD operations completed successfully.");
  } catch (error) {
    console.error("Error performing CRUD operations:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
    console.log("Database pool closed.");
  }
}

void main();
