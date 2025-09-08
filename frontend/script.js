const btnCarregar = document.getElementById("btn-carregar");
const listaArtigos = document.getElementById("lista-artigos");

btnCarregar.addEventListener("click", async () => {
  listaArtigos.innerHTML = "Carregando..."; // feedback enquanto carrega

  try {
    const response = await fetch("http://localhost:3000/api/consultar");
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const dados = await response.json();

    listaArtigos.innerHTML = ""; // limpa a lista antes de exibir

    dados.forEach((artigo) => {
      const li = document.createElement("li");
      li.classList.add("card"); // se quiser estilo de card
      li.innerHTML = `
        <h3>${artigo.titulo}</h3>
        <p>Publicado em: ${artigo.dataPublicacao}</p>
        <a href="${artigo.link}" target="_blank">Ler artigo</a>
      `;
      listaArtigos.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    listaArtigos.innerHTML = "Erro ao carregar artigos.";
  }
});
