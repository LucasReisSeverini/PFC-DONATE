function autorizarProfissional(req, res, next) {
  console.log("Authorization header:", req.headers["authorization"]);

  if (req.usuario && req.usuario.profissional_de_saude) {
    return next();
  }
  return res.status(403).json({ message: "Acesso negado. Apenas profissionais de saúde." });
}


function autorizarDoadora(req, res, next) {
  if (req.usuario && req.usuario.doadora) {
    return next();
  }
  return res.status(403).json({ message: "Acesso negado. Apenas doadoras." });
}

// Você pode criar outros conforme precisar

module.exports = {
  autorizarProfissional,
  autorizarDoadora,
};
