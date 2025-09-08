// const fetch = require("node-fetch");

async function consultarJson(url) {
//   const url2 = "https://seu-bucket.s3.amazonaws.com/pasta/dados.json";

//   const url = getPublicUrl();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    console.log("Response:", response);

    const dados = await response.json();
    console.log("Conteúdo do JSON:", dados);
    return dados;
  } catch (error) {
    console.error("Erro ao consultar arquivo:", error);
  }
}

// consultarJson();
module.exports = { consultarJson };
