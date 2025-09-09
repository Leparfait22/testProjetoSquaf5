// server.js
const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");
const fs = require("fs");
const path = require("path");

const { enviarJson, getPublicUrl } = require("./awsUtils");

require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend"))); 

const parser = new Parser();
const RSS_URL = "https://dev.to/feed";

// Rota para extrair RSS e salvar localmente
app.get("/api/extrair", async (req, res) => {
  try {
    const feed = await parser.parseURL(RSS_URL);
    const dadosFormatados = feed.items.map((item) => ({
      titulo: item.title,
      link: item.link,
      dataPublicacao: item.pubDate,
    }));

    const dadosJSON = JSON.stringify(dadosFormatados, null, 2);
    fs.writeFileSync(path.join(__dirname, "dados.json"), dadosJSON, "utf-8");

    console.log("Arquivo salvo com sucesso:", __dirname + "/dados.json");
    res.json(dadosFormatados);
  } catch (error) {
    console.error("Erro ao extrair RSS:", error);
    res.status(500).send("Erro ao extrair os dados do RSS.");
  }
});

// Rota para enviar JSON para o S3
app.get("/api/upload", (req, res) => {
  enviarJson();
  res.json({ message: "Upload para S3 iniciado!" });
});

// Rota para obter URL pré-assinada
app.get("/api/geturl", (req, res) => {
  try {
    const url = getPublicUrl();
    res.json({ url });
  } catch (error) {
    console.error("Erro ao gerar URL pré-assinada:", error);
    res.status(500).send("Erro ao gerar URL.");
  }
});

// Rota para consultar JSON direto do S3 via URL pré-assinada
app.get("/api/consultar", async (req, res) => {
  try {
    const url = process.env.PUBLIC_URL; // gera a URL pré-assinada
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    const dados = await response.json();
    res.json(dados);
  } catch (error) {
    console.error("Erro ao consultar JSON público:", error);
    res.status(500).send("Erro ao consultar JSON.");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
