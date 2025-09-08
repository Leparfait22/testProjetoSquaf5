const express = require("express");
const fs = require("fs");
const Parser = require("rss-parser");
require("dotenv").config();

const app = express();
const port = 3000;

// -> URL do feed RSS do Dev.to
const RSS_URL = "https://dev.to/feed";

const parser = new Parser();

// -> Rota para extrair e salvar os dados
app.get("/api/extrair-salvar", async (req, res) => {
  try {
    const feed = await parser.parseURL(RSS_URL);

    // -> Mapeia e filtra os dados para um formato mais limpo
    const dadosFormatados = feed.items.map((item) => ({
      titulo: item.title,
      link: item.link,
      dataPublicacao: item.pubDate,
    }));

    console.log(
      `Extração e formatação concluída. Total de itens: ${dadosFormatados.length}`
    );

    //Salvar os dados em arquivo JSON
    const dadosJSON = JSON.stringify(dadosFormatados, null, 2);
    fs.writeFileSync("dados.json", dadosJSON, "utf-8");
    console.log("Arquivo salvo com sucesso em:", __dirname + "/dados.json");

    res.json(dadosFormatados);
  } catch (error) {
    console.error("Erro ao extrair e formatar o feed:", error);
    res.status(500).send("Erro ao extrair os dados do RSS.");
  }
});

// Enviar o arquivo JSON para o Bucket S3

const { enviarJson } = require("./sendJson");
const AWS = require("aws-sdk");

enviarJson();


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});