// buscar.js
// Variáveis globais

const API_URL = "https://api-gateway-us-central1-397xvf1t.uc.gateway.dev/";
const ENDPOINT_CUSTOMER = "customers";
const ENDPOINT_PROPERTY = "properties";
const ENDPOINT_BAIRROS = "list-neighborhoods";
const ENDPOINT_CAMPOS = "list-fields";
const ENDPOINT_RANK = "rank-properties";
const ENDPOINT_RECOMENDACAO = "recommendations";
const ENDPOINT_RENDERHTML = "render-html";

let loadingScreen = $(".loadingScreen"); // Tela de loading

const dataModule = (() => {
  let leads = [];
  let properties = [];

  return {
    getLeads: () => leads,
    setLeads: (newLeads) => {
      leads = newLeads;
    },

    getProperties: () => properties,
    setProperties: (newProperties) => {
      properties = newProperties;
    },
  };
})();

function buscarHTML(data) {
  return fetch(API_URL + ENDPOINT_RENDERHTML, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  });
}

function buscarCampos(callback) {
  fetch(API_URL + ENDPOINT_CAMPOS)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      callback(data);
    });
}

function buscarImoveis(callback, data) {
  loadingScreen.fadeIn("slow");
  //console.log(API_URL + ENDPOINT_PROPERTY + "?" + data);
  fetch(API_URL + ENDPOINT_PROPERTY + "?" + data)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Verificar se data.data existe
      if (data && data.data) {
        try {
          // Tentar parsear o JSON diretamente
          data.data = JSON.parse(data.data);
        } catch (error) {
          console.log(
            "JSON parse error, trying to remove escapes and parse again."
          );
          // Remover escapes de data.data
          data.data = data.data.replace(/\\/g, "");
          try {
            // Tentar parsear o JSON novamente
            data.data = JSON.parse(data.data);
          } catch (innerError) {
            console.error(
              "Erro ao fazer o parse do JSON após remover escapes:",
              innerError
            );
          }
        }
      }
      //console.log(data);
      loadingScreen.fadeOut("slow");
      // salvar na variavel global
      dataModule.setProperties(data.data);
      // permitir acesso a dataModule.getProperties() no global
      window.dataModule = dataModule;
      callback(data);
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
      loadingScreen.fadeOut("slow");
    });
}

function buscarBairros(callback) {
  fetch(API_URL + ENDPOINT_BAIRROS)
    .then((response) => response.json())
    .then((data) => {
      callback(data);
    });
}

function buscarRank(callback, data) {
  loadingScreen.fadeIn("slow");
  console.log(API_URL + ENDPOINT_RANK + "?" + data);
  fetch(API_URL + ENDPOINT_RANK + "?" + data)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Verificar se data.data existe
      if (data && data.data) {
        try {
          // Tentar parsear o JSON diretamente
          data.data = JSON.parse(data.data);
        } catch (error) {
          console.log(
            "JSON parse error, trying to remove escapes and parse again."
          );
          // Remover escapes de data.data
          data.data = data.data.replace(/\\/g, "");
          try {
            // Tentar parsear o JSON novamente
            data.data = JSON.parse(data.data);
          } catch (innerError) {
            console.error(
              "Erro ao fazer o parse do JSON após remover escapes:",
              innerError
            );
          }
        }
      }
      console.log(data);
      loadingScreen.fadeOut("slow");
      callback(data);
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
}

async function buscarClientes(callback, data) {
  if (dataModule.getLeads().length === 0) {
    loadingScreen.fadeIn("slow");
    console.log("fetching clients");
    try {
      const response = await fetch(API_URL + ENDPOINT_CUSTOMER);
      if (response.ok) {
        const text = await response.text();
        //console.log("Tipo da resposta:", typeof text); // Imprime o tipo da resposta
        //console.log("Conteúdo da resposta:", text); // Imprime o conteúdo da resposta

        try {
          // Parsing the JSON string into an array of objects
          const parsedData = JSON.parse(text);
          //console.log("Parsed JSON:", parsedData);

          // Verificação para garantir que a resposta seja um array de strings JSON
          if (typeof parsedData === "string") {
            const dataJson = JSON.parse(parsedData);
            if (Array.isArray(dataJson)) {
              const data = {
                data: dataJson,
                total: dataJson.length,
              };
              //console.log("Resultado final:", data);
              dataModule.setLeads(data.data);
              // permitir acesso a dataModule.getLeads() no global
              window.dataModule = dataModule;
              loadingScreen.fadeOut("slow");
              callback(data);
            } else {
              console.error("A resposta JSON não é um array.");
              return null;
            }
          } else if (Array.isArray(parsedData)) {
            const result = {
              data: parsedData,
              total: parsedData.length,
            };
            console.log("Resultado final:", result);
            return result;
          } else {
            console.error("Formato inesperado da resposta JSON.");
            return null;
          }
        } catch (error) {
          console.error("Erro ao fazer parse do JSON:", error);
          return null; // Retorna null em caso de erro ao fazer parse do JSON
        }
      } else {
        console.error(
          "Erro ao buscar clientes:",
          response.status,
          response.statusText
        );
        throw new Error("Erro ao buscar clientes");
      }
    } catch (error) {
      console.error("Erro na rede ao buscar clientes:", error);
      return null; // Retorna null em caso de erro de rede
    }
  } else {
    callback({ data: dataModule.getLeads() });
  }
}

const exemploResponse = {
  customer_id: "465306981",
  customer_params: {
    ACIMA_OU_ABAIXO: "Acima",
    ANDAR: null,
    AREA_DE_LAZER: "PISCINA, SAUNA",
    ATENDIMENTO: "0.0.1 - 👁️ VALIDAR OPÇÕES ( EM RECONFIRMAÇÃO DE VISITA)",
    ATENDIMENTO_SECUNDAR: "0.0.1  - 📸⏱️ AVALIAÇÃO AGENDADA / RECONFIRMAR",
    AberturaPraAbrirLeque: "",
    AberturaPraLigacao: "",
    BAIRROS:
      "Asa Norte (Não quer na SCLRN, pois fica de frente para a W3)Quer na SCRN",
    BANHEIROS: null,
    CAPTACAO:
      "2.3  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO ",
    DATA_HORA_OU_DUVIDA: "null",
    DCE: null,
    ELEVADOR: null,
    ENQUADRAMENTO: null,
    EXIG_NAO_PODE_FALTAR: "null",
    FACHADA: null,
    FEEDBACK_INDIVIDUAL: "Feedback teste",
    FILTRO_DO_CLIENTE: "",
    FORMA_DE_PAGAMENTO: null,
    FeedbackNegativo: "",
    FeedbackPositivo: "",
    GAS_ENCANADO: null,
    HIDRAULICA_E_ELETRIC: null,
    METRAGEM_MINIMA: null,
    MOBILIADO: null,
    Nome: "(TESTE) Gustavo Lee V15",
    OBS_SOBRE_O_BAIRRO: "testeBairro V2",
    OBS_SOBRE_O_VALOR: "testeValor",
    PISO: null,
    POSICAO_PREDIO: null,
    POSICAO_SOLAR: null,
    PREF_SE_TIVER_MELHOR: "undefined",
    PreferenciaDeHorariosDeVisita: "",
    QUARTOS: "4",
    REFORMA: null,
    REGISTRO_PORTAIS: null,
    Respondendo: "false",
    SUITE: null,
    SituacaoGeral: "✅LEAD",
    TEMPO_SEM_CONTATO: 13634,
    TIPOLOGIA: null,
    TIPO_DE_COZINHA: null,
    Telefone: "+5511954769590",
    VAGA_DE_GARAGEM: null,
    VALOR_DO_CONDOMINIO: null,
    VALOR_DO_MT2: null,
    VALOR_LIMITE: null,
    VARANDA: "Sim",
    VAZADO: null,
    VISTA: "undefined",
    VisitasFeitas: "9",
    customer_id: "465306981",
  },
  lista_recomendacao: [
    {
      score: 1.0,
      url_imovel:
        "https://massuhimoveis.com.br/sqn-402-cobertura-duplex-perpendicular-reformada-andar-alto-vista-livre-varanda-armarios-planejados-vaga-de-garagem",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.wimoveis.com.br/propriedades/apto-na-sqn-109-vista-livre!-2994551373.html",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.wimoveis.com.br/propriedades/sqn-305-maravilhoso-4-qtos-lazer-completo-2995396868.html",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/lancamento-geraldo-estrela-784715",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.wimoveis.com.br/propriedades/ilhas-do-lago-scen-trecho-01-proximo-ao-lago-asa-2985188303.html",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-109-887020",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-109-719749",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-107-954663",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.wimoveis.com.br/propriedades/apartamento-4-suites-alto-padrao-avarandado-e-2997402048.html",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-109-930061",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-115-213240",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-213-924144",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-213-954930",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-213-979083",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-213-983436",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-2-quartos-venda-asa-norte-brasilia-df-sqn-314-934765",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-110-bloco-j-1000124",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-213-885309",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-213-923468",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-209-947645",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-209-619677",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-211-945976",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-210-987585",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-615379",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-519769",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-4-quartos-venda-asa-norte-brasilia-df-shcgn-712-968207",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-4-quartos-venda-asa-norte-brasilia-df-shcgn-712-961036",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-bloco-i-968397",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-314-bloco-h-574671",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-311-bloco-e-984150",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-311-bloco-b-940685",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-311-bloco-b-925636",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-bloco-k-814316",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-212-bloco-i-819832",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-209-bloco-a-983610",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-314-bloco-h-950707",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-212-bloco-k-973063",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-314-bloco-h-863872",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-4-quartos-venda-asa-norte-brasilia-df-shcgn-716-910803",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-996284",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-bloco-d-673447",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-305-995842",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-936235",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-979058",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-956018",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-983089",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-983093",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-761388",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-304-849786",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-996401",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-645617",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-215-438670",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-213-987560",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-309-973122",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-213-987547",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-4-quartos-venda-asa-norte-brasilia-df-shcgn-716-bloco-k-755309",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-4-quartos-venda-asa-norte-brasilia-df-shcgn-716-bloco-k-598078",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-311-993535",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-311-999173",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-314-722703",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-970203",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-988828",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-314-985291",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-314-957512",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-994536",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-condominio-4-quartos-venda-asa-norte-brasilia-df-smi-1003987",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-215-1002846",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-1005107",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-4-quartos-venda-asa-norte-brasilia-df-shcgn-713-bloco-o-998528",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-314-913282",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-314-934765",
    },
    {
      score: 1.0,
      url_imovel:
        "https://massuhimoveis.com.br/shcgn-706-linda-casa-de-esquina-com-05-suites-02-quartos-02-amplas-salas-garagem-05-carros-991384807-mv0",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-condominio-4-quartos-venda-asa-norte-brasilia-df-shcgn-712-bloco-k-971936",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-110-965088",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-110-993735",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-111-960847",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-106-531217",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-106-916523",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-107-811721",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-condominio-ilhas-do-lago-913565",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-condominio-ilhas-do-lago-825888",
    },
    {
      score: 1.0,
      url_imovel:
        "https://massuhimoveis.com.br/309-norte-nascente-armarios-planejados-reformado-suite",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/casa-4-quartos-venda-asa-norte-brasilia-df-shcgn-711-bloco-l-942857",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-205-bloco-e-794099",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-107-bloco-b-929367",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-107-bloco-d-981790",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-106-bloco-j-937713",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-107-bloco-d-952631",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-311-925353",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-202-bloco-g-989361",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-208-bloco-f-973277",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-205-bloco-e-996005",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-109-bloco-d-983089",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-111-bloco-c-977273",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-110-bloco-j-997988",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-866481",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-861328",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-311-916155",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-311-833985",
    },
    {
      score: 1.0,
      url_imovel:
        "https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-norte-brasilia-df-sqn-310-853935",
    },
  ],
  normalized_inputs: {
    bairros: '["asa norte"]',
    customer_id: "465306981",
    quartos: "4",
    varanda: true,
  },
};

/*
 * ENDPOINT_RECOMENDACAO
 * Método: GET
 * Parâmetros:
 * - customer_id: id do cliente
 * Retorno: JSON com os imóveis recomendados para o cliente e dados do cliente
 */
async function buscarRecomendacao(callback, data) {
  loadingScreen.fadeIn("slow");
  //console.log("Fetching URL: ", API_URL + ENDPOINT_RECOMENDACAO + "?" + data);
  fetch(API_URL + ENDPOINT_RECOMENDACAO + "?" + data)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("Raw response data:", responseData);

      if (responseData && responseData.data) {
        try {
          if (typeof responseData.data === "string") {
            // Tentar parsear o JSON diretamente
            responseData.data = JSON.parse(responseData.data);
          } else {
            console.error(
              "responseData.data is not a string:",
              responseData.data
            );
          }
        } catch (error) {
          console.log(
            "JSON parse error, trying to remove escapes and parse again."
          );
          // Remover escapes de responseData.data
          responseData.data = responseData.data.replace(/\\/g, "");
          try {
            // Tentar parsear o JSON novamente
            responseData.data = JSON.parse(responseData.data);
          } catch (innerError) {
            console.error(
              "Erro ao fazer o parse do JSON após remover escapes:",
              innerError
            );
          }
        }
      } else {
        console.error("responseData.data is null or undefined.");
      }

      console.log("Processed response data:", responseData);
      loadingScreen.fadeOut("slow");
      callback(responseData);
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
      loadingScreen.fadeOut("slow");
      callback(exemploResponse);
    });
}

export {
  buscarCampos,
  buscarBairros,
  buscarClientes,
  buscarImoveis,
  buscarRank,
  buscarRecomendacao,
  buscarHTML,
  dataModule,
};
