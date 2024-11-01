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
  compararClienteImovel2,
  imovelSelected,
  saveCards,
} from "./listas.js";
import { htmlcomparacao } from "./variaveis/propriedades.js";

// Global variables
let clienteAtual;
const leadsPerPage = 10;
const itemsPerPage = 5;
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
    console.log("botao clickado com sucesso");

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
    $(".recomendacaoViewImovel2").css("display", "none");
    $("#tabelaComparacao2").empty();
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
      console.log("properties:", properties);
      console.log("Properties array length:", properties.length);

      // Initialize pagination with the properties array
      if (properties && properties.length > 0) {
        console.log("Calling createPaginationControls with properties.");

        $(".recomendacaoViewImovel2").css("display", "flex");
        // Initialize pagination with the properties array
        createCustomPagination(properties, (currentPage) => {
          console.log(`Displaying property for page ${currentPage}`);

          try {
            // Call the displayPaginatedProperties to show the correct property
            displayPaginatedProperties(properties, currentPage, clienteAtual);
          } catch (error) {
            console.error(
              "Error occurred while displaying paginated properties:",
              error
            );
          }
        });
      } else {
        console.error("Properties array is empty or not valid.");
      }
    }, data);
  });

  // Functions defined within the document ready function

  // Função de paginação especifica para a pagina de recomendação
  function createCustomPagination(properties, displayFunction) {
    console.log("Creating pagination for properties", properties);

    // Get pagination control container
    const paginationControls = $("#recomendacao-pagination-controls");
    paginationControls.empty(); // Clear existing pagination controls

    // Calculate total number of pages
    const totalPages = Math.ceil(properties.length / itemsPerPage);
    console.log(`Total pages: ${totalPages}, Current page: ${currentPage}`);

    // Render properties for the current page
    displayFunction(currentPage, properties);

    // Create previous button if we are not on the first page
    if (currentPage > 1) {
      const prevButton = $("<button>&laquo; Previous</button>");
      prevButton.on("click", () => {
        currentPage--;
        displayFunction(currentPage, properties);
        createCustomPagination(properties, displayFunction); // Re-create pagination
      });
      paginationControls.append(prevButton);
    }

    // Create numbered buttons for each page
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = $(`<button>${i}</button>`);
      if (i === currentPage) {
        pageButton.addClass("active");
      }

      pageButton.on("click", () => {
        currentPage = i;
        displayFunction(currentPage, properties);
        createCustomPagination(properties, displayFunction); // Re-create pagination
      });

      paginationControls.append(pageButton);
    }

    // Create next button if we are not on the last page
    if (currentPage < totalPages) {
      const nextButton = $("<button>Next &raquo;</button>");
      nextButton.on("click", () => {
        currentPage++;
        displayFunction(currentPage, properties);
        createCustomPagination(properties, displayFunction); // Re-create pagination
      });
      paginationControls.append(nextButton);
    }
  }

  // Function to display properties for the current page
  function displayPaginatedProperties(properties, currentPage, clienteAtual) {
    // Ensure properties is an array
    if (!Array.isArray(properties)) {
      console.error("Properties is not an array.");
      return;
    }

    // Define the number of properties per page (can be adjusted)
    const propertiesPerPage = 1; // Display one property per page

    // Calculate start and end indices for slicing the array
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;

    // Slice the properties array to get the paginated set (only one item in this case)
    const paginatedProperties = properties.slice(startIndex, endIndex);

    // Debugging output to ensure slicing works
    console.log(
      `Displaying properties from index ${startIndex} to ${endIndex}`
    );
    console.log("Paginated properties:", paginatedProperties);

    $(".recomendacaoViewImovel2").empty();

    // Iterate over the paginated properties and apply the compararClienteImovel2 function
    paginatedProperties.forEach((property) => {
      try {
        // Call the function to compare client and property
        compararClienteImovel2(property, clienteAtual);
      } catch (error) {
        console.error("Error while comparing client and property:", error);
      }
    });
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
