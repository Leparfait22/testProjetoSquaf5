const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const PORT2 = 4000;
app.use(cors());


// Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT2, () => {
  console.log(`Frontend rodando em http://localhost:${PORT2}`);
});
