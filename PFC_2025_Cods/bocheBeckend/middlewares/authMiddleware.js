const jwt = require("jsonwebtoken");

exports.verificarToken = (req, res, next) => {

    console.log("Headers recebidos:", req.headers);
    const authHeader = req.headers["authorization"]; // Pega o header em minúsculo
    console.log("Middleware verificarToken chamado");
    console.log("Authorization header:", req.headers["authorization"])

    if (!authHeader) {
        return res.status(401).json({ message: "Acesso negado. Nenhum token fornecido." });
    }

    const token = authHeader && authHeader.split(" ")[1]; // Remove "Bearer "

    if (!token) {
        return res.status(401).json({ message: "Token mal formatado." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Payload do token:", decoded); // aqui
        req.usuario = decoded;
        next();
    } catch (error) {
        console.error("Erro na autenticação:", error);
        res.status(401).json({ message: "Token inválido." });
    }
};
