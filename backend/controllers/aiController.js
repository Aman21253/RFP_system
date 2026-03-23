const {
    detectQueryType,
    generateSqlFromQuestion,
    runSql,
    summarizeSqlResult,
    answerGeneralQuestion,
} = require("../services/sqlService");

async function askAssistant(req, res, next) {
    try {
        const { question } = req.body;
        console.log("Incoming question:", question);

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }

        const type = await detectQueryType(question);
        console.log("Final detected type:", type);

        if (type === "SQL") {
            const sql = await generateSqlFromQuestion(question);
            console.log("Generated SQL:", sql);

            const rows = await runSql(sql);
            console.log("SQL rows:", rows);
            const answer = await summarizeSqlResult(question, sql, rows);

            return res.json({
                success: true,
                type: "SQL",
                sql,
                answer,
                data: rows,
            });
        }

        const answer = await answerGeneralQuestion(question);

        return res.json({
            success: true,
            type: "GENERAL",
            answer,
        });
    } catch (error) {
        console.error("askAssistant error:", error);
        next(error);
    }
}

module.exports = {
    askAssistant,
};