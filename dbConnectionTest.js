const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
    try {
        const uri = process.env.dbUrl;
        console.log(uri);
        await mongoose.connect(uri);
        console.log("Conexão estabelecida com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar:", error);
    }
}

connect();
