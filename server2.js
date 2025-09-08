const express = require("express");
const fs = require("fs");
const Parser = require("rss-parser");
require("dotenv").config();
const path = require("path");
const app = express();

const cors = require("cors");
app.use(cors());

const { enviarJson } = require("./sendJson");
const { getPublicUrl } = require("./getPublicUrl");
const { consultarJson } = require("./consultarJson");

const port = 3000;

const parser = new Parser();
const RSS_URL = "https://dev.to/feed";

// -> Extrair RSS e salvar localmente
app.get("/api/extrair-salvar", async (req, res) => {
  try {
    const feed = await parser.parseURL(RSS_URL);

    const dadosFormatados = feed.items.map((item) => ({
      titulo: item.title,
      link: item.link,
      dataPublicacao: item.pubDate,
    }));

    const dadosJSON = JSON.stringify(dadosFormatados, null, 2);
    fs.writeFileSync("dados2.json", dadosJSON, "utf-8");

    console.log("Arquivo salvo com sucesso em:", __dirname + "/dados.json");

    // res.json({ message: "Arquivo salvo localmente!", total: dadosFormatados.length });
    res.json(dadosFormatados);
  } catch (error) {
    console.error("Erro ao extrair RSS:", error);
    res.status(500).send("Erro ao extrair os dados do RSS.");
  }
});

// -> Upload JSON para S3
app.get("/api/upload", (req, res) => {
  enviarJson();
  res.json({ message: "Upload para S3 iniciado!" });
});

// -> Gerar URL pública
app.get("/api/url-publica", (req, res) => {
  const urlPublica = getPublicUrl();
  res.json({ url: urlPublica });
});

// -> Consultar JSON via URL pública
app.get("/api/consultar", async (req, res) => {
  try {
    const urlPublica = process.env.PUBLIC_URL;
    const dados = await consultarJson(urlPublica);
    // console.log(dados);
    res.json(dados);
  } catch (error) {
    console.error("Erro ao consultar JSON público:", error);
    res.status(500).send("Erro ao consultar JSON.");
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
