document.addEventListener("DOMContentLoaded", () => {
  const adicionarNovaVendaBtn = document.getElementById("adicionarNovaVenda");
  const vendasContainer = document.getElementById("vendasContainer");
  const popupNovaVenda = document.getElementById("popupNovaVenda");
  const formNovaVenda = document.getElementById("formNovaVenda");
  const tipoSelect = document.getElementById("tipo");

  adicionarNovaVendaBtn.addEventListener("click", () => {
    popupNovaVenda.style.display = "block";
  });

  popupNovaVenda.addEventListener("click", function (e) {
    if (e.target === popupNovaVenda) {
      popupNovaVenda.style.display = "none";
    }
  });

  formNovaVenda.addEventListener("submit", function (e) {
    e.preventDefault();
    const editandoId = this.dataset.editandoId;

    if (editandoId) {
      atualizarVenda(editandoId);
    } else {
      const novaVenda = criarNovaVenda();
      vendasContainer.prepend(novaVenda);
    }

    popupNovaVenda.style.display = "none";
    this.reset();
    delete this.dataset.editandoId;
  });

  tipoSelect.addEventListener("change", function () {
    const tipo = this.value;
    const campos = formNovaVenda.querySelectorAll(".campo");

    campos.forEach((campo) => {
      campo.classList.remove("ativo");
      if (tipo === "VENDA" && campo.classList.contains("venda")) {
        campo.classList.add("ativo");
      } else if (tipo === "VISITA" && campo.classList.contains("visita")) {
        campo.classList.add("ativo");
      }
    });
  });

  const popupDetalhes = document.getElementById("popupDetalhes");
  const detalhesConteudo = document.getElementById("detalhesConteudo");
  const fecharDetalhes = document.getElementById("fecharDetalhes");

  fecharDetalhes.addEventListener("click", () => {
    popupDetalhes.style.display = "none";
  });

  const imovelHeader = document.getElementById("imovelHeader");
  const documentosImovel = document.getElementById("documentosImovel");
  const minutasHeader = document.getElementById("minutasHeader");
  const documentosMinutas = document.getElementById("documentosMinutas");

  imovelHeader.addEventListener("click", () => {
    documentosImovel.style.display =
      documentosImovel.style.display === "none" ? "block" : "none";
  });

  minutasHeader.addEventListener("click", () => {
    documentosMinutas.style.display =
      documentosMinutas.style.display === "none" ? "block" : "none";
  });

  // Adicionar eventos aos botões "Editar" e "Detalhes" existentes
  adicionarEventosEditarExistentes();
});

function criarNovaVenda() {
  const venda = document.createElement("div");
  venda.className = "venda";

  const tipo = document.getElementById("tipo").value;
  const endereco = document.getElementById("endereco").value;
  const vgv = document.getElementById("vgv").value;
  const corretorVendedor = document.getElementById("corretorVendedor").value;
  const corretorCaptador = document.getElementById("corretorCaptador").value;
  const id = Math.floor(Math.random() * 1000000);
  const pendencias = Math.floor(Math.random() * 5) + 1;

  let conteudo = `
    <h2>${tipo} - ${id}</h2>
    <p>Endereço: ${endereco}</p>
    <p>VGV: ${vgv}</p>
    <p>Corretor Vendedor: ${corretorVendedor}</p>
    <p>Corretor Captador: ${corretorCaptador}</p>
  `;

  if (tipo === "VENDA") {
    const numeroVendedores = document.getElementById("numeroVendedores").value;
    const numeroCompradores =
      document.getElementById("numeroCompradores").value;
    conteudo += `
      <p>Número de Vendedores: ${numeroVendedores}</p>
      <p>Número de Compradores: ${numeroCompradores}</p>
    `;
  }

  conteudo += `
    <p class="pendencias">${pendencias} Pendências</p>
    <button class="editar-venda" data-id="${id}">Editar</button>
    <button class="detalhes-venda" data-id="${id}">Detalhes</button>
  `;

  venda.innerHTML = conteudo;

  const editarButton = venda.querySelector(".editar-venda");
  editarButton.addEventListener("click", (e) => {
    e.stopPropagation();
    abrirPopupEdicao(id);
  });

  const detalhesButton = venda.querySelector(".detalhes-venda");
  detalhesButton.addEventListener("click", (e) => {
    e.stopPropagation();
    abrirPopupDetalhes(id);
  });

  return venda;
}

function adicionarVendaExemplo(titulo, pendencias) {
  const venda = document.createElement("div");
  venda.className = "venda";
  const id = Math.floor(Math.random() * 1000000);
  venda.innerHTML = `
    <h2>${titulo}</h2>
    <p>Clique para ver detalhes</p>
    <p class="pendencias">${pendencias} Pendências</p>
    <button class="editar-venda" data-id="${id}">Editar</button>
  `;
  vendasContainer.appendChild(venda);

  // Adicionar o evento de clique ao botão "Editar"
  venda.querySelector(".editar-venda").addEventListener("click", (e) => {
    e.stopPropagation();
    abrirPopupEdicao(id);
  });
}

function abrirPopupEdicao(id) {
  const venda = document
    .querySelector(`.venda .editar-venda[data-id="${id}"]`)
    .closest(".venda");
  const tipo = venda.querySelector("h2").textContent.split(" - ")[0];
  const endereco = venda
    .querySelector("p:nth-child(2)")
    .textContent.split(": ")[1];
  const vgv = venda.querySelector("p:nth-child(3)").textContent.split(": ")[1];
  const corretorVendedor = venda
    .querySelector("p:nth-child(4)")
    .textContent.split(": ")[1];
  const corretorCaptador = venda
    .querySelector("p:nth-child(5)")
    .textContent.split(": ")[1];

  document.getElementById("tipo").value = tipo;
  document.getElementById("endereco").value = endereco;
  document.getElementById("vgv").value = vgv;
  document.getElementById("corretorVendedor").value = corretorVendedor;
  document.getElementById("corretorCaptador").value = corretorCaptador;

  if (tipo === "VENDA") {
    const numeroVendedores = venda
      .querySelector("p:nth-child(6)")
      .textContent.split(": ")[1];
    const numeroCompradores = venda
      .querySelector("p:nth-child(7)")
      .textContent.split(": ")[1];
    document.getElementById("numeroVendedores").value = numeroVendedores;
    document.getElementById("numeroCompradores").value = numeroCompradores;
  }

  formNovaVenda.dataset.editandoId = id;
  popupNovaVenda.style.display = "block";

  // Ativar os campos apropriados
  tipoSelect.dispatchEvent(new Event("change")); // Atualiza os campos com base no tipo selecionado

  // Adicionar evento de mudança para o tipo
  tipoSelect.addEventListener("change", function () {
    const tipoSelecionado = this.value;
    const campos = formNovaVenda.querySelectorAll(".campo");

    campos.forEach((campo) => {
      campo.classList.remove("ativo");
      if (tipoSelecionado === "VENDA" && campo.classList.contains("venda")) {
        campo.classList.add("ativo");
      } else if (
        tipoSelecionado === "VISITA" &&
        campo.classList.contains("visita")
      ) {
        campo.classList.add("ativo");
      }
    });
  });
}

function atualizarVenda(id) {
  const venda = document
    .querySelector(`.venda .editar-venda[data-id="${id}"]`)
    .closest(".venda");
  const tipo = document.getElementById("tipo").value;
  const campos = [
    { id: "tipo", selector: "h2" },
    { id: "endereco", selector: "p:nth-child(2)" },
    { id: "vgv", selector: "p:nth-child(3)" },
    { id: "corretorVendedor", selector: "p:nth-child(4)" },
    { id: "corretorCaptador", selector: "p:nth-child(5)" },
  ];

  campos.forEach((campo) => {
    const novoValor = document.getElementById(campo.id).value;
    const elementoAtual = venda.querySelector(campo.selector);
    let valorAtual;

    if (campo.id === "tipo") {
      valorAtual = elementoAtual.textContent.split(" - ")[0];
    } else {
      valorAtual = elementoAtual.textContent.split(": ")[1];
    }

    if (novoValor !== valorAtual) {
      if (campo.id === "tipo") {
        elementoAtual.textContent = `${novoValor} - ${id}`;
      } else {
        elementoAtual.textContent = `${
          elementoAtual.textContent.split(": ")[0]
        }: ${novoValor}`;
      }
    }
  });

  // Atualizar campos específicos de VENDA
  if (tipo === "VENDA") {
    const numeroVendedores = document.getElementById("numeroVendedores").value;
    const numeroCompradores =
      document.getElementById("numeroCompradores").value;
    let pVendedores = venda.querySelector("p.numero-vendedores");
    let pCompradores = venda.querySelector("p.numero-compradores");

    if (!pVendedores) {
      pVendedores = document.createElement("p");
      pVendedores.className = "numero-vendedores";
      venda.insertBefore(pVendedores, venda.querySelector(".pendencias"));
    }
    pVendedores.textContent = `Número de Vendedores: ${numeroVendedores}`;

    if (!pCompradores) {
      pCompradores = document.createElement("p");
      pCompradores.className = "numero-compradores";
      venda.insertBefore(pCompradores, venda.querySelector(".pendencias"));
    }
    pCompradores.textContent = `Número de Compradores: ${numeroCompradores}`;
  } else {
    // Remove campos específicos de VENDA se o tipo for VISITA
    const pVendedores = venda.querySelector("p.numero-vendedores");
    const pCompradores = venda.querySelector("p.numero-compradores");
    if (pVendedores) pVendedores.remove();
    if (pCompradores) pCompradores.remove();
  }

  // Atualizar o número de pendências
  const pendenciasElement = venda.querySelector(".pendencias");
  const pendencias = pendenciasElement.textContent.split(" ")[0];
  pendenciasElement.textContent = `${pendencias} Pendências`;
}

function adicionarEventosEditarExistentes() {
  const botoesEditar = document.querySelectorAll(".editar-venda");
  botoesEditar.forEach((botao) => {
    botao.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = e.target.dataset.id;
      abrirPopupEdicao(id);
    });
  });
}

function abrirPopupDetalhes(id) {
  const venda = document
    .querySelector(`.venda .detalhes-venda[data-id="${id}"]`)
    .closest(".venda");

  const tipo = venda.querySelector("h2").textContent;
  const endereco = venda.querySelector("p:nth-child(2)").textContent;
  const vgv = venda.querySelector("p:nth-child(3)").textContent;
  const corretorVendedor = venda.querySelector("p:nth-child(4)").textContent;
  const corretorCaptador = venda.querySelector("p:nth-child(5)").textContent;

  let conteudo = `
    <strong>${tipo}</strong><br>
    ${endereco}<br>
    ${vgv}<br>
    ${corretorVendedor}<br>
    ${corretorCaptador}<br>
  `;

  if (tipo.includes("VENDA")) {
    const numeroVendedores = venda.querySelector("p.numero-vendedores")
      ? venda.querySelector("p.numero-vendedores").textContent
      : "";
    const numeroCompradores = venda.querySelector("p.numero-compradores")
      ? venda.querySelector("p.numero-compradores").textContent
      : "";
    conteudo += `
      ${numeroVendedores}<br>
      ${numeroCompradores}<br>
    `;
  }

  detalhesConteudo.innerHTML = conteudo;
  document.getElementById("documentosImovel").style.display = "none"; // Inicialmente oculto
  popupDetalhes.style.display = "block";
}
