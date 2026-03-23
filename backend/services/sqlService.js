const { pool } = require("../config/db");
const { generateText } = require("./geminiService");

async function getLiveSchema() {
    const tables = ["admins", "categories", "quotes", "rfps", "rfp_vendors", "vendors"];

    let schemaText = `Database schema:\n\n`;

    for (const table of tables) {
        const [rows] = await pool.query(`SHOW COLUMNS FROM ${table}`);

        schemaText += `Table: ${table}\n`;

        for (const col of rows) {
            schemaText += `- ${col.Field} (${col.Type})\n`;
        }

        schemaText += `\n`;
    }

    schemaText += `
Relationships:
- quotes.rfp_id -> rfps.id
- quotes.vendor_id -> vendors.id
- rfps.category_id -> categories.id
- vendors.category_id -> categories.id
- rfp_vendors.rfp_id -> rfps.id
- rfp_vendors.vendor_id -> vendors.id

Rules:
- Use only these tables and columns.
- Prefer explicit JOIN conditions.
- Only generate SELECT queries.
- Never generate INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE.
- Never guess a column name that is not listed above.
- If the user asks for vendor name, use CONCAT(vendors.first_name, ' ', vendors.last_name) AS vendor_name.
- If the user asks for category name, use categories.name.
- If the user asks for admin name, use admins.name.
- Use quotes table for quotation data, not vendor_quotes.
- Add LIMIT 50 unless the question clearly asks for a single aggregate result.
`;

    return schemaText;
}

async function validateTablesExist() {
    const requiredTables = ["admins", "categories", "quotes", "rfps", "rfp_vendors", "vendors"];

    for (const table of requiredTables) {
        try {
            await pool.query(`SHOW COLUMNS FROM ${table}`);
            console.log(`Schema check passed for table: ${table}`);
        } catch (error) {
            throw new Error(`Missing or invalid table '${table}': ${error.message}`);
        }
    }
}

function cleanSql(rawSql) {
    if (!rawSql) return "";

    let sql = rawSql.trim();

    sql = sql.replace(/```sql/gi, "").replace(/```/g, "").trim();

    const selectIndex = sql.toLowerCase().indexOf("select");
    if (selectIndex !== -1) {
        sql = sql.slice(selectIndex);
    }

    sql = sql.replace(/;+\s*$/, "").trim();

    return sql;
}

function validateReadOnlySql(sql) {
    if (!sql || !sql.trim()) {
        throw new Error("Generated SQL is empty.");
    }

    const normalized = sql.trim().toLowerCase();

    if (!normalized.startsWith("select")) {
        throw new Error(`Only SELECT queries are allowed. Got: ${sql}`);
    }

    if (normalized.includes(";")) {
        throw new Error("Multiple SQL statements are not allowed.");
    }

    const blocked = [
        "insert ",
        "update ",
        "delete ",
        "drop ",
        "alter ",
        "truncate ",
        "create ",
        "replace ",
        "grant ",
        "revoke ",
        "commit ",
        "rollback ",
    ];

    for (const word of blocked) {
        if (normalized.includes(word)) {
            throw new Error("Unsafe SQL detected.");
        }
    }

    return true;
}

async function detectQueryType(question) {
    const lowered = question.trim().toLowerCase();

    const sqlKeywords = [
        "vendor",
        "vendors",
        "rfp",
        "rfps",
        "quote",
        "quotes",
        "category",
        "categories",
        "admin",
        "admins",
        "amount",
        "price",
        "lowest",
        "highest",
        "list",
        "show",
        "count",
        "how many",
        "assigned",
        "open",
        "status",
    ];

    if (sqlKeywords.some((word) => lowered.includes(word))) {
        return "SQL";
    }

    const prompt = `
Classify the user question into one of these two categories only:
- SQL
- GENERAL

Return exactly one word only.
Do not explain.

Question:
${question}
`;

    const result = await generateText(prompt);
    const cleaned = result.trim().toUpperCase();

    console.log("Detected query type:", cleaned);

    return cleaned === "SQL" ? "SQL" : "GENERAL";
}

async function generateSqlFromQuestion(question) {
    const liveSchema = await getLiveSchema();

    const prompt = `
You are an expert MySQL query generator.

${liveSchema}

Convert the user's question into a valid MySQL SELECT query.

Important rules:
- Return only raw SQL
- No explanation
- No markdown
- No code fences
- Use only the schema above
- Never guess columns that are not in schema
- Never use UPDATE, DELETE, INSERT, DROP, ALTER, TRUNCATE
- If vendor name is needed, use CONCAT(vendors.first_name, ' ', vendors.last_name) AS vendor_name
- If category name is needed, join categories table and use categories.name
- If quotation data is needed, use quotes table
- If RFP title is needed, use rfps.title
- If admin data is needed, use admins table
- Use explicit JOINs

User question:
${question}
`;

    const raw = await generateText(prompt);
    console.log("Raw generated SQL:", raw);

    const sql = cleanSql(raw);
    console.log("Cleaned SQL:", sql);

    validateReadOnlySql(sql);

    if (
        !/limit\s+\d+/i.test(sql) &&
        !/count\s*\(|sum\s*\(|avg\s*\(|min\s*\(|max\s*\(/i.test(sql)
    ) {
        return `${sql} LIMIT 50`;
    }

    return sql;
}

async function runSql(sql) {
    try {
        console.log("Executing SQL:", sql);
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        console.error("MySQL query error:", error.message);
        throw new Error(`SQL execution failed: ${error.message}`);
    }
}

async function summarizeSqlResult(question, sql, rows) {
    if (!rows || rows.length === 0) {
        return "No matching data found in the database.";
    }

    const prompt = `
You are an assistant for an RFP Management System.

Convert this SQL result into a simple, short, human-friendly answer.

Question:
${question}

SQL:
${sql}

Result:
${JSON.stringify(rows, null, 2)}

Rules:
- Be concise
- Do not mention JSON
- If rows contain first_name and last_name, treat them as the vendor's full name
- If there are many rows, summarize the main insight first
- Use business-friendly wording
`;

    return await generateText(prompt);
}

async function answerGeneralQuestion(question) {
    const prompt = `
You are a helpful AI assistant for an RFP Management System.

The system contains data related to:
- admins
- vendors
- categories
- rfps
- quotes
- rfp_vendors

Answer the user's question clearly and concisely.
If the question sounds like it needs database data, prefer SQL route logic.
If it is a general platform question, answer normally in RFP/procurement context.

Question:
${question}
`;

    return await generateText(prompt);
}

module.exports = {
    detectQueryType,
    generateSqlFromQuestion,
    runSql,
    summarizeSqlResult,
    answerGeneralQuestion,
    validateTablesExist,
};