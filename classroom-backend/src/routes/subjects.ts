import { and, desc, eq, getTableColumns, ilike, or, sql, type SQL } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema/app.js";
import { db } from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
     try {
        const { search, department, page = 1 , limit = 10 } = req.query;
        const searchTerm = typeof search === "string" ? search.trim() : "";
        const departmentTerm = typeof department === "string" ? department.trim() : "";

        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10 ), 100);
        
        const offset = (currentPage - 1) *limitPerPage;

        const filterCondition: SQL[] = [];

        if (searchTerm) {
            const searchClause = or(
                 ilike(subjects.name, `%${searchTerm}%`),
                 ilike(subjects.code, `%${searchTerm}%`)
            );

            if (searchClause) {
                filterCondition.push(searchClause);
            }
        }

        if (departmentTerm) {
            filterCondition.push(ilike(departments.name, `%${departmentTerm}%`));
        }

        const whereClause = filterCondition.length > 0 ? and(... filterCondition) : undefined;

        const countResult = await db
            .select({ count: sql<number>`count(*)`})
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause);
        
        const totalCount = Number(countResult[0]?.count ?? 0);

        const subjectList = await db
              .select({
                ... getTableColumns(subjects),
                department: { ...getTableColumns(departments)}
              }).from(subjects).leftJoin(departments, eq(subjects.departmentId, departments.id))
                .where(whereClause)
                .orderBy(desc(subjects.createdAt))
                .limit(limitPerPage)
                .offset(offset);

        res.status(200).json({
            data: subjectList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage)
            }
        })

     } catch (e) {
        console.error(`GET /subjects err: ${e}`);
        res.status(500).json({ error: "Failed to get Subject" });
     }
});

export default router;
