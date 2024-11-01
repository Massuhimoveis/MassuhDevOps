// filtros.js
import {
  buscarCampos,
  buscarBairros,
  buscarRank,
  buscarClientes,
  buscarImoveis,
} from "./buscar.js";
import { renderizarListas } from "./listas.js";
import {
  fieldsImoveis,
  htmlFiltroImoveis,
  fieldsClientes,
  htmlFiltroClientes,
} from "./variaveis/propriedades.js";

let areaFiltro = $("#dynamic-filters");

// Função para renderizar os filtros na tela de acordo com a tela selecionada
function renderizarFiltros(tela) {
  console.log("entrAMOS");
  let contagem = 0;
  // remove html de dentro da areaFiltro
  areaFiltro.empty();
  console.log("EvolUINdo");
  switch (tela) {
    case "Lista de Clientes":
      buscarClientes((data) => {
        renderizarListas(tela, data);
      });
      areaFiltro.append(htmlFiltroClientes);
      buscarCampos((data) => {
        //console.log("Data:", data);

        data.forEach((campo) => {
          //console.log("Current campo:", campo.field_visible_label); // Check each campo
          let labelName;

          if (!campo.field_visible_label) {
            labelName = campo.field_label;
          } else {
            labelName = campo.field_visible_label;
          }

          switch (campo.field_type) {
            case "string":
              break;
            case "categorical":
              if (
                labelName == "SITUACAO_GERAL" ||
                labelName == "Situacao_Geral"
              ) {
                let localRenderizar = $(
                  ".field-value[data-index='300'] select"
                );
                data[49].field_options.forEach((option) => {
                  localRenderizar.append(
                    `<option value="${option}">${option}</option>`
                  );
                });
              }
              if (labelName == "Atendimento" || labelName == "ATENDIMENTO") {
                let localRenderizar = $(
                  ".field-value[data-index='400'] select"
                );
                campo.field_options.forEach((option) => {
                  localRenderizar.append(
                    `<option value="${option}">${option}</option>`
                  );
                });
              }

              if (
                labelName == "Atendimento_Secundar" ||
                labelName == "ATENDIMENTO_SECUNDAR"
              ) {
                let localRenderizar = $(".field-value[data-index='5'] select");
                campo.field_options.forEach((option) => {
                  localRenderizar.append(
                    `<option value="${option}">${option}</option>`
                  );
                });
              }
              if (labelName == "Captacao" || labelName == "CAPTACAO") {
                let localRenderizar = $(".field-value[data-index='6'] select");
                campo.field_options.forEach((option) => {
                  localRenderizar.append(
                    `<option value="${option}">${option}</option>`
                  );
                });
              }
              break;
            case "numeric":
            case "int":
            case "float":
            case "array":
            case "bool":
            case "datetime":
              break;
            default:
              break;
          }

          // Add fields from Lista de Imóveis to Lista de Clientes
          if (
            fieldsImoveis.includes(labelName) &&
            !fieldsClientes.includes(labelName)
          ) {
            //console.log(campo.field_type);
            switch (campo.field_type) {
              case "categorical":
                if (labelName == "Bairro") {
                  buscarBairros((data) => {
                    let localRenderizar = $(
                      ".field-value[data-index='3'] select"
                    );
                    let cidades = {};
                    data.forEach((bairro) => {
                      let cidade = bairro.cidade;
                      if (!cidades[cidade]) {
                        cidades[cidade] = [];
                      }
                      cidades[cidade].push(bairro.bairro);
                    });

                    for (let cidade in cidades) {
                      let bairros = cidades[cidade];
                      let options = bairros
                        .map(
                          (bairro) =>
                            `<option value="${bairro}">${bairro}</option>`
                        )
                        .join("");
                      localRenderizar.append(
                        `<optgroup label="${cidade}" class="no-hover">${options}</optgroup>`
                      );
                    }
                  });
                }

                if (labelName == "tipo_imovel" || labelName == "Tipologia") {
                  let localRenderizar = $(
                    ".field-value[data-index='4'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (labelName == "_source") {
                  let localRenderizar = $(
                    ".field-value[data-index='0'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (labelName == "piso" || labelName == "Piso") {
                  let localRenderizar = $(
                    ".field-value[data-index='26'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (
                  labelName == "tipo_cozinha" ||
                  labelName == "Tipo_Cozinha"
                ) {
                  let localRenderizar = $(
                    ".field-value[data-index='38'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (
                  labelName == "posicao_solar" ||
                  labelName == "Posicao_Solar"
                ) {
                  let localRenderizar = $(
                    ".field-value[data-index='27'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (
                  labelName == "posicao_predio" ||
                  labelName == "Posicao_Predio"
                ) {
                  let localRenderizar = $(
                    ".field-value[data-index='28'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (
                  labelName == "stage_description" ||
                  labelName == "Stage_Description"
                ) {
                  let localRenderizar = $(
                    ".field-value[data-index='48'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (labelName == "purposes_type") {
                  let localRenderizar = $(
                    ".field-value[data-index='47'] select"
                  );
                  campo.field_options.forEach((option) => {
                    if (option === "Venda") {
                      localRenderizar.append(
                        `<option value="${option}">${option}</option>`
                      );
                    } else {
                      localRenderizar.append(
                        `<option value="${option}">${option}</option>`
                      );
                    }
                  });
                }
                break;
              default:
                break;
            }
          }

          contagem++;
        });
      });

      // Advanced filters logic for Clientes page
      const advancedFiltersButtonclient = document.querySelector(
        '[data-index="advanced-filters"] button'
      );
      const advancedFiltersContainerclient =
        document.getElementById("advanced-filters");

      advancedFiltersButtonclient.addEventListener("click", function () {
        if (advancedFiltersContainerclient.classList.contains("hidden")) {
          advancedFiltersButtonclient.innerHTML = "Ocultar Filtros Avançados";
        } else {
          advancedFiltersButtonclient.innerHTML = "Mostrar Filtros Avançados";
        }
        advancedFiltersContainerclient.classList.toggle("hidden");
      });
      $(advancedFiltersButtonclient).click();
      break;

    case "Lista de Imóveis":
      console.log("estAMOS Voando");
      buscarImoveis((data) => {
        renderizarListas(tela, data);
      });
      areaFiltro.append(htmlFiltroImoveis);
      console.log("carai até o HTML colocamos");
      buscarCampos((data) => {
        console.log("dentro funcao buscarCampos");
        data.forEach((campo) => {
          let labelName;

          if (!campo.field_visible_label) {
            labelName = campo.field_label;
          } else {
            labelName = campo.field_visible_label;
          }

          if (fieldsImoveis.includes(labelName)) {
            switch (campo.field_type) {
              case "string":
                break;
              case "categorical":
                if (labelName == "Bairro") {
                  buscarBairros((data) => {
                    let localRenderizar = $(
                      ".field-value[data-index='3'] select"
                    );
                    let cidades = {};
                    data.forEach((bairro) => {
                      let cidade = bairro.cidade;
                      if (!cidades[cidade]) {
                        cidades[cidade] = [];
                      }
                      cidades[cidade].push(bairro.bairro);
                    });

                    for (let cidade in cidades) {
                      let bairros = cidades[cidade];
                      let options = bairros
                        .map(
                          (bairro) =>
                            `<option value="${bairro}">${bairro}</option>`
                        )
                        .join("");
                      localRenderizar.append(
                        `<optgroup label="${cidade}" class="no-hover">${options}</optgroup>`
                      );
                    }
                  });
                }

                if (labelName == "tipo_imovel" || labelName == "Tipologia") {
                  let localRenderizar = $(
                    ".field-value[data-index='4'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (labelName == "_source") {
                  let localRenderizar = $(
                    ".field-value[data-index='0'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (labelName == "piso" || labelName == "Piso") {
                  let localRenderizar = $(
                    ".field-value[data-index='26'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (
                  labelName == "tipo_cozinha" ||
                  labelName == "Tipo_Cozinha"
                ) {
                  let localRenderizar = $(
                    ".field-value[data-index='38'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (
                  labelName == "posicao_solar" ||
                  labelName == "Posicao_Solar"
                ) {
                  let localRenderizar = $(
                    ".field-value[data-index='27'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (
                  labelName == "posicao_predio" ||
                  labelName == "Posicao_Predio"
                ) {
                  let localRenderizar = $(
                    ".field-value[data-index='28'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (
                  labelName == "stage_description" ||
                  labelName == "Stage_Description"
                ) {
                  let localRenderizar = $(
                    ".field-value[data-index='48'] select"
                  );
                  campo.field_options.forEach((option) => {
                    localRenderizar.append(
                      `<option value="${option}">${option}</option>`
                    );
                  });
                }

                if (labelName == "purposes_type") {
                  // deixar "Venda" selecionado por padrão
                  let localRenderizar = $(
                    ".field-value[data-index='47'] select"
                  );
                  campo.field_options.forEach((option) => {
                    if (option === "Venda") {
                      localRenderizar.append(
                        `<option value="${option}" selected>${option}</option>`
                      );
                    } else {
                      localRenderizar.append(
                        `<option value="${option}">${option}</option>`
                      );
                    }
                  });
                }
                break;
              case "numeric":
                break;
              case "int":
                break;
              case "float":
                break;
              case "array":
                break;
              case "bool":
                break;
              case "datetime":
                break;
              default:
                break;
            }
          }
          contagem++;
        });
      });
      const advancedFiltersButton = document.querySelector(
        '[data-index="advanced-filters"] button'
      );
      const advancedFiltersContainer =
        document.getElementById("advanced-filters");

      advancedFiltersButton.addEventListener("click", function () {
        if (advancedFiltersContainer.classList.contains("hidden")) {
          advancedFiltersButton.innerHTML = "Ocultar Filtros Avançados";
        } else {
          advancedFiltersButton.innerHTML = "Mostrar Filtros Avançados";
        }
        advancedFiltersContainer.classList.toggle("hidden");
      });
      $(advancedFiltersButton).click();
      break;
    default:
      break;
  }
  $("select[multiple]").select2({
    width: "100%", // Ajusta a largura do dropdown para 100%
  });
}

// Função para normalizar strings (remove emojis, acentos, espaços extras e converte para minúsculas)
function normalizeString(str) {
  if (typeof str !== "string") return str;

  // Remover emojis usando expressão regular Unicode
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  const withoutEmojis = str.replace(emojiRegex, "");

  // Remover acentos
  const withoutAccents = withoutEmojis
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Remover espaços em branco extras e converter para minúsculas
  return withoutAccents.trim().toLowerCase();
}

// Função para aplicar os filtros selecionados
function aplicarFiltros(tela) {
  const filtros = {};
  $("#dynamic-filters .filter-container").each(function () {
    const campo = $(this).data("variavel");

    // Handle specific cases for SituacaoGeral, ATENDIMENTO, and CAPTACAO
    if (
      campo === "SituacaoGeral" ||
      campo === "ATENDIMENTO" ||
      campo === "CAPTACAO"
    ) {
      let valor = $(this).find("select").val();

      // If it's a multiple select, ensure it's processed properly
      if (Array.isArray(valor)) {
        const valoresValidos = valor.filter(
          (v) =>
            v !== "" &&
            v !== "null" &&
            v !== "Não informado" &&
            v !== "UNDEFINED"
        );

        // If there are valid options or "VAZIO" is selected
        // If there are valid options or "VAZIO" is selected
        if (valoresValidos.length > 0 || valor.includes("VAZIO/UNDEFINED")) {
          // Include "VAZIO" filter if selected
          filtros[campo] = valor.includes("VAZIO/UNDEFINED")
            ? [...valoresValidos, null] // Handle "VAZIO" as null
            : valoresValidos;
        }
        if (valor.includes("UNDEFINED")) {
          filtros[campo] = [...valoresValidos, undefined]; // Handle "UNDEFINED" as undefined
        }
      } else if (
        valor &&
        valor !== "VAZIO/UNDEFINED" &&
        valor.trim() !== "" &&
        valor !== "Não informado" &&
        valor !== "UNDEFINED"
      ) {
        filtros[campo] = [valor]; // Handle single selected value
      } else if (valor === "VAZIO/UNDEFINED") {
        filtros[campo] = [null]; // Handle "VAZIO" as null for single selection
      } else if (valor === "UNDEFINED") {
        filtros[campo] = [undefined];
      }
      return; // Exit
    }

    // printar todos os campos
    //console.log("Campo:", campo);

    if (campo != undefined && campo != "UNDEFINED") {
      const tipo = $(this).data("field-type");
      let valor;
      let valorMin;
      let valorMax;
      switch (tipo) {
        case "categorical":
          valor = $(this).find("select").val();
          break;
        case "string":
        case "numeric":
        case "int":
          // Handle min/max values specifically for integer fields
          valorMin = $(this)
            .find("input[name='" + campo + "_min']")
            .val();
          valorMax = $(this)
            .find("input[name='" + campo + "_max']")
            .val();
          valor = $(this)
            .find("input[name='" + campo + "']")
            .val();

          if (valorMin || valorMin === 0) {
            filtros[campo + "_min"] = parseInt(valorMin, 10); // Ensure integer parsing
          }
          if (valorMax || valorMax === 0) {
            filtros[campo + "_max"] = parseInt(valorMax, 10); // Ensure integer parsing
          }
          if (valor) {
            filtros[campo] = parseInt(valor, 10); // Ensure integer parsing
          }
          break;
        case "float":
          // Handle min/max values for numeric (float) fields
          if (campo == "valor") {
            valorMin = $(this).find("input[name='valor_min']").val();
            valorMax = $(this).find("input[name='valor_max']").val();
          } else {
            valorMin = $(this)
              .find("input[name='" + campo + "_min']")
              .val();
            valorMax = $(this)
              .find("input[name='" + campo + "_max']")
              .val();
            valor = $(this)
              .find("input[name='" + campo + "']")
              .val();
          }

          if (valorMin || valorMin === 0) {
            filtros[campo + "_min"] = parseFloat(valorMin);
          }
          if (valorMax || valorMax === 0) {
            filtros[campo + "_max"] = parseFloat(valorMax);
          }
          if (valor) {
            filtros[campo] = parseFloat(valor);
          }

          // Aplica a condição de value = 0 apenas para o campo de metragem
          if (campo === "metragem" || campo === "valor") {
            valorMin =
              valorMin !== "" && valorMin !== null && valorMin !== undefined
                ? parseFloat(valorMin)
                : 0;
            valorMax =
              valorMax !== "" && valorMax !== null && valorMax !== undefined
                ? parseFloat(valorMax)
                : 0;

            // Se ambos são zero, não incluir nos filtros
            if (valorMin === 0 && valorMax === 0) {
              return; // Ignora este campo
            }
          }

          break;
        case "datetime":
          valor = $(this).find("input").val();
          if (valor) {
            const dateObj = new Date(valor);
            valor = Math.floor(dateObj.getTime() / 1000);
            filtros[campo] = valor;
          }
          break;
        case "array":
          valor = $(this)
            .find("input")
            .val()
            .split(",")
            .map((item) => item.trim());
          filtros[campo] = valor;
          break;
        case "bool":
          valor = $(this).find("select").val();
          if (valor === "undefined") {
            valor = null;
          }
          break;
        default:
          break;
      }
      if (
        valor &&
        (Array.isArray(valor)
          ? valor.length > 0
          : valor !== "" && valor !== "false" && valor !== 0)
      ) {
        filtros[campo] = valor;
      }
    }
  });

  console.log(`Aplicando filtros para a tela: ${tela}`);
  console.log("Parâmetros de busca:", filtros);

  if (tela == "Lista de Imóveis") {
    let data = Object.keys(filtros)
      .map((key) => {
        if (Array.isArray(filtros[key])) {
          return `${encodeURIComponent(key)}=${encodeURIComponent(
            JSON.stringify(filtros[key])
          )}`;
        }
        if (filtros[key] === null) {
          return `${encodeURIComponent(key)}=null`;
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(filtros[key])}`;
      })
      .join("&");

    buscarRank((response) => {
      console.log("API response data:", response);

      const filteredData = response.data.filter((imovel) => {
        let matches = true;

        Object.keys(filtros).forEach((key) => {
          const filterValue = filtros[key];
          const imovelValue = parseFloat(imovel[key]);
          const maxKey = key + "_max";
          const valorMaxLocal = filtros[maxKey];

          // Lógica de filtragem min/max
        });
        return matches;
      });

      console.log(
        "Filtered properties data after frontend filtering:",
        filteredData
      );

      dataModule.setProperties(filteredData);
      renderizarListas(tela, { data: filteredData });
    }, data);
  }
  if (tela == "Lista de Clientes") {
    const leads = dataModule.getLeads();
    console.log(leads[(1, 10)]);

    // Map HTML filter variable names to JSON keys in leads object
    const filterMapping = {
      customer_id: "customer_id",
      Nome: "Nome",
      Telefone: "Telefone",
      SituacaoGeral: "SituacaoGeral",
      ATENDIMENTO: "ATENDIMENTO",
      ATENDIMENTO_SECUNDAR: "ATENDIMENTO_SECUNDAR",
      CAPTACAO: "CAPTACAO",
      Respondendo: "Respondendo",
      TEMPO_SEM_CONTATO: "TEMPO_SEM_CONTATO",
      endereco: "endereco",
      bairros: "BAIRROS",
      tipo_imovel: "TIPOLOGIA",
      purposes_type: "FORMA_DE_PAGAMENTO",
      quartos: "QUARTOS",
      suites: "SUITE",
      banheiros: "BANHEIROS",
      metragem: "METRAGEM_MINIMA",
      andar: "ANDAR",
      vagas: "VAGA_DE_GARAGEM",
      mobiliado: "MOBILIADO",
      piso: "PISO",
      varanda: "VARANDA",
      gas_encanado: "GAS_ENCANADO",
      aceita_permuta: "AceitaPermuta",
      aceita_fgts: "AceitaFGTS",
      aceita_financiamento: "AceitaFinanciamento",

      // New variables from JSON
      Data_e_Hora_: "Data_e_Hora_",
      AberturaPraLigacao: "AberturaPraLigacao",
      AberturaPraAbrirLeque: "AberturaPraAbrirLeque",
      FILTRO_DO_CLIENTE: "FILTRO_DO_CLIENTE",
      FEEDBACK_INDIVIDUAL: "FEEDBACK_INDIVIDUAL",
      DATA_HORA_OU_DUVIDA: "DATA_HORA_OU_DUVIDA",
      FeedbackPositivo: "FeedbackPositivo",
      PreferenciaDeHorariosDeVisita: "PreferenciaDeHorariosDeVisita",
      VisitasFeitas: "VisitasFeitas",
      FeedbackNegativo: "FeedbackNegativo",
      REGISTRO_PORTAIS: "REGISTRO_PORTAIS",
      OBS_SOBRE_O_BAIRRO: "OBS_SOBRE_O_BAIRRO",
      EXIG_NAO_PODE_FALTAR: "EXIG_NAO_PODE_FALTAR",
      PREF_SE_TIVER_MELHOR: "PREF_SE_TIVER_MELHOR",
      ENQUADRAMENTO: "ENQUADRAMENTO",
      valor: "VALOR_LIMITE",
      VALOR_ALUGUEL: "VALOR_ALUGUEL",
      VALOR_DO_MT2: "VALOR_DO_MT2",
      OBS_SOBRE_O_VALOR: "OBS_SOBRE_O_VALOR",
      DCE: "DCE",
      TIPO_DE_COZINHA: "TIPO_DE_COZINHA",
      ELEVADOR: "ELEVADOR",
      ACIMA_OU_ABAIXO: "ACIMA_OU_ABAIXO",
      VAGAS_COBERTAS: "VAGAS_COBERTAS",
      REFORMA: "REFORMA",
      HIDRAULICA_E_ELETRIC: "HIDRAULICA_E_ELETRIC",
      POSICAO_SOLAR: "POSICAO_SOLAR",
      VAZADO: "VAZADO",
      VISTA: "VISTA",
      POSICAO_PREDIO: "POSICAO_PREDIO",
      FACHADA: "FACHADA",
      AREA_DE_LAZER: "AREA_DE_LAZER",
      VALOR_DO_CONDOMINIO: "VALOR_DO_CONDOMINIO",
      PredioReformado: "PredioReformado",
      PossuiPilots: "PossuiPilots",
      SegurancaVinteQuatroHoras: "SegurancaVinteQuatroHoras",
      AceitaPets: "AceitaPets",
      EntradaDeServico: "EntradaDeServico",
      EnergiaSolar: "EnergiaSolar",
      Bicicletario: "Bicicletario",
      Comercio: "Comercio",
      Restaurantes: "Restaurantes",
      Parque: "Parque",
      Metro: "Metro",
      Praca: "Praca",
      Shopping: "Shopping",
      Igreja: "Igreja",
      Hospital: "Hospital",
      PostoDeGasolina: "PostoDeGasolina",
      Escola: "Escola",
      CORRETOR_RESPONSAVEL: "CORRETOR_RESPONSAVEL",
      ORIGINAL_OU_INTERNO: "ORIGINAL_OU_INTERNO",
      BLOCO: "BLOCO",
      CEP: "CEP",
      INFOS_DESCRICAO: "INFOS_DESCRICAO",
      EMAIL_RESPONSAVEL: "EMAIL_RESPONSAVEL",
      QUADRA: "QUADRA",
      DESTAQUE: "DESTAQUE",
      Interior: "Interior",
      Posicao_Para_Descricao: "Posicao_Para_Descricao",
      Detalhes_do_Predio_ou_Condominio: "Detalhes_do_Predio_ou_Condominio",
      Localizacao_Para_Descricao: "Localizacao_Para_Descricao",
      url_forms: "url_forms",
    };

    const filteredLeads = leads.filter((lead) => {
      return Object.keys(filtros).every((key) => {
        const mappedKey = filterMapping[key] || key;
        const leadFieldValue = lead[mappedKey];

        // Normalize lead and filter values +556194009405
        const normalizedLeadValue = normalizeString(leadFieldValue);
        const filterValues = Array.isArray(filtros[key])
          ? filtros[key]
          : [filtros[key]];
        const normalizedFilterValues = filterValues.map(normalizeString);

        // Special handling for filters that include null (for "VAZIO")
        if (normalizedFilterValues.includes(null)) {
          if (
            normalizedLeadValue === null ||
            normalizedLeadValue === undefined ||
            normalizedLeadValue === ""
          ) {
            return true;
          }
        }

        // Handle min/max values for "VALOR_LIMITE" (prices)
        if (key.endsWith("_min") || key.endsWith("_max")) {
          const baseKey = key.replace(/_min|_max/, "");
          const fieldKey = filterMapping[baseKey] || baseKey;

          // **Check if the lead value exists and is a string or number**
          let fieldLeadValue = lead[fieldKey];

          if (fieldLeadValue !== undefined && fieldLeadValue !== null) {
            // Convert lead value to a float if it's a string and remove formatting dots
            fieldLeadValue = parseFloat(
              fieldLeadValue.toString().replace(/\./g, "")
            );
          } else {
            return false; // If lead value is missing, return false
          }

          // Check min values
          if (key.endsWith("_min")) {
            return fieldLeadValue >= parseFloat(filtros[key]); // Compare with min filter value
          }
          // Check max values
          else if (key.endsWith("_max")) {
            return fieldLeadValue <= parseFloat(filtros[key]); // Compare with max filter value
          }
        }

        // Handle exact match for numeric fields
        const isNumeric = (value) =>
          !isNaN(parseFloat(value)) && isFinite(value);

        if (
          isNumeric(normalizedLeadValue) &&
          normalizedFilterValues.every(isNumeric)
        ) {
          return normalizedFilterValues.some(
            (filterValue) =>
              parseFloat(filterValue) === parseFloat(normalizedLeadValue)
          );
        }
        if (
          key === "SituacaoGeral" ||
          key === "ATENDIMENTO" ||
          key === "CAPTACAO"
        ) {
          return normalizedFilterValues.some(
            (filterValue) => filterValue === normalizedLeadValue
          );
        }

        // For all other keys, allow partial matching
        return normalizedFilterValues.some(
          (filterValue) =>
            normalizedLeadValue.includes(filterValue) ||
            filterValue === normalizedLeadValue
        );
      });
    });

    console.log("Leads filtrados:", filteredLeads);

    const data = {
      data: filteredLeads,
      total: filteredLeads.length,
    };

    renderizarListas(tela, data);
  }
}

//Função para aplicar os filtros que estão na pagina principal

export { aplicarFiltros, renderizarFiltros };
