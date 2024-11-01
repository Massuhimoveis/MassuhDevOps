// Imports
import { renderizarFiltros, aplicarFiltros } from "./filtros.js";
import { gerarFormulario } from "./formularios.js";
import {
  buscarRecomendacao,
  buscarImoveis,
  buscarHTML,
  buscarClientes,
} from "./buscar.js";
import {
  createPaginationControls,
  compararClienteImovel,
  imovelSelected,
  saveCards,
} from "./listas.js";
import { htmlcomparacao } from "./variaveis/propriedades.js";

// Global variables
let clienteAtual;
const leadsPerPage = 10;
let currentPage = 1;
let customerIDtemp;
let mainHeader;
let aside;

$(function () {
  // DOM-dependent variables
  mainHeader = $("#titulo-pagina"); // Page title
  aside = $("aside"); // The aside is structured as aside > ul > li

  $("#filters-sidebar").hide();
  buscarClientes((data) => {
    $("#aside-clientes a").text("Lista de Clientes");
    $("#aside-clientes a").css("cursor", "pointer");
  });
  renderizarMain("Lista de Imóveis"); // Render the main content

  // General event listeners

  // Listener for clicks on aside list items
  aside.on("click", "li", function () {
    aside.find("li").removeClass("active");
    $(this).addClass("active");

    let titulo = $(this).find("a").text();
    renderizarMain(titulo);
  });

  // Scroll behavior for #limparFiltro
  var limparFiltro = $("#limparFiltro");
  var headerFilters = $(".header-filters");
  var headerHeight = headerFilters.outerHeight();
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > headerHeight) {
      limparFiltro.css({
        position: "fixed",
        bottom: "10px",
        right: "10px",
      });
    } else {
      limparFiltro.css({
        position: "relative",
        bottom: "auto",
        right: "auto",
      });
    }
  });

  // Listener to toggle dark mode
  $("#themeToggle").on("click", function () {
    $("html").toggleClass("dark");
    if ($("html").hasClass("dark")) {
      $(this)
        .find(".material-icons")
        .html('<i class="material-icons">wb_sunny</i>');
    } else {
      $(this)
        .find(".material-icons")
        .html('<i class="material-icons">dark_mode</i>');
    }
  });

  // Listener for saving edits directly on client/property cards
  $(document).on("click", "#salvarCards", function () {
    const customerIdsalvar = $(this).closest("li").data("id");
    console.log("Extracted customerId:", customerIdsalvar);
    saveCards($("#titulo-pagina").text(), customerIdsalvar);
  });

  // Filter-related event listeners

  // Listener to apply filters on the main page and pass the values to the hidden filters page
  $("#apply-filters-main").on("click", function () {
    let situacaoGeralMain = $(
      '.filter-container[data-variavel="SituacaoGeral"] select'
    ).val();
    let atendimentoMain = $(
      '.filter-container[data-variavel="ATENDIMENTO"] select'
    ).val();
    let captacaoMain = $(
      '.filter-container[data-variavel="CAPTACAO"] select'
    ).val();

    console.log("Main Page - Situação Geral:", situacaoGeralMain);
    console.log("Main Page - Atendimento:", atendimentoMain);
    console.log("Main Page - Captação:", captacaoMain);

    // Only pass values to the filters if they are selected or "VAZIO" is explicitly selected
    if (situacaoGeralMain && situacaoGeralMain !== "null") {
      $(
        '#filters-sidebar .filter-container[data-variavel="SituacaoGeral"] select'
      )
        .val(situacaoGeralMain)
        .trigger("change");
    }

    if (atendimentoMain && atendimentoMain !== "null") {
      $(
        '#filters-sidebar .filter-container[data-variavel="ATENDIMENTO"] select'
      )
        .val(atendimentoMain)
        .trigger("change");
    }

    if (captacaoMain && captacaoMain !== "null") {
      $('#filters-sidebar .filter-container[data-variavel="CAPTACAO"] select')
        .val(captacaoMain)
        .trigger("change");
    }

    aplicarFiltros($("#titulo-pagina").text());

    $("#filters-sidebar").css("width", "0");
    $("#filters-sidebar").hide();
  });

  // Listener to open the sidebar of filters
  $("#open-filters").on("click", function () {
    $("#filters-sidebar").css("width", "100%");
    $("#filters-sidebar").show();
  });

  // Listener to clear filters
  $("#limparFiltro").on("click", function () {
    $("#dynamic-filters")
      .find("input[type='text'], input[type='number'], input[type='date']")
      .val("");

    $("#dynamic-filters")
      .find("select")
      .each(function () {
        $(this).val($(this).find("option:first").val()).trigger("change");
      });

    $("select[multiple]").val(null).trigger("change");

    $("#dynamic-filters")
      .find("input[type='checkbox'], input[type='radio']")
      .prop("checked", false);

    $("#advanced-filters").addClass("hidden");
  });

  // Listener to close the sidebar of filters
  $(".close").on("click", function () {
    $("#filters-sidebar").css("width", "0");
    $("#filters-sidebar").hide();
  });

  // Listener to apply filters
  $("#apply-filters").on("click", function () {
    aplicarFiltros($("#titulo-pagina").text());
    $("#filters-sidebar").css("width", "0");
    $("#filters-sidebar").hide();
  });

  // Form-related event listeners

  // Listener to close the form
  $(".closeFormularios").on("click", function () {
    $("#formulario").empty();
    $(".formularios").css("display", "none");
  });

  // Listener to edit lead
  $(document).on("click", "#editarLead", function () {
    console.log("Editando lead");
    gerarFormulario(
      $("#titulo-pagina").text(),
      $(this).closest("li").data("id")
    );
    $(".formularios").css("display", "flex");
  });

  // Listener to edit property
  $(document).on("click", "#editarInformacoes", function () {
    console.log("Editando imóvel");
    gerarFormulario($("#titulo-pagina").text(), $("#verMais").attr("href"));
    $(".formularios").css("display", "flex");
  });

  // Listener to edit property within comparison part
  $(document).on("click", "#editarCompararCliente", function () {
    console.log("Editando imóvel");
    $("#editarCompararCliente").on(
      "click",
      gerarFormulario("Lista de Imóveis", imovelSelected)
    );
    $(".formularios").css("display", "flex");
  });

  // Listener to edit lead recommendation
  $(document).on("click", "#editarLeadRecomendacao", function () {
    gerarFormulario($("#titulo-pagina").text(), customerIDtemp);
    $(".formularios").css("display", "flex");
  });

  // Recomendacao-related event listeners

  // Listener to compare client and property
  $(document).on("click", "#compararClienteImovel", function () {
    $(".recomendacaoViewImovel").css("display", "flex");
    console.error("botao clickado com sucesso");

    try {
      compararClienteImovel($(this), clienteAtual);
    } catch (error) {
      console.error(
        "Error occurred while comparing client and property information:",
        error
      );
    }
  });

  // Listener to close the comparison page
  $(".closeRecomendacaoViewImovel").on("click", function () {
    $(".recomendacaoViewImovel").css("display", "none");
  });

  // Listener to hide/show lead recommendation
  $(document).on("click", "#esconderLeadRecomendacao", function () {
    if ($("#dadosLeadRecomendacao").css("display") !== "none") {
      $("#dadosLeadRecomendacao").css("display", "none");
    } else {
      $("#dadosLeadRecomendacao").css("display", "flex");
    }
  });

  // Listener to close recommendation view
  $(document).on("click", ".closeRecomendacao", function () {
    $(".recomendacaoView").css("display", "none");
    $("#dadosLeadRecomendacao").css("display", "flex");
  });

  // Listener to close property recommendation view
  $(document).on("click", ".closeRecomendacaoImovel", function () {
    $(".recomendacaoViewImovel").css("display", "none");
    $("#tabelaComparacao").empty();
  });

  // Listener to fetch recommendation
  $(document).on("click", "#recomendacaoButton", function () {
    console.log("Buscando recomendação");
    let customerId = $(this).closest("li").data("id");
    customerIDtemp = customerId;
    let data = "customer_id=" + customerId;

    buscarRecomendacao((response) => {
      $(".recomendacaoView").css("display", "block");

      let data = response.customer_params;
      clienteAtual = data;
      console.log(clienteAtual);

      $(".recomendacaoView h4").text(`Nome: ${data.Nome}`);

      Object.keys(data).forEach((key) => {
        if (key === "Nome") return;
        const value = data[key];
        if (
          value &&
          value !== "null" &&
          value !== "" &&
          value !== "undefined"
        ) {
          $(`.recomendacaoView [data-recomendacaoCliente='${key}']`)
            .html(`<strong>${key}:</strong><br/> ${value}`)
            .show();
        } else {
          $(`.recomendacaoView [data-recomendacaoCliente='${key}']`).hide();
        }
      });

      let properties = response.lista_recomendacao;
      displayProperties(properties, currentPage);
    }, data);
  });

  // Functions defined within the document ready function

  function displayProperties(properties, page) {
    const start = (page - 1) * leadsPerPage;
    const end = start + leadsPerPage;
    const paginatedProperties = properties.slice(start, end);

    const listasContainer = $(
      ".recomendacaoView > div:last-child > div:last-child ul"
    );
    listasContainer.empty();

    paginatedProperties.forEach((property) => {
      buscarImoveis((imovelData) => {
        if (imovelData.data && imovelData.data.length > 0) {
          const imovel = imovelData.data[0];
          const listItem = $(`
            <li>
              <div class="cardHeader">
                <img src="${
                  imovel.picture_link || "https://via.placeholder.com/250x188"
                }" alt="">
                <div class="cardHeaderList">
                  <p class="iconText"><span class="material-icons">bed</span>${
                    imovel.quartos || ""
                  } quartos</p>
                  <p class="iconText"><span class="material-icons">bathtub</span>${
                    imovel.banheiro || ""
                  } banheiros</p>
                  <p class="iconText"><span class="material-icons">directions_car</span>${
                    imovel.vagas || ""
                  } vagas</p>
                  <p class="iconText"><span class="material-icons">square_foot</span>${
                    imovel.metragem || ""
                  } m²</p>
                </div>
              </div>
              <div class="cardBody">
                <p class="listImoveis">${imovel.advertiser || ""}</p>
                <h3>${imovel.endereco || ""}</h3>
                <p class="cardBodyDescricao">${imovel.descricao || ""}</p>
                <hr>
                <div class="localizacaoImovel">
                  <p id="bairroImovel">${imovel.bairro || ""}</p>
                  <p id="logadouroImovel">${imovel.endereco || ""}</p>
                </div>
                <hr>
                <div>
                  <p id="precoImovel">${formatCurrency(imovel.valor || 0)}</p>
                  <div style="display: flex;">
                    <p id="compararClienteImovel">Comparativo</p>
                    <a id="verMais" target="_blank" href="${
                      imovel.url_imovel || "#"
                    }">Ver mais</a>
                  </div>
                </div>
              </div>
            </li>
          `);

          listasContainer.append(listItem);
        }
      }, `url_imovel=${property.url_imovel}`);
    });

    createPaginationControls(properties, displayProperties, currentPage);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }
});

function renderizarMain(titulo) {
  mainHeader.text(titulo);
  renderizarFiltros(titulo);

  console.log("Main renderizado");

  console.log("mainHeader:", mainHeader.text());
  if (mainHeader.text() === "Lista de Imóveis") {
    $("#filtersMainPage").hide();
  } else {
    $("#filtersMainPage").show();
  }
}

export { renderizarMain, clienteAtual };
