require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Configuração do S3 usando variáveis de ambiente
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN, // necessário para credenciais temporárias
  region: process.env.AWS_REGION
});

function enviarJson() {
  const arquivoJson = path.join(__dirname, "dados2.json");

  if (!fs.existsSync(arquivoJson)) {
    console.error("Arquivo dados.json não encontrado!");
    return;
  }

  const dados = fs.readFileSync(arquivoJson);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: "squad5/dados2.json",
    Body: dados,
    ContentType: "application/json"
  };

  s3.putObject(params, (err, data) => {
    if (err) {
      console.error(" Erro ao enviar arquivo:", err);
    } else {
      console.log(" Arquivo enviado com sucesso!", data);
    }
  });
}

module.exports = { enviarJson };