// Imports
import { renderizarFiltros, aplicarFiltros } from "./filtros.js";
import { gerarFormulario } from "./formularios.js";
import { buscarRecomendacao, buscarImoveis } from "./buscar.js"; // Certifique-se de importar as funções corretas
import { createPaginationControls } from "./listas.js";

// Variáveis globais
let mainHeader = $("#titulo-pagina"); // Titulo da página
let aside = $("aside"); // a aside é feita com aside > ul > li
let clienteAtual;

const leadsPerPage = 10;
let currentPage = 1;

$(function () {
  $("#filters-sidebar").hide();
  renderizarMain("Lista de Clientes"); // renderiza o main

  // Listener para click nas li da aside
  aside.on("click", "li", function () {
    aside.find("li").removeClass("active"); // remove a classe active de todas as li
    $(this).addClass("active"); // adiciona a classe active na li clicada

    let titulo = $(this).find("a").text(); // pega o texto da li clicada
    renderizarMain(titulo); // renderiza o main
  });

  // Listener para abrir o sidebar de filtros
  $("#open-filters").on("click", function () {
    $("#filters-sidebar").css("width", "100%");
    $("#filters-sidebar").show();
  });

  // Listener para fechar o sidebar de filtros
  $(".close").on("click", function () {
    $("#filters-sidebar").css("width", "0");
    $("#filters-sidebar").hide();
  });

  // Listener para aplicar os filtros
  $("#apply-filters").on("click", function () {
    // Lógica para aplicar os filtros
    aplicarFiltros($("#titulo-pagina").text());
    $("#filters-sidebar").css("width", "0");
    $("#filters-sidebar").hide();
  });

  // Listener para fechar o formulário
  $(".closeFormularios").on("click", function () {
    $("#formulario").empty(); // limpa o formulário
    $(".formularios").css("display", "none"); // fecha o modal
  });

  // Listener para editar lead
  $(document).on("click", "#editarLead", function () {
    console.log("Editando lead");
    gerarFormulario($("#titulo-pagina").text(), $(this).data("id"));
    $(".formularios").css("display", "flex");
  });

  // Listener para editar imóvel
  $(document).on("click", "#editarInformacoes", function () {
    console.log("Editando imóvel");
    // passar href do #verMais
    gerarFormulario($("#titulo-pagina").text(), $("#verMais").attr("href"));
    $(".formularios").css("display", "flex");
  });

  // Listener para toggle de dark mode html class = dark ou ""
  $("#themeToggle").on("click", function () {
    $("html").toggleClass("dark");
    // caso dark, icone = sol, caso contrario, icone = lua material icons
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

  /// TODO: Refatorar app.js para limpar o código e deixar mais organizado ///
  $(document).on("click", "#compararClienteImovel", function () {
    $(".recomendacaoViewImovel").css("display", "flex");

    // Inserir informações do imóvel clicado
    const imovelClicado = $(this).closest("li");
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
    const tabela = $("#tabelaComparacao");

    $("#imgCardImovel-recomendacao").attr("src", imgSrc);
    $("#tituloImovel-recomendacao").text(titulo);
    $("#metragemImovel-recomendacao").text(metragem);
    $("#bairroImovel-recomendacao").text(bairro);
    $("#valorImovel-recomendacao").text(valor);

    // obter dados do imovel e salvar em uma variavel
    let imovelURLComparativo = $(this)
      .closest("li")
      .find("#verMais")
      .attr("href");

    // icons status
    // <span class="material-icons">check_circle</span> para true
    // <span class="material-icons">cancel</span> para false

    buscarImoveis((imovelData) => {
      if (imovelData.data && imovelData.data.length > 0) {
        const imovel = imovelData.data[0];
        console.log(imovel);
        const listItem = $(`
          <table>
            <tr>
                <th>Informação</th>
                <th>Cliente</th>
                <th>Imovel</th>
                <th>Status</th>
            </tr>
            <tr>
                <td data-parametro="Identificação">Identificação</td>
                <td data-parametro="customer_id">${clienteAtual.customer_id}</td>
                <td data-parametro="url_imovel">${imovel.url_imovel}</td>
                <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
                <td data-parametro="Nome do Contato">Nome do Contato</td>
                <td data-parametro="Nome">${clienteAtual.Nome}</td>
                <td data-parametro="advertiser">${imovel.advertiser}</td>
                <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
                <td data-parametro="Telefone do Contato">Telefone do Contato</td>
                <td data-parametro="Telefone">${clienteAtual.Telefone}</td>
                <td data-parametro="whats">${imovel.whats}</td>
                <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
                <td data-parametro="Situação Geral">Situação Geral</td>
                <td data-parametro="SituacaoGeral">${clienteAtual.SituacaoGeral}</td>
                <td data-parametro="#">#</td>
                <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Atendimento">Atendimento</td>
              <td data-parametro="ATENDIMENTO">${clienteAtual.ATENDIMENTO}</td>
              <td data-parametro="#">#</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Atendimento Secundário">Atendimento Secundário</td>
              <td data-parametro="ATENDIMENTO_SECUNDAR"> ${clienteAtual.ATENDIMENTO_SECUNDAR}</td>
              <td data-parametro="#">#</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Captação">Captação</td>
              <td data-parametro="CAPTACAO">${clienteAtual.CAPTACAO}</td>
              <td data-parametro="#">#</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Anunciante">Anunciante</td>
              <td data-parametro="#">#</td>
              <td data-parametro="advertiser">${imovel.advertiser}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Endereço">Endereço</td>
              <td data-parametro="#">#</td>
              <td data-parametro="endereco">${imovel.endereco}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Bairro">Bairro</td>
              <td data-parametro="BAIRROS">${clienteAtual.BAIRROS}</td>
              <td data-parametro="bairro">${imovel.bairro}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Observações sobre o Bairro">Observações sobre o Bairro</td>
              <td data-parametro="OBS_SOBRE_O_BAIRRO">${clienteAtual.OBS_SOBRE_O_BAIRRO}</td>
              <td data-parametro="#">#</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Tipo do Imóvel">Tipo do Imóvel</td>
              <td data-parametro="TIPOLOGIA">${clienteAtual.TIPOLOGIA}</td>
              <td data-parametro="tipo_imovel">${imovel.tipo_imovel}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Enquadramento">Enquadramento</td>
              <td data-parametro="ENQUADRAMENTO">${clienteAtual.ENQUADRAMENTO}</td>
              <td data-parametro="enquadramento">${imovel.enquadramento}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Metragem Mínima">Metragem Mínima</td>
              <td data-parametro="METRAGEM_MINIMA">${clienteAtual.METRAGEM_MINIMA}</td>
              <td data-parametro="metragem">${imovel.metragem}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Quartos">Quartos</td>
              <td data-parametro="QUARTOS">${clienteAtual.QUARTOS}</td>
              <td data-parametro="quartos">${imovel.quarto}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Suítes">Suítes</td>
              <td data-parametro="SUITE">${clienteAtual.SUITE}</td>
              <td data-parametro="suites">${imovel.suites}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Banheiros">Banheiros</td>
              <td data-parametro="BANHEIROS">${clienteAtual.BANHEIROS}</td>
              <td data-parametro="banheiro">${imovel.banheiro}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Vagas de Garagem">Vagas de Garagem</td>
              <td data-parametro="VAGA_DE_GARAGEM">${clienteAtual.VAGA_DE_GARAGEM}</td>
              <td data-parametro="vagas">${imovel.vagas}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Valor de Venda">Valor de Venda</td>
              <td data-parametro="VALOR_LIMITE">${clienteAtual.VALOR_LIMITE}</td>
              <td data-parametro="valor">${imovel.valor}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Valor de Condomínio">Valor de Condomínio</td>
              <td data-parametro="VALOR_DO_CONDOMINIO">${clienteAtual.VALOR_DO_CONDOMINIO}</td>
              <td data-parametro="condominio">${imovel.condominio}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Valor de IPTU">Valor de IPTU</td>
              <td data-parametro="#">#</td>
              <td data-parametro="iptu">${imovel.iptu}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Preço do m2">Preço do m2</td>
              <td data-parametro="VALOR_DO_MT2">${clienteAtual.VALOR_DO_MT2}</td>
              <td data-parametro="preco_m2">${imovel.preco_m2}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Observações sobre o Valor">Observações sobre o Valor</td>
              <td data-parametro="OBS_SOBRE_O_VALOR">${clienteAtual.OBS_SOBRE_O_VALOR}</td>
              <td data-parametro="#">#</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Exigências">Exigências</td>
              <td data-parametro="EXIG_NAO_PODE_FALTAR">${clienteAtual.EXIG_NAO_PODE_FALTAR}</td>
              <td data-parametro="#">#</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Andar">Andar</td>
              <td data-parametro="ANDAR">${clienteAtual.ANDAR}</td>
              <td data-parametro="andar">${imovel.andar}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Posição Solar">Posição Solar</td>
              <td data-parametro="POSICAO_SOLAR">${clienteAtual.POSICAO_SOLAR}</td>
              <td data-parametro="posicao_solar">${imovel.posicao_solar}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Posição do Prédio">Posição do Prédio</td>
              <td data-parametro="POSICAO_PREDIO">${clienteAtual.POSICAO_PREDIO}</td>
              <td data-parametro="posicao_predio">${imovel.posicao_predio}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Forma de Pagamento">Forma de Pagamento</td>
              <td data-parametro="FORMA_DE_PAGAMENTO">${clienteAtual.FORMA_DE_PAGAMENTO}</td>
              <td data-parametro="#">#</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
            <tr>
              <td data-parametro="Aceita Permuta">Aceita Permuta</td>
              <td data-parametro="aceita_permuta">${clienteAtual.aceita_permuta}</td>
              <td data-parametro="aceita_permuta">${imovel.aceita_permuta}</td>
              <td data-parametro="Status"><span class="material-icons"></span></td>
            </tr>
        <tr>
  <td data-parametro="Aceita FGTS">Aceita FGTS</td>
  <td data-parametro="aceita_fgts">${clienteAtual.aceita_fgts}</td>
  <td data-parametro="aceita_fgts">${imovel.aceita_fgts}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Aceita Financiamento">Aceita Financiamento</td>
  <td data-parametro="aceita_financiamento">${clienteAtual.aceita_financiamento}</td>
  <td data-parametro="aceita_financiamento">${imovel.aceita_financiamento}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Reforma (Texto)">Reforma (Texto)</td>
  <td data-parametro="REFORMA">${clienteAtual.reforma}</td>
  <td data-parametro="REFORMA">${imovel.reforma}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Reformado">Reformado</td>
  <td data-parametro="reformado">${clienteAtual.reformado}</td>
  <td data-parametro="reformado">${imovel.reformado}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Hidráulica e Elétrica (Texto)">Hidráulica e Elétrica (Texto)</td>
  <td data-parametro="HIDRAULICA_E_ELETRIC">${clienteAtual.hidraulica_e_eletrica}</td>
  <td data-parametro="HIDRAULICA_E_ELETRIC">${imovel.hidraulica_e_eletrica}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Hidráulica reformada">Hidráulica reformada</td>
  <td data-parametro="reforma_hidraulica">${clienteAtual.reforma_hidraulica}</td>
  <td data-parametro="reforma_hidraulica">${imovel.reforma_hidraulica}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Elétrica reformada">Elétrica reformada</td>
  <td data-parametro="reforma_eletrica">${clienteAtual.reforma_eletrica}</td>
  <td data-parametro="reforma_eletrica">${imovel.reforma_eletrica}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Fachada reformada">Fachada reformada</td>
  <td data-parametro="FACHADA">${clienteAtual.fachada}</td>
  <td data-parametro="FACHADA">${imovel.fachada}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Mobiliado">Mobiliado</td>
  <td data-parametro="MOBILIADO">${clienteAtual.mobiliado}</td>
  <td data-parametro="mobiliado">${imovel.mobiliado}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Varanda">Varanda</td>
  <td data-parametro="VARANDA">${clienteAtual.varanda}</td>
  <td data-parametro="varanda">${imovel.varanda}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Vazado">Vazado</td>
  <td data-parametro="VAZADO">${clienteAtual.vazado}</td>
  <td data-parametro="vazado">${imovel.vazado}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Descrição da Vista">Descrição da Vista</td>
  <td data-parametro="VISTA">${clienteAtual.vista}</td>
  <td data-parametro="VISTA">${imovel.vista}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Vista Livre">Vista Livre</td>
  <td data-parametro="vista_livre">${clienteAtual.vista_livre}</td>
  <td data-parametro="vista_livre">${imovel.vista_livre}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="DCE">DCE</td>
  <td data-parametro="DCE">${clienteAtual.dce}</td>
  <td data-parametro="dce">${imovel.dce}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Tipo de Cozinha">Tipo de Cozinha</td>
  <td data-parametro="TIPO_DE_COZINHA">${clienteAtual.tipo_cozinha}</td>
  <td data-parametro="tipo_cozinha">${imovel.tipo_cozinha}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Tipo de Piso">Tipo de Piso</td>
  <td data-parametro="PISO">${clienteAtual.piso}</td>
  <td data-parametro="piso">${imovel.piso}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Elevador">Elevador</td>
  <td data-parametro="ELEVADOR">${clienteAtual.elevador}</td>
  <td data-parametro="elevador">${imovel.elevador}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Gás Encanado">Gás Encanado</td>
  <td data-parametro="GAS_ENCANADO">${clienteAtual.gas_encanado}</td>
  <td data-parametro="gas_encanado">${imovel.gas_encanado}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Área de Lazer">Área de Lazer</td>
  <td data-parametro="AREA_DE_LAZER">${clienteAtual.area_de_lazer}</td>
  <td data-parametro="AREA_DE_LAZER">${imovel.area_de_lazer}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Fitness / Sala de Ginástica">Fitness / Sala de Ginástica</td>
  <td data-parametro="fitness">${clienteAtual.fitness}</td>
  <td data-parametro="fitness">${imovel.fitness}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Salão de Jogos">Salão de Jogos</td>
  <td data-parametro="salao_de_jogos">${clienteAtual.salao_de_jogos}</td>
  <td data-parametro="salao_de_jogos">${imovel.salao_de_jogos}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Salão de Festas">Salão de Festas</td>
  <td data-parametro="salao_de_festas">${clienteAtual.salao_de_festas}</td>
  <td data-parametro="salao_de_festas">${imovel.salao_de_festas}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Sauna">Sauna</td>
  <td data-parametro="sauna">${clienteAtual.sauna}</td>
  <td data-parametro="sauna">${imovel.sauna}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Piscina">Piscina</td>
  <td data-parametro="piscina">${clienteAtual.piscina}</td>
  <td data-parametro="piscina">${imovel.piscina}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Quadra Poliesportiva">Quadra Poliesportiva</td>
  <td data-parametro="quadra_poliesportiva">${clienteAtual.quadra_poliesportiva}</td>
  <td data-parametro="quadra_poliesportiva">${imovel.quadra_poliesportiva}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Churrasqueira">Churrasqueira</td>
  <td data-parametro="churrasqueira">${clienteAtual.churrasqueira}</td>
  <td data-parametro="churrasqueira">${imovel.churrasqueira}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Playground">Playground</td>
  <td data-parametro="playground">${clienteAtual.playground}</td>
  <td data-parametro="playground">${imovel.playground}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Espaço Gourmet">Espaço Gourmet</td>
  <td data-parametro="espaco_gourmet">${clienteAtual.espaco_gourmet}</td>
  <td data-parametro="espaco_gourmet">${imovel.espaco_gourmet}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Depósito">Depósito</td>
  <td data-parametro="deposito">${clienteAtual.deposito}</td>
  <td data-parametro="deposito">${imovel.deposito}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Número de Vagas">Número de Vagas</td>
  <td data-parametro="numero_de_vagas">${clienteAtual.numero_de_vagas}</td>
  <td data-parametro="numero_de_vagas">${imovel.numero_de_vagas}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Tipo de Garagem">Tipo de Garagem</td>
  <td data-parametro="TIPO_DE_GARAGEM">${clienteAtual.tipo_garagem}</td>
  <td data-parametro="tipo_garagem">${imovel.tipo_garagem}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Área Construída">Área Construída</td>
  <td data-parametro="AREA_CONSTRUIDA">${clienteAtual.area_construida}</td>
  <td data-parametro="area_construida">${imovel.area_construida}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Área Total">Área Total</td>
  <td data-parametro="AREA_TOTAL">${clienteAtual.area_total}</td>
  <td data-parametro="area_total">${imovel.area_total}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Área Útil">Área Útil</td>
  <td data-parametro="AREA_UTIL">${clienteAtual.area_util}</td>
  <td data-parametro="area_util">${imovel.area_util}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Número de Andares">Número de Andares</td>
  <td data-parametro="numero_de_andares">${clienteAtual.numero_de_andares}</td>
  <td data-parametro="numero_de_andares">${imovel.numero_de_andares}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Andar do Imóvel">Andar do Imóvel</td>
  <td data-parametro="andar_do_imovel">${clienteAtual.andar_do_imovel}</td>
  <td data-parametro="andar_do_imovel">${imovel.andar_do_imovel}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Descrição do Imóvel">Descrição do Imóvel</td>
  <td data-parametro="DESCRICAO_IMOVEL">${clienteAtual.descricao_imovel}</td>
  <td data-parametro="descricao_imovel">${imovel.descricao_imovel}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Estado de Conservação">Estado de Conservação</td>
  <td data-parametro="estado_de_conservacao">${clienteAtual.estado_de_conservacao}</td>
  <td data-parametro="estado_de_conservacao">${imovel.estado_de_conservacao}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Valor de Venda">Valor de Venda</td>
  <td data-parametro="VALOR_DE_VENDA">${clienteAtual.valor_de_venda}</td>
  <td data-parametro="valor_de_venda">${imovel.valor_de_venda}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Valor do Condomínio">Valor do Condomínio</td>
  <td data-parametro="VALOR_CONDOMINIO">${clienteAtual.valor_condominio}</td>
  <td data-parametro="valor_condominio">${imovel.valor_condominio}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="IPTU">IPTU</td>
  <td data-parametro="IPTU">${clienteAtual.iptu}</td>
  <td data-parametro="iptu">${imovel.iptu}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>
<tr>
  <td data-parametro="Data de Cadastro">Data de Cadastro</td>
  <td data-parametro="data_cadastro">${clienteAtual.data_cadastro}</td>
  <td data-parametro="data_cadastro">${imovel.data_cadastro}</td>
  <td data-parametro="Status"><span class="material-icons"></span></td>
</tr>

        </table>
        `);

        tabela.append(listItem);
      }
    }, `url_imovel=${imovelURLComparativo}`);
  });

  $(document).on("click", ".closeRecomendacao", function () {
    $(".recomendacaoView").css("display", "none");
  });

  $(document).on("click", ".closeRecomendacaoImovel", function () {
    $(".recomendacaoViewImovel").css("display", "none");
    // Limpar tabela de comparação
    $("#tabelaComparacao").empty();
  });

  $(document).on("click", "#recomendacaoButton", function () {
    console.log("Buscando recomendação");
    let customerId = $(this).closest("li").data("id");
    let data = "customer_id=" + customerId;

    buscarRecomendacao((response) => {
      //console.log(response);
      $(".recomendacaoView").css("display", "block");

      let data = response.customer_params;
      clienteAtual = data;
      console.log(clienteAtual);
      //console.log(data);

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

      // Exibir lista de imóveis recomendados com paginação
      let properties = response.lista_recomendacao;
      displayProperties(properties, currentPage); // Exibe a primeira página dos imóveis recomendados
    }, data);
  });

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
                          imovel.picture_link ||
                          "https://via.placeholder.com/250x188"
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
                        <p class="cardBodyDescricao">${
                          imovel.descricao || ""
                        }</p>
                        <hr>
                        <div class="localizacaoImovel">
                          <p id="bairroImovel">${imovel.bairro || ""}</p>
                          <p id="logadouroImovel">${imovel.endereco || ""}</p>
                        </div>
                        <hr>
                        <div>
                          <p id="precoImovel">${formatCurrency(
                            imovel.valor || 0
                          )}</p>
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
  mainHeader.text(titulo); // renderiza o titulo da página
  renderizarFiltros(titulo); // renderiza os filtros
  console.log("Main renderizado");
}

export { renderizarMain };
