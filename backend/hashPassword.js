const bcrypt = require("bcryptjs");

async function run() {
    try {
        const hashed = await bcrypt.hash("123456", 10);
        console.log("Hashed Password:", hashed);
    } catch (error) {
        console.log("Error:", error);
    }
}

run();