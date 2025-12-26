import mongoose from "mongoose";

const USERNAMEDB = encodeURIComponent(process.env.USERNAMEDB!);
const PASSWORDDB = encodeURIComponent(process.env.PASSWORDDB!);

export async function connectDB(){
    try{
        await mongoose.connect(`mongodb+srv://${USERNAMEDB}:${PASSWORDDB}@cluster0.rz202ai.mongodb.net/?appName=Cluster0`);
        console.log("Conectado ao banco de dados com sucesso!");

    }catch(error){
        console.error("Erro de conexao com o banco de dados", error);
    }
}
