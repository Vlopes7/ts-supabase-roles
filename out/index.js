import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const email = "julia@julia.com";
const senha = "1234567";
async function loginUser() {
    var _a;
    const { data: dataLogin, error: errorLogin } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
    });
    if (errorLogin) {
        console.error("Erro no login:", errorLogin);
        return;
    }
    const id = (_a = dataLogin.session) === null || _a === void 0 ? void 0 : _a.user.id;
    console.log("ID do usuário:", id);
    const { data: dataSelect, error } = await supabase
        .from("usuarios")
        .select("*");
    if (error) {
        console.error("Erro na consulta:", error);
        return;
    }
    console.log(dataSelect);
}
async function createUser() {
    const email = "junior@junior.com";
    const senha = "1234567";
    const cpf = "541891891";
    const role = "user";
    const nome = "Junior";
    const empresa = "Entrenova";
    try {
        let user;
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        });
        if (loginError) {
            console.log("Usuário não encontrado. Criando conta...");
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password: senha,
            });
            if (signUpError) {
                throw new Error("Erro ao criar usuário: " + signUpError.message);
            }
            user = signUpData.user;
            console.log("Conta criada com sucesso:", user === null || user === void 0 ? void 0 : user.id);
        }
        else {
            console.log("Usuário já existe. Login bem-sucedido.");
            user = loginData.user;
        }
        if (!user) {
            throw new Error("Usuário não encontrado após login ou signup.");
        }
        const id = user.id;
        const { data: existingUser, error: selectError } = await supabase
            .from("usuarios")
            .select("*")
            .eq("id", id)
            .single();
        if (selectError && selectError.code !== "PGRST116") {
            throw new Error("Erro ao verificar se o usuário existe: " + selectError.message);
        }
        if (existingUser) {
            console.log("Usuário já está na tabela 'usuarios'.");
        }
        else {
            const { error: insertError } = await supabase.from("usuarios").insert({
                id,
                nome,
                email,
                cpf,
                role,
                empresa,
                senha
            });
            if (insertError) {
                throw new Error("Erro ao inserir dados na tabela 'usuarios': " + insertError.message);
            }
            console.log("Usuário inserido com sucesso na tabela 'usuarios'.");
        }
        const { data: userData, error: fetchError } = await supabase
            .from("usuarios")
            .select("*");
        if (fetchError) {
            throw new Error("Erro ao buscar dados: " + fetchError.message);
        }
        console.log(userData);
    }
    catch (err) {
        console.error("Erro:", err);
    }
}
loginUser();
