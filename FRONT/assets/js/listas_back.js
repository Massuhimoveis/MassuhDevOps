import {
  htmlListaImovel,
  htmlListaClientes,
  htmlcomparacao,
} from "./variaveis/propriedades.js";
import { buscarImoveis, dataModule } from "./buscar.js";
import { salvarCliente, salvarImovel } from "./editar.js";

let listasContainer = $(".lista"); // ul para renderização de listas com li
let leadsPerPage = 10; // quantidade de leads por página
let leads = [];
let properties = [];
let currentPage = 1; // Initialize the current page
let imovelSelected;
let card = $(".card");

// Define the function to compare and set the status icon (mover para outro file)
function compareAndSetStatusIcon(element, clienteValue, imovelValue) {
  console.log("Comparing values for:", element.data("parametro"));
  console.log("Cliente Value:", clienteValue);
  console.log("Imovel Value:", imovelValue);

  let isMatch = false;

  // Normalize the values to lower case for non-case-sensitive comparison
  const normalizeValue = (value) => {
    if (value === undefined || value === null) {
      return "";
    }
    if (typeof value === "boolean") {
      return value.toString().toLowerCase();
    }
    if (typeof value === "number") {
      return value.toString().trim().toLowerCase();
    }
    if (typeof value === "string") {
      return value.trim().toLowerCase();
    }
    return "";
  };

  const normalizedClienteValue = normalizeValue(clienteValue);
  const normalizedImovelValue = normalizeValue(imovelValue);

  console.log("Normalized Cliente Value:", normalizedClienteValue);
  console.log("Normalized Imovel Value:", normalizedImovelValue);

  // If one side is empty and the other is not, it's a mismatch
  if (normalizedClienteValue === "" || normalizedImovelValue === "") {
    isMatch = false;
  } else {
    // Handle boolean and undefined/null comparisons
    if (
      (normalizedClienteValue === "true" && normalizedImovelValue === "true") ||
      (normalizedClienteValue === "false" &&
        normalizedImovelValue === "false") ||
      ((normalizedClienteValue === "undefined" ||
        normalizedClienteValue === "null") &&
        (normalizedImovelValue === "undefined" ||
          normalizedImovelValue === "null"))
    ) {
      isMatch = true;
    } else {
      // Handle numeric comparisons
      const numClienteValue = parseFloat(normalizedClienteValue);
      const numImovelValue = parseFloat(normalizedImovelValue);
      if (!isNaN(numClienteValue) && !isNaN(numImovelValue)) {
        isMatch = numClienteValue === numImovelValue;
      } else {
        // Handle string comparisons
        isMatch =
          normalizedClienteValue === normalizedImovelValue ||
          normalizedClienteValue.includes(normalizedImovelValue);
      }
    }
  }
  console.log("Is Match:", isMatch);

  // Set the status icon
  if (isMatch) {
    element.css("color", "green").text("check_circle");
  } else {
    element.css("color", "red").text("cancel");
  }
}

/**
 * Renders the appropriate list based on the selected screen.
 * @param {string} tela - The selected screen ("Lista de Clientes" or "Lista de Imóveis").
 */
async function renderizarListas(tela, data) {
  listasContainer.empty(); // Clear the current list
  // console.log("Renderizando listas");
  // console.log(data);

  switch (tela) {
    case "Lista de Clientes":
      console.log("Fetching leads");
      leads = dataModule.getLeads();
      leads = Array.isArray(data.data) ? data.data : [];
      console.log(leads[1]);
      displayLeads(currentPage);
      break;
    case "Lista de Imóveis":
      console.log("Fetching properties");

      console.log("Fetching properties from dataModule:");
      properties = dataModule.getProperties();
      console.log("Fetched properties:", properties);

      properties = Array.isArray(data.data) ? data.data : [];
      displayProperties(currentPage);
      console.log("properties:", properties);
      break;
    default:
      console.log("Unknown list type");
      break;
  }
  console.log("Listas renderizadas");
}

/**
 * Displays the properties list with pagination.
 * @param {number} page - The current page number.
 */
function displayProperties(page) {
  const start = (page - 1) * leadsPerPage;
  const end = start + leadsPerPage;
  const paginatedProperties = properties.slice(start, end);

  // Reordenar propriedades por dt_atualizacao (mais recente para o mais antigo)
  paginatedProperties.sort((a, b) => {
    const aDate = new Date(a.dt_atualizacao * 1000); // Converter timestamp para data
    const bDate = new Date(b.dt_atualizacao * 1000); // Converter timestamp para data
    return bDate - aDate;
  });

  console.log("Propriedades Paginadas:", paginatedProperties);

  listasContainer.empty(); // Limpar os itens da lista atual
  paginatedProperties.forEach((property) => {
    const listItem = $(htmlListaImovel);

    // Atualizar os dados do listItem com as informações da propriedade
    const pictureLink =
      property.picture_link || "https://via.placeholder.com/250x188";
    const sanitizedPictureLink = pictureLink.replace(/^'|'$/g, "");
    listItem.find("img").attr("src", sanitizedPictureLink);
    listItem
      .find(".cardHeaderList .iconText:nth-child(1)")
      .html(
        `<span class="material-icons">bed</span><div>${
          property.quartos || 0
        } Quartos</div>`
      );
    listItem
      .find(".cardHeaderList .iconText:nth-child(2)")
      .html(
        `<span class="material-icons">bathtub</span><div>${
          property.banheiro || 0
        } Banheiros</div>`
      );
    listItem
      .find(".cardHeaderList .iconText:nth-child(3)")
      .html(
        `<span class="material-icons">directions_car</span><div>${
          property.vagas || 0
        } Vagas</div>`
      );
    listItem
      .find(".cardHeaderList .iconText:nth-child(4)")
      .html(
        `<span class="material-icons">straighten</span><div>${
          property.metragem || 0
        } m²</div>`
      );
    listItem.find(".listImoveis").text(property.advertiser || "");
    listItem.find("h3").text(property.endereco || "");
    listItem.find("h4").text("Bairro: " + (property.bairro || ""));
    listItem.find(".cardBodyDescricao").text(property.descricao || "");
    listItem.find("#precoImovel").text(formatCurrency(property.valor || 0));
    listItem.find("#verMais").attr("href", property.url_imovel || "#");

    listasContainer.append(listItem);
  });

  createPaginationControls(properties, displayProperties);
}

/**
 * Displays the client list with pagination.
 * @param {number} page - The current page number.
 */
function displayLeads(page) {
  // Sort leads by "Tempo sem contato"
  const sortedLeads = leads.sort((a, b) => {
    const aTempo = a.TEMPO_SEM_CONTATO || -Infinity;
    const bTempo = b.TEMPO_SEM_CONTATO || -Infinity;
    return bTempo - aTempo;
  });

  const start = (page - 1) * leadsPerPage;
  const end = start + leadsPerPage;
  const paginatedLeads = sortedLeads.slice(start, end);

  listasContainer.empty(); // Clear the current list items

  // Display client cards
  paginatedLeads.forEach((lead) => {
    console.log("lead:", lead);
    const listItem = $(htmlListaClientes);
    listItem.attr("data-id", lead.customer_id);

    // Populate the card with lead data, controlar numero de palavras nome
    listItem.find("h3").text(`${lead.Nome.split(" ").slice(0, 3).join(" ")}`);
    listItem
      .find("#telefone a")
      .attr(
        "href",
        ` https://app.painelzap.com.br/17424/live-chat/all/${lead.Telefone.replace(
          /\D/g,
          ""
        )}`
      )
      .text(lead.Telefone || "Não informado"); // Find the element and set the text
    listItem
      .find("#tempoSemContato")
      .text(`${lead.TEMPO_SEM_CONTATO || "Não informado"} horas`);

    // Get the value of TEMPO_SEM_CONTATO from lead object
    let tempoSemContato = lead.TEMPO_SEM_CONTATO || 0; // Default to 0 if undefined
    let element = listItem.find("#tempoSemContato");

    // Apply conditional formatting
    if (tempoSemContato < 0) {
      // PRAZO FUTURO (negative) -> VERDE
      element.css("color", "green");
    } else if (tempoSemContato >= 0 && tempoSemContato < 6) {
      // 0h - 6h -> AMARELO
      element.css("color", "yellow");
    } else if (tempoSemContato >= 6) {
      // 6h ou mais -> VERMELHO
      element.css("color", "red");
    }

    listItem.find("#statusRespondendo").text(lead.Respondendo ? "Sim" : "Não");

    // Set the filter dropdowns
    listItem
      .find("#statusSituacaoGeral")
      .val(lead.SituacaoGeral || "Não informado");
    listItem
      .find("#statusAtendimento")
      .val(lead.ATENDIMENTO || "Não informado");
    listItem.find("#statusCaptacao").val(lead.CAPTACAO || "Não informado");

    listasContainer.append(listItem); // Append client card to the list
  });

  createPaginationControls(leads, displayLeads); // Pagination controls
}

//Funçao de salvar as ediçoes de leads direto no card da primeira página
// Função de salvar as edições de leads diretamente no card da primeira página
function saveCards(tela, id) {
  let item, salvarFuncao;
  const dadosModificados = {};

  console.log("Iniciando saveCards para tela:", tela, "e id:", id);

  // Coletar dados salvos dependendo da tela
  if (tela === "Lista de Clientes") {
    const leads = dataModule.getLeads();
    item = leads.find((lead) => lead.customer_id == id);
    salvarFuncao = salvarCliente;
    console.log("Cliente encontrado:", item);
  } else if (tela === "Lista de Imóveis") {
    const imoveis = dataModule.getProperties();
    item = imoveis.find((imovel) => imovel.url_imovel == id);
    salvarFuncao = salvarImovel;
    console.log("Imóvel encontrado:", item);
  }

  // Se nenhum item for encontrado, logar um erro e sair da função
  if (!item) {
    console.error("Item não encontrado para o id:", id);
    return;
  }

  // Coletar dados do card que já estão editados
  const card = $(`[data-id="${id}"]`);
  console.log("Card encontrado:", card);

  card.find("input, select, textarea").each(function () {
    const fieldId = $(this).attr("id");
    const fieldValue = $(this).val();
    console.log("Campo editado:", fieldId, "com valor:", fieldValue);

    if (fieldValue !== undefined && fieldValue !== item[fieldId]) {
      dadosModificados[fieldId] = fieldValue;
    }
  });

  // Copiar os valores de status para os campos correspondentes
  if (dadosModificados.statusAtendimento) {
    dadosModificados.ATENDIMENTO = dadosModificados.statusAtendimento;
  }
  if (dadosModificados.statusCaptacao) {
    dadosModificados.CAPTACAO = dadosModificados.statusCaptacao;
  }
  if (dadosModificados.statusSituacaoGeral) {
    dadosModificados.SituacaoGeral = dadosModificados.statusSituacaoGeral;
  }

  // Verifica se há modificações antes de continuar
  if (Object.keys(dadosModificados).length === 0) {
    console.log("Nenhuma modificação detectada. Nada a salvar.");
    return;
  }

  console.log("Dados modificados para salvar:", dadosModificados);
  console.log("item:", item);

  // Reaproveitando a função de salvar de editar.js
  salvarFuncao(item.customer_id, dadosModificados, () => {
    // Atualiza o item com os dados modificados
    Object.assign(item, dadosModificados);
    console.log("Dados após salvar:", item);

    // Esconder a tela de carregamento
    $(".loadingScreen").css("display", "none");
  });
}

/**
 * Creates pagination controls for the provided data.
 * @param {Array} arrayJson - The data to paginate.
 * @param {Function} displayFunction - The function to render the paginated data.
 */
function createPaginationControls(arrayJson, displayFunction) {
  const paginationControls = $("#pagination-controls");
  paginationControls.empty(); // Clear existing controls

  const totalPages = Math.ceil(arrayJson.length / leadsPerPage);
  const maxPagesToShow = 5;
  const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

  let startPage = Math.max(1, currentPage - halfMaxPagesToShow);
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  if (currentPage > 1) {
    const prevButton = $("<button>&laquo;</button>");
    prevButton.on("click", () => {
      currentPage--;
      displayFunction(currentPage);
      createPaginationControls(arrayJson, displayFunction);
    });
    paginationControls.append(prevButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = $(`<button>${i}</button>`);
    button.on("click", () => {
      currentPage = i;
      displayFunction(currentPage);
      createPaginationControls(arrayJson, displayFunction);
    });

    if (i === currentPage) {
      button.addClass("active");
    }

    paginationControls.append(button);
  }

  if (currentPage < totalPages) {
    const nextButton = $("<button>&raquo;</button>");
    nextButton.on("click", () => {
      currentPage++;
      displayFunction(currentPage);
      createPaginationControls(arrayJson, displayFunction);
    });
    paginationControls.append(nextButton);
  }
}

/**
 * Formats a number as Brazilian currency.
 * @param {number} value - The number to format.
 * @returns {string} - The formatted currency string.
 */
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function compararClienteImovel(element, clienteMomento) {
  console.log("Entrou dentro da função");

  try {
    // Log the element and clienteMomento for debugging
    console.log("Elemento:", element);
    console.log("Cliente:", clienteMomento);

    // Inserir informações do imóvel clicado
    const imovelClicado = element.closest("li");
    console.log("Imóvel Clicado:", imovelClicado);

    const imgSrc = imovelClicado.find("img").attr("src");
    const titulo = imovelClicado.find(".cardBody > h3").text();
    const metragem = imovelClicado
      .find(".iconText span:contains('square_foot')")
      .parent()
      .contents()
      .filter(function () {
        return this.nodeType === 3;
      })
      .text()
      .trim();
    const bairro = imovelClicado.find("#bairroImovel").text();
    const valor = imovelClicado.find("#precoImovel").text();
    const tabela = $("#tabelaComparacao2");
    console.log($("#tabelaComparacao2").is(":visible"));

    // Clear the table before appending new data
    tabela.empty();

    console.log("Imagem:", imgSrc);
    console.log("Título:", titulo);
    console.log("Metragem:", metragem);
    console.log("Bairro:", bairro);
    console.log("Valor:", valor);

    //$("#imgCardImovel-recomendacao").attr("src", imgSrc);
    $("#tituloImovel-recomendacao").text(titulo);
    $("#metragemImovel-recomendacao").text(metragem);
    $("#bairroImovel-recomendacao").text(bairro);
    $("#valorImovel-recomendacao").text(valor);

    // Obter dados do imóvel e salvar em uma variável
    let imovelURLComparativo = imovelClicado.find("#verMais").attr("href");
    imovelSelected = imovelURLComparativo;
    console.log("URL do Imóvel:", imovelURLComparativo);

    buscarImoveis((imovelData) => {
      console.log("Dados do Imóvel Recebidos:", imovelData);
      if (imovelData.data && imovelData.data.length > 0) {
        const imovel = imovelData.data[0];

        let listItem = $(htmlcomparacao);
        console.log("ListItem content before append:", listItem.html());
        const rows = listItem.find("tr").toArray();
        console.log("Número de linhas a serem processadas:", rows.length);
        //console.log("rows:", rows);

        rows.forEach((row, index) => {
          const rowElement = $(row);
          const cellsClient = rowElement.find("td:nth-child(2)");
          const cellsImoveis = rowElement.find("td:nth-child(3)");
          const cellsStatus = rowElement.find("td:nth-child(4) span");
          const clientParam = cellsClient.data("parametro");
          const imoveisParam = cellsImoveis.data("parametro");

          // Pass the actual values to the compareAndSetStatusIcon function
          const clienteValue = clienteMomento[clientParam] || "";
          const imovelValue = imovel[imoveisParam] || "";

          if (clienteValue === "" && rowElement.index() !== 0) {
            rowElement.remove();
            return; // Skip further processing for this row
          }

          if (clienteMomento.hasOwnProperty(clientParam)) {
            cellsClient.text(clienteMomento[clientParam]);
          }

          if (imovel.hasOwnProperty(imoveisParam)) {
            cellsImoveis.text(imovel[imoveisParam]);
            console.log(`Set imovel[${imoveisParam}] to`, imovel[imoveisParam]);
          }

          //console.log(`Comparing values for status icon: clienteValue = ${clienteValue}, imovelValue = ${imovelValue}`);
          console.log(
            `Comparando ícones de status na linha ${index}: clienteValue = ${clienteValue}, imovelValue = ${imovelValue}`
          );
          compareAndSetStatusIcon(cellsStatus, clienteValue, imovelValue);
        });

        console.log("Appending listItem to tabelaComparacao...");
        tabela.append(listItem);
        console.log("Tabela atualizada com sucesso.");
      }
    }, `url_imovel=${imovelURLComparativo}`);
  } catch (error) {
    console.error("Error occurred in compararClienteImovel function:", error);
  }
}

export {
  renderizarListas,
  displayProperties,
  createPaginationControls,
  compararClienteImovel,
  imovelSelected,
  saveCards,
};
