const fieldsImoveis = [
  "_source",
  "url_imovel",
  "endereco",
  "Bairro",
  "Tipologia",
  "Enquadramento",
  "advertiser",
  "advertiser_creci",
  "picture_link",
  "carousel_img_links",
  "Metragem",
  "Banheiro",
  "Quartos",
  "Suites",
  "Vagas",
  "Valor",
  "Condominio",
  "iptu",
  "Preco_M2",
  "descricao",
  "features",
  "descricao_geral",
  "Aceita_Permuta",
  "Aceita_Fgts",
  "Aceita_Financiamento",
  "Mobiliado",
  "Piso",
  "Posicao_Solar",
  "Posicao_Predio",
  "Andar",
  "Elevador",
  "Dce",
  "Vista_Livre",
  "nascente",
  "Lazer_Completo",
  "Lazer_Parcial",
  "Varanda",
  "Gas_Encanado",
  "Tipo_Cozinha",
  "Vazado",
  "Reformado",
  "Reforma_Hidraulica",
  "Reforma_Eletrica",
  "Fachada_Reformada",
  "dt_atualizacao",
  "purposes_type",
  "stage_description",
  "Publicação",
];

const htmlFiltroImoveis = `
  <!-- Filtros principais -->
          <div
            class="filter-container"
            data-field-type="string"
            data-variavel="endereco"
          >
            <label>Endereço</label>
            <div class="field-value" data-index="2">
              <input type="text" name="endereco" placeholder="Endereço" />
            </div>
          </div>
          <div
            class="filter-container"
            data-field-type="categorical"
            data-variavel="bairros"
          >
            <label>Cidade / Bairro</label>
            <div class="field-value" data-index="3">
              <select multiple="multiple"></select>
            </div>
          </div>
          <div
            class="filter-container"
            data-field-type="categorical"
            data-variavel="tipo_imovel"
          >
            <label>Tipologia</label>
            <div class="field-value" data-index="4">
              <select multiple=""></select>
            </div>
          </div>
          <div
            class="filter-container"
            data-field-type="categorical"
            data-variavel="purposes_type"
          >
            <label>Aluguel ou Venda</label>
            <div class="field-value" data-index="47">
              <select multiple="">
                <option value="Aluguel">Aluguel</option>
                <option value="Venda">Venda</option>
              </select>
            </div>
          </div>
          <div class="filter-container" id="filtrosAvancados">
            <div class="field-value" data-index="advanced-filters">
              <button>Filtros Avançados</button>
            </div>
          </div>

          <br />
          <br />

          <!-- Filtros Avançados -->
          <div id="advanced-filters">
          <div
            class="filter-container"
            data-field-type="datetime"
            data-variavel="dt_atualizacao"
          >
            <label>Data de Atualização</label>
            <div class="field-value" data-index="49">
              <input type="date" name="dt_atualizacao" placeholder="Data de Atualização" />
            </div>
          </div>          
            <div
              class="filter-container"
              data-field-type="float"
              data-variavel="valor"
            >
              <label>Preço (Min - Max)</label>
              <div class="field-value" data-index="15">
                <input
                  type="number"
                  step="0.01"
                  name="valor_min"
                  placeholder="Min Preço"
                />
                <input
                  type="number"
                  step="0.01"
                  name="valor_max"
                  placeholder="Max Preço"
                />
              </div>
            </div>

            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="float"
                data-variavel="iptu"
              >
                <label>IPTU</label>
                <div class="field-value" data-index="17">
                  <input
                    type="number"
                    step="0.01"
                    name="iptu"
                    placeholder="IPTU"
                  />
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="float"
                data-variavel="condominio"
              >
                <label>Condomínio</label>
                <div class="field-value" data-index="16">
                  <input
                    type="number"
                    step="0.01"
                    name="condominio"
                    placeholder="Condomínio"
                  />
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="_source"
              >
                <label>_source</label>
                <div class="field-value" data-index="0">
                  <select multiple=""></select>
                </div>
              </div>
                <div
                  class="filter-container"
                  data-field-type="float"
                  data-variavel="metragem"
                >
                  <label>Metragem (Min - Max)</label>
                  <div class="field-value" data-index="10">
                    <input
                      type="number"
                      step="0.01"
                      name="metragem_min"
                      placeholder="Min Metragem"
                    />
                    <input
                      type="number"
                      step="0.01"
                      name="metragem_max"
                      placeholder="Max Metragem"
                    />
                  </div>
                </div>
              <div
                class="filter-container"
                data-field-type="int"
                data-variavel="banheiro"
              >
                <label>Banheiros</label>
                <div class="field-value" data-index="11">
                  <input
                    type="number"
                    name="banheiros"
                    placeholder="Banheiros"
                  />
                </div>
              </div>
                <div
                  class="filter-container"
                  data-field-type="int"
                  data-variavel="quartos"
                >
                  <label>Quartos (Min - Max)</label>
                  <div class="field-value" data-index="12">
                    <input type="number" name="quartos_min" placeholder="Min Quartos" />
                    <input type="number" name="quartos_max" placeholder="Max Quartos" />
                  </div>
                </div>
              <div
                class="filter-container"
                data-field-type="int"
                data-variavel="suites"
              >
                <label>Suítes</label>
                <div class="field-value" data-index="13">
                  <input type="number" name="suites" placeholder="Suítes" />
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="int"
                data-variavel="vagas"
              >
                <label>Vagas</label>
                <div class="field-value" data-index="14">
                  <input type="number" name="vagas" placeholder="Vagas" />
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="mobiliado"
              >
                <label>Mobiliado</label>
                <div class="field-value" data-index="25">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="numeric"
                data-variavel="andar"
              >
                <label>Andar</label>
                <div class="field-value" data-index="29">
                  <input type="number" name="andar" placeholder="Andar" />
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="elevador"
              >
                <label>Elevador</label>
                <div class="field-value" data-index="30">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="piso"
              >
                <label>Piso</label>
                <div class="field-value" data-index="26">
                  <select multiple=""></select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="varanda"
              >
                <label>Varanda</label>
                <div class="field-value" data-index="36">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="cozinha"
              >
                <label>Tipo Cozinha</label>
                <div class="field-value" data-index="38">
                  <select multiple=""></select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="gas_encanado"
              >
                <label>Gás Encanado</label>
                <div class="field-value" data-index="37">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="aceita_permuta"
              >
                <label>Aceita Permuta</label>
                <div class="field-value" data-index="22">
                  <select>
                    <option value="" selected>Select...</option>
                    <option value="undefined">Indefinido</option>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="aceita_fgts"
              >
                <label>Aceita FGTS</label>
                <div class="field-value" data-index="23">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="aceita_financiamento"
              >
                <label>Aceita Financiamento</label>
                <div class="field-value" data-index="24">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="posicao_solar"
              >
                <label>Posição Solar</label>
                <div class="field-value" data-index="27">
                  <select multiple=""></select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="posicao_predio"
              >
                <label>Posição Prédio</label>
                <div class="field-value" data-index="28">
                  <select multiple=""></select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="vista_livre"
              >
                <label>Vista Livre</label>
                <div class="field-value" data-index="32">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="lazer_completo"
              >
                <label>Lazer Completo</label>
                <div class="field-value" data-index="34">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="lazer_parcial"
              >
                <label>Lazer Parcial</label>
                <div class="field-value" data-index="35">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div
              class="filter-container"
              data-field-type="categorical"
              data-variavel="stage_description"
            >
              <label>Estágio da obra</label>
              <div class="field-value" data-index="48">
                <select multiple=""></select>
              </div>
            </div>
            </div>
            `;

const htmlListaImovel = `
<li>
              <div class="cardHeader">
                <img
                  src="https://i.pinimg.com/564x/36/85/37/368537ab800464ee9b14d843e117ab01.jpg"
                  alt=""
                />
                <div class="cardHeaderList">
                  <p class="iconText">
                    <span class="material-icons">bed</span>teste
                  </p>
                  <p class="iconText">
                    <span class="material-icons">bed</span>teste
                  </p>
                  <p class="iconText">
                    <span class="material-icons">bed</span>teste
                  </p>
                  <p class="iconText">
                    <span class="material-icons">bed</span>teste
                  </p>
                </div>
              </div>
              <div class="cardBody">
                <p class="listImoveis">massuh</p>
                <h3>nome imovel</h3>
                <h4 id="bairroImovel">ALPHAVILLE BRASILIA</h4>
                <p class="cardBodyDescricao">
                  descricao Lorem ipsum dolor sit amet consectetur, adipisicing
                  elit. Ipsa modi ipsam ad natus officia totam, sapiente nobis
                  voluptatum sed tempore eveniet. Recusandae eligendi harum
                  laborum. Reprehenderit libero consequuntur nostrum nesciunt!
                </p>
                <div>
                  <p id="precoImovel">R$ 200.000,00</p>
                  <div style="display: flex;">
                  <span id="editarInformacoes">Editar Dados</span>
                  <a id="verMais" target="_blank" href="">Ver mais</a>
                  </div>
                </div>
              </div>
            </li>
            `;

const fieldsClientes = [
  "ACIMA_OU_ABAIXO",
  "ANDAR",
  "AREA_DE_LAZER",
  "ATENDIMENTO",
  "ATENDIMENTO_SECUNDAR",
  "AberturaPraAbrirLeque",
  "AberturaPraLigacao",
  "BAIRROS",
  "BANHEIROS",
  "CAPTACAO",
  "DATA_E_HORA",
  "DATA_HORA_OU_DUVIDA",
  "DCE",
  "Data_e_Hora_",
  "ELEVADOR",
  "ENQUADRAMENTO",
  "EXIG_NAO_PODE_FALTAR",
  "FACHADA",
  "FEEDBACK_INDIVIDUAL",
  "FILTRO_DO_CLIENTE",
  "FORMA_DE_PAGAMENTO",
  "FeedbackNegativo",
  "FeedbackPositivo",
  "GAS_ENCANADO",
  "HIDRAULICA_E_ELETRIC",
  "METRAGEM_MINIMA",
  "MOBILIADO",
  "Nome",
  "OBS_SOBRE_O_BAIRRO",
  "OBS_SOBRE_O_VALOR",
  "PISO",
  "POSICAO_PREDIO",
  "POSICAO_SOLAR",
  "PREF_SE_TIVER_MELHOR",
  "PreferenciaDeHorariosDeVisita",
  "QUARTOS",
  "REFORMA",
  "REGISTRO_PORTAIS",
  "Respondendo",
  "SUITE",
  "SituacaoGeral",
  "TEMPO_SEM_CONTATO",
  "TIPOLOGIA",
  "TIPO_DE_COZINHA",
  "Telefone",
  "VAGA_DE_GARAGEM",
  "VALOR_DO_CONDOMINIO",
  "VALOR_DO_MT2",
  "VALOR_LIMITE",
  "VARANDA",
  "VAZADO",
  "VISTA",
  "VisitasFeitas",
  "customer_id",
];

const htmlFiltroClientes = `
<!-- Filtros principais -->
        <div class="flex-filters" style="width: 100%;">
          <div
            class="filter-container"
            data-field-type="string"
            data-variavel="customer_id"
          >
            <label>Identificação</label>
            <div class="field-value" data-index="0">
              <input type="text" name="customer_id" placeholder="Identificação" />
            </div>
          </div>
        
          <div
            class="filter-container"
            data-field-type="string"
            data-variavel="Nome"
          >
            <label>Nome</label>
            <div class="field-value" data-index="1">
              <input type="text" name="Nome" placeholder="Nome" />
            </div>
          </div>

          <div
            class="filter-container"
            data-field-type="string"
            data-variavel="Telefone"
          >
            <label>Telefone</label>
            <div class="field-value" data-index="2">
              <input type="text" name="Telefone" placeholder="Telefone" />
            </div>
          </div>

          <div
            class="filter-container"
            data-field-type="categorical"
            data-variavel="SituacaoGeral"
          >
            <label>Situação Geral</label>
            <div class="field-value" data-index="3">
              <select multiple="">
                <option value="VAZIO">VAZIO</option>
                <option value="✅LEAD">✅LEAD</option>
                <option value="✅LEAD - INVESTIDOR">✅LEAD - INVESTIDOR</option>
                <option value="✅LEAD -  QUER OPÇÃO EM PRÉDIO OU QUADRA ESPECÍFICA">✅LEAD -  QUER OPÇÃO EM PRÉDIO OU QUADRA ESPECÍFICA</option>
                <option value="✅ PROPRIETÁRIO QUE IRÁ COMPRAR">✅ PROPRIETÁRIO QUE IRÁ COMPRAR</option>
                <option value="☎️PROPRIETÁRIO">☎️PROPRIETÁRIO</option>
                <option value="✅CLIENTE COMPROU CONOSCO">✅CLIENTE COMPROU CONOSCO</option>
                <option value="❌ARQUIVAR LEAD/ JÁ COMPROU">❌ARQUIVAR LEAD/ JÁ COMPROU</option>
                <option value="👋🏻CORRETOR PARCEIRO">👋🏻CORRETOR PARCEIRO</option>
                <option value="👋🏻PORTEIRO">👋🏻PORTEIRO</option>
                <option value="⚠️PROP SUSPENDEU VENDA">⚠️PROP SUSPENDEU VENDA</option>
              </select>
            </div>
          </div>
        </div>
          
        <div
          class="filter-container"
          data-field-type="categorical"
          data-variavel="ATENDIMENTO"
        >
          <label>Atendimento</label>
          <div class="field-value" data-index="4">
            <select multiple="">
              <option value="empty">VAZIO</option>
              <option value="0.0.1 - 👁️ VALIDAR OPÇÕES ( EM RECONFIRMAÇÃO DE VISITA)">0.0.1 - 👁️ VALIDAR OPÇÕES ( EM RECONFIRMAÇÃO DE VISITA)</option>
              <option value="0.0.2 - 👁️ VALIDAR OPÇÕES ( TRADICIONAL)">0.0.2 - 👁️ VALIDAR OPÇÕES ( TRADICIONAL)</option>
              <option value="0.4 📅 - DEU PRAZO ESPECÍFICO DE BUSCA">0.4 📅 - DEU PRAZO ESPECÍFICO DE BUSCA</option>
              <option value="0.6.2  - 🔁 REAQUECER ( FASE 2 > 1 MÊS > ARQUIVAR)">0.6.2  - 🔁 REAQUECER ( FASE 2 > 1 MÊS > ARQUIVAR)</option>
              <option value="0.6.1  - 🔁 REAQUECER ( FASE 1 > 1 SEMANA)">0.6.1  - 🔁 REAQUECER ( FASE 1 > 1 SEMANA)</option>
              <option value="0.1.1 - 📄 ACOMPANHAR PÓS VENDA">0.1.1 - 📄 ACOMPANHAR PÓS VENDA</option>
              <option value="0.1.2  - 🔥📄 PROPOSTA FORMALIZADA / NEGOCIAÇÃO / BUROCRÁTICA PARA ASSINATURA">0.1.2  - 🔥📄 PROPOSTA FORMALIZADA / NEGOCIAÇÃO / BUROCRÁTICA PARA ASSINATURA</option>
              <option value="0.2.2 - 🔥💰 PUXAR PROPOSTA/VISITAS DE FECHAMENTO">0.2.2 - 🔥💰 PUXAR PROPOSTA/VISITAS DE FECHAMENTO</option>
              <option value="0.1.3 - 📆VISITA CONFIRMADA > ✍🏻COLHENDO INFORMAÇÕES PARA SUBIR FORMULÁRIO">0.1.3 - 📆VISITA CONFIRMADA > ✍🏻COLHENDO INFORMAÇÕES PARA SUBIR FORMULÁRIO</option>
              <option value="0.3.4 - 📆VISITA CONFIRMADA > 🏡ENVIAR MAIS OPÇÕES / BUSCAR MAIS AGENDAMENTOS">0.3.4 - 📆VISITA CONFIRMADA > 🏡ENVIAR MAIS OPÇÕES / BUSCAR MAIS AGENDAMENTOS</option>
              <option value="0.3.5  - 📆VISITA CONFIRMADA >❓ SONDAGEM / COLHER FILTRO">0.3.5  - 📆VISITA CONFIRMADA >❓ SONDAGEM / COLHER FILTRO</option>
              <option value="0.2  - ⏱️ JÁ COM DATA E HORA > AGUARDANDO PROPRIETÁRIO/ CORRETOR">0.2  - ⏱️ JÁ COM DATA E HORA > AGUARDANDO PROPRIETÁRIO/ CORRETOR</option>
              <option value="0.2.1 - 📤✅ BUSCANDO AGENDAMENTO (SEM DATA E HORA)">0.2.1 - 📤✅ BUSCANDO AGENDAMENTO (SEM DATA E HORA)</option>
              <option value="0.4.8 - ✍🏻 SONDAGEM / COLHEITA DE PERFIL">0.4.8 - ✍🏻 SONDAGEM / COLHEITA DE PERFIL</option>
              <option value="0.4.4 - 💰APROVAÇÃO DE CRÉDITO PARA FINANCIAMENTO">0.4.4 - 💰APROVAÇÃO DE CRÉDITO PARA FINANCIAMENTO</option>
              <option value="0.5.3  - 🏡 ENVIAR OPÇÕES (P. ALTA)">0.5.3  - 🏡 ENVIAR OPÇÕES (P. ALTA)</option>
              <option value="0.5.5  - 🏡 ENVIAR OPÇÕES (P. BAIXA)">0.5.5  - 🏡 ENVIAR OPÇÕES (P. BAIXA)</option>
            </select>
          </div>
        </div>

          <div
            class="filter-container"
            data-field-type="categorical"
            data-variavel="CAPTACAO"
          >
            <label>Captação</label>
            <div class="field-value" data-index="6">
              <select multiple="">
                <option value="empty">VAZIO</option>
                <option value="0.0.1  - 📸⏱️ AVALIAÇÃO AGENDADA / RECONFIRMAR">0.0.1  - 📸⏱️ AVALIAÇÃO AGENDADA / RECONFIRMAR</option>
                <option value="0.0.2 - 📸✍🏻 AVALIAÇÃO - MONTANDO APRESENTAÇÃO">0.0.2 - 📸✍🏻 AVALIAÇÃO - MONTANDO APRESENTAÇÃO</option>
                <option value="0.1  -  🚨 JÁ CAPTADO -  FORMULÁRIO DE  ANÚNCIO ENVIADO">0.1  -  🚨 JÁ CAPTADO -  FORMULÁRIO DE  ANÚNCIO ENVIADO</option>
                <option value="0.2  -  🚨 JÁ CAPTADO -  COLHENDO INFORMAÇÕES">0.2  -  🚨 JÁ CAPTADO -  COLHENDO INFORMAÇÕES</option>
                <option value="0.3 - 📄🗣️AVALIAÇÃO - APRESENTAÇÃO ENVIADA ( PUXANDO EXCLUSIVIDADE)">0.3 - 📄🗣️AVALIAÇÃO - APRESENTAÇÃO ENVIADA ( PUXANDO EXCLUSIVIDADE)</option>
                <option value="0.5  - 📄✅ AVALIAÇÃO FEITA - IMÓVEL COM EXCLUSIVIDADE">0.5  - 📄✅ AVALIAÇÃO FEITA - IMÓVEL COM EXCLUSIVIDADE</option>
                <option value="2.3  - 📄❌ AVALIAÇÃO FEITA - IMÓVEL SEM EXCLUSIVIDADE">2.3  - 📄❌ AVALIAÇÃO FEITA - IMÓVEL SEM EXCLUSIVIDADE</option>
                <option value="1.1  - 📸📆 AVALIAÇÃO - EM PROCESSO DE AGENDAMENTO">1.1  - 📸📆 AVALIAÇÃO - EM PROCESSO DE AGENDAMENTO</option>
                <option value="2.2  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO ( PRIORIDADE)">2.2  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO ( PRIORIDADE)</option>
                <option value="2.3  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO">2.3  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO</option>
                <option value="2.1  - ☎️EM TRATATIVA DE CAPTAÇÃO">2.1  - ☎️EM TRATATIVA DE CAPTAÇÃO</option>
                <option value="1.2  - 🗓️ VERIFICAR SE VOLTOU A VENDER">1.2  - 🗓️ VERIFICAR SE VOLTOU A VENDER</option>
                <option value="1.3 ❌  IMÓVEL COM EXCLUSIVIDADE COM OUTRA IMOBILIARIA - VERIFICAR SE ENCERROU">1.3 ❌  IMÓVEL COM EXCLUSIVIDADE COM OUTRA IMOBILIARIA - VERIFICAR SE ENCERROU</option>
                <option value="3 - ☎️ TEM IMÓVEL PARA VENDER EM OUTRO ESTADO">3 - ☎️ TEM IMÓVEL PARA VENDER EM OUTRO ESTADO</option>
                <option value="3.1 🔄 - QUER PERMUTA (TROCAR POR OUTO IMÓVEL)">3.1 🔄 - QUER PERMUTA (TROCAR POR OUTO IMÓVEL)</option>
                <option value="❌ ARQUIVAR IMÓVEL">❌ ARQUIVAR IMÓVEL</option>
                <option value="✍🏻 ATUALIZAR INFORMAÇÃO">✍🏻 ATUALIZAR INFORMAÇÃO</option>
              </select>
            </div>
          </div>

          <div
            class="filter-container"
            data-field-type="bool"
            data-variavel="Respondendo"
          >
            <label>Respondendo</label>
            <div class="field-value" data-index="8">
              <select multiple="">
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>
          </div>

          <div
            class="filter-container"
            data-field-type="int"
            data-variavel="TEMPO_SEM_CONTATO"
          >
            <label>Tempo sem contato</label>
            <div class="field-value" data-index="9">
              <input type="number" name="TEMPO_SEM_CONTATO" />
            </div>
          </div>

          <div
            class="filter-container"
            data-field-type="string"
            data-variavel="endereco"
          >
            <label>Endereço</label>
            <div class="field-value" data-index="2">
              <input type="text" name="endereco" placeholder="Endereço" />
            </div>
          </div>
          <div
            class="filter-container"
            data-field-type="categorical"
            data-variavel="bairros"
          >
            <label>Cidade / Bairro</label>
            <div class="field-value" data-index="3">
              <select multiple="multiple"></select>
            </div>
          </div>
          <div
            class="filter-container"
            data-field-type="categorical"
            data-variavel="tipo_imovel"
          >
            <label>Tipologia</label>
            <div class="field-value" data-index="4">
              <select multiple=""></select>
            </div>
          </div>
          <div
            class="filter-container"
            data-field-type="categorical"
            data-variavel="purposes_type"
          >
            <label>Aluguel ou Venda</label>
            <div class="field-value" data-index="47">
              <select multiple="">
                <option value="Aluguel">Aluguel</option>
                <option value="Venda">Venda</option>
              </select>
            </div>
          </div>
          <div class="filter-container" id="filtrosAvancados">
            <div class="field-value" data-index="advanced-filters">
              <button>Filtros Avançados</button>
            </div>
          </div>

          <br />
          <br />

          <!-- Filtros Avançados -->
          <div id="advanced-filters">
          <div
            class="filter-container"
            data-field-type="datetime"
            data-variavel="dt_atualizacao"
          >
            <label>Data de Atualização</label>
            <div class="field-value" data-index="49">
              <input type="date" name="dt_atualizacao" placeholder="Data de Atualização" />
            </div>
          </div>          
            <div
              class="filter-container"
              data-field-type="float"
              data-variavel="valor"
            >
              <label>Preço (Min - Max)</label>
              <div class="field-value" data-index="15">
                <input
                  type="number"
                  step="0.01"
                  name="valor_min"
                  placeholder="Min Preço"
                />
                <input
                  type="number"
                  step="0.01"
                  name="valor_max"
                  placeholder="Max Preço"
                />
              </div>
            </div>

            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="float"
                data-variavel="iptu"
              >
                <label>IPTU</label>
                <div class="field-value" data-index="17">
                  <input
                    type="number"
                    step="0.01"
                    name="iptu"
                    placeholder="IPTU"
                  />
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="float"
                data-variavel="condominio"
              >
                <label>Condomínio</label>
                <div class="field-value" data-index="16">
                  <input
                    type="number"
                    step="0.01"
                    name="condominio"
                    placeholder="Condomínio"
                  />
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="_source"
              >
                <label>_source</label>
                <div class="field-value" data-index="0">
                  <select multiple=""></select>
                </div>
              </div>
                <div
                  class="filter-container"
                  data-field-type="float"
                  data-variavel="metragem"
                >
                  <label>Metragem (Min - Max)</label>
                  <div class="field-value" data-index="10">
                    <input
                      type="number"
                      step="0.01"
                      name="metragem_min"
                      placeholder="Min Metragem"
                    />
                    <input
                      type="number"
                      step="0.01"
                      name="metragem_max"
                      placeholder="Max Metragem"
                    />
                  </div>
                </div>
              <div
                class="filter-container"
                data-field-type="int"
                data-variavel="banheiro"
              >
                <label>Banheiros</label>
                <div class="field-value" data-index="11">
                  <input
                    type="number"
                    name="banheiros"
                    placeholder="Banheiros"
                  />
                </div>
              </div>
                <div
                  class="filter-container"
                  data-field-type="int"
                  data-variavel="quartos"
                >
                  <label>Quartos (Min - Max)</label>
                  <div class="field-value" data-index="12">
                    <input type="number" name="quartos_min" placeholder="Min Quartos" />
                    <input type="number" name="quartos_max" placeholder="Max Quartos" />
                  </div>
                </div>
              <div
                class="filter-container"
                data-field-type="int"
                data-variavel="suites"
              >
                <label>Suítes</label>
                <div class="field-value" data-index="13">
                  <input type="number" name="suites" placeholder="Suítes" />
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="int"
                data-variavel="vagas"
              >
                <label>Vagas</label>
                <div class="field-value" data-index="14">
                  <input type="number" name="vagas" placeholder="Vagas" />
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="mobiliado"
              >
                <label>Mobiliado</label>
                <div class="field-value" data-index="25">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="numeric"
                data-variavel="andar"
              >
                <label>Andar</label>
                <div class="field-value" data-index="29">
                  <input type="number" name="andar" placeholder="Andar" />
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="elevador"
              >
                <label>Elevador</label>
                <div class="field-value" data-index="30">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="piso"
              >
                <label>Piso</label>
                <div class="field-value" data-index="26">
                  <select multiple=""></select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="varanda"
              >
                <label>Varanda</label>
                <div class="field-value" data-index="36">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="cozinha"
              >
                <label>Tipo Cozinha</label>
                <div class="field-value" data-index="38">
                  <select multiple=""></select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="gas_encanado"
              >
                <label>Gás Encanado</label>
                <div class="field-value" data-index="37">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="aceita_permuta"
              >
                <label>Aceita Permuta</label>
                <div class="field-value" data-index="22">
                  <select>
                    <option value="" selected>Select...</option>
                    <option value="undefined">Indefinido</option>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="aceita_fgts"
              >
                <label>Aceita FGTS</label>
                <div class="field-value" data-index="23">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="aceita_financiamento"
              >
                <label>Aceita Financiamento</label>
                <div class="field-value" data-index="24">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div class="flex-filters">
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="posicao_solar"
              >
                <label>Posição Solar</label>
                <div class="field-value" data-index="27">
                  <select multiple=""></select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="categorical"
                data-variavel="posicao_predio"
              >
                <label>Posição Prédio</label>
                <div class="field-value" data-index="28">
                  <select multiple=""></select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="vista_livre"
              >
                <label>Vista Livre</label>
                <div class="field-value" data-index="32">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="lazer_completo"
              >
                <label>Lazer Completo</label>
                <div class="field-value" data-index="34">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
              <div
                class="filter-container"
                data-field-type="bool"
                data-variavel="lazer_parcial"
              >
                <label>Lazer Parcial</label>
                <div class="field-value" data-index="35">
                  <select>
                    <option value="false">Não</option>
                    <option value="true">Sim</option>
                  </select>
                </div>
              </div>
            </div>
            <br />
            <div
              class="filter-container"
              data-field-type="categorical"
              data-variavel="stage_description"
            >
              <label>Estágio da obra</label>
              <div class="field-value" data-index="48">
                <select multiple=""></select>
              </div>
            </div>
            </div>
          `;

const htmlListaClientes = `
          <li data-id="">
              <div class="card">
                <div class="card-cliente-header">
                  <div>
                    <h3 id="nomeCliente">Nome do Cliente</h3>
                    <div id="recomendacao">
                    <div id="recomendacaoButton">
                      <span class="material-icons">assistant</span> 
                    </div>
                    <span class="material-icons" data-id="" id="editarLead">edit</span>
                    </div>
                  </div>
                  
                  </div>
                  <div id="respondendo">
                    <span class="material-icons"
                        ><span>Respondendo: 
                          <p id="statusRespondendo">Respondendo Status</p>
                          </span>
                        <span>Tempo sem contato: 
                          <p id="tempoSemContato">Tempo sem contato</p>
                        </span>
                    </span>
                  <p id="telefone">Telefone: <a href="https://app.painelzap.com.br/17424/live-chat/all/556181116766" target="_blank">(67) 99999-9999</a></p>
                </div>
                <div class="card-body">
                <div>
                  <div>
                    <span class="material-icons">support_agent</span>
                    <span>Situação geral:</span>
                    <select id="statusSituacaoGeral">
                      <option value="✅LEAD">✅ LEAD</option>
                      <option value="✅LEAD - INVESTIDOR">✅LEAD - INVESTIDOR</option>
                      <option value="✅LEAD -  QUER OPÇÃO EM PRÉDIO OU QUADRA ESPECÍFICA">✅LEAD -  QUER OPÇÃO EM PRÉDIO OU QUADRA ESPECÍFICA</option>
                      <option value="✅ PROPRIETÁRIO QUE IRÁ COMPRAR">✅ PROPRIETÁRIO QUE IRÁ COMPRAR</option>
                      <option value="☎️PROPRIETÁRIO">☎️PROPRIETÁRIO</option>
                      <option value="✅CLIENTE COMPROU CONOSCO">✅CLIENTE COMPROU CONOSCO</option>
                      <option value="❌ARQUIVAR LEAD/ JÁ COMPROU">❌ARQUIVAR LEAD/ JÁ COMPROU</option>
                      <option value="👋🏻CORRETOR PARCEIRO">👋🏻CORRETOR PARCEIRO</option>
                      <option value="👋🏻PORTEIRO">👋🏻PORTEIRO</option>
                      <option value="⚠️PROP SUSPENDEU VENDA">⚠️PROP SUSPENDEU VENDA</option>
                      <option value="Não informado">Não informado</option>
                    </select>
                  </div>

                  <div>
                    <span class="material-icons">support_agent</span>
                    <span>Atendimento:</span>
                    <select id="statusAtendimento">
                      <option value="0.0.1 - 👁️ VALIDAR OPÇÕES ( EM RECONFIRMAÇÃO DE VISITA)">0.0.1 - 👁️ VALIDAR OPÇÕES ( EM RECONFIRMAÇÃO DE VISITA)</option>
                      <option value="0.0.2 - 👁️ VALIDAR OPÇÕES ( TRADICIONAL)">0.0.2 - 👁️ VALIDAR OPÇÕES ( TRADICIONAL)</option>
                      <option value="0.4 📅 - DEU PRAZO ESPECÍFICO DE BUSCA">0.4 📅 - DEU PRAZO ESPECÍFICO DE BUSCA</option>
                      <option value="0.6.2  - 🔁 REAQUECER ( FASE 2 > 1 MÊS > ARQUIVAR)">0.6.2  - 🔁 REAQUECER ( FASE 2 > 1 MÊS > ARQUIVAR)</option>
                      <option value="0.6.1  - 🔁 REAQUECER ( FASE 1 > 1 SEMANA)">0.6.1  - 🔁 REAQUECER ( FASE 1 > 1 SEMANA)</option>
                      <option value="0.1.1 - 📄 ACOMPANHAR PÓS VENDA">0.1.1 - 📄 ACOMPANHAR PÓS VENDA</option>
                      <option value="0.1.2  - 🔥📄 PROPOSTA FORMALIZADA / NEGOCIAÇÃO / BUROCRÁTICA PARA ASSINATURA">0.1.2  - 🔥📄 PROPOSTA FORMALIZADA / NEGOCIAÇÃO / BUROCRÁTICA PARA ASSINATURA</option>
                      <option value="0.2.2 - 🔥💰 PUXAR PROPOSTA/VISITAS DE FECHAMENTO">0.2.2 - 🔥💰 PUXAR PROPOSTA/VISITAS DE FECHAMENTO</option>
                      <option value="0.1.3 - 📆VISITA CONFIRMADA > ✍🏻COLHENDO INFORMAÇÕES PARA SUBIR FORMULÁRIO">0.1.3 - 📆VISITA CONFIRMADA > ✍🏻COLHENDO INFORMAÇÕES PARA SUBIR FORMULÁRIO</option>
                      <option value="0.3.4 - 📆VISITA CONFIRMADA > 🏡ENVIAR MAIS OPÇÕES / BUSCAR MAIS AGENDAMENTOS">0.3.4 - 📆VISITA CONFIRMADA > 🏡ENVIAR MAIS OPÇÕES / BUSCAR MAIS AGENDAMENTOS</option>
                      <option value="0.3.5  - 📆VISITA CONFIRMADA >❓ SONDAGEM / COLHER FILTRO">0.3.5  - 📆VISITA CONFIRMADA >❓ SONDAGEM / COLHER FILTRO</option>
                      <option value="0.2  - ⏱️ JÁ COM DATA E HORA > AGUARDANDO PROPRIETÁRIO/ CORRETOR">0.2  - ⏱️ JÁ COM DATA E HORA > AGUARDANDO PROPRIETÁRIO/ CORRETOR</option>
                      <option value="0.2.1 - 📤✅ BUSCANDO AGENDAMENTO (SEM DATA E HORA)">0.2.1 - 📤✅ BUSCANDO AGENDAMENTO (SEM DATA E HORA)</option>
                      <option value="0.4.8 - ✍🏻 SONDAGEM / COLHEITA DE PERFIL">0.4.8 - ✍🏻 SONDAGEM / COLHEITA DE PERFIL</option>
                      <option value="0.4.4 - 💰APROVAÇÃO DE CRÉDITO PARA FINANCIAMENTO">0.4.4 - 💰APROVAÇÃO DE CRÉDITO PARA FINANCIAMENTO</option>
                      <option value="0.5.3  - 🏡 ENVIAR OPÇÕES (P. ALTA)">0.5.3  - 🏡 ENVIAR OPÇÕES (P. ALTA)</option>
                      <option value="0.5.5  - 🏡 ENVIAR OPÇÕES (P. BAIXA)">0.5.5  - 🏡 ENVIAR OPÇÕES (P. BAIXA)</option>
                      <option value="Não informado">Não informado</option>
                    </select>
                  </div>

                  <div>
                    <span class="material-icons">catching_pokemon</span>
                    <span>Captação:</span>
                    <select id="statusCaptacao">
                      <option value="0.0.1  - 📸⏱️ AVALIAÇÃO AGENDADA / RECONFIRMAR">0.0.1  - 📸⏱️ AVALIAÇÃO AGENDADA / RECONFIRMAR</option>
                      <option value="0.0.2 - 📸✍🏻 AVALIAÇÃO - MONTANDO APRESENTAÇÃO">0.0.2 - 📸✍🏻 AVALIAÇÃO - MONTANDO APRESENTAÇÃO</option>
                      <option value="0.1  -  🚨 JÁ CAPTADO -  FORMULÁRIO DE  ANÚNCIO ENVIADO">0.1  -  🚨 JÁ CAPTADO -  FORMULÁRIO DE  ANÚNCIO ENVIADO</option>
                      <option value="0.2  -  🚨 JÁ CAPTADO -  COLHENDO INFORMAÇÕES">0.2  -  🚨 JÁ CAPTADO -  COLHENDO INFORMAÇÕES</option>
                      <option value="0.3 - 📄🗣️AVALIAÇÃO - APRESENTAÇÃO ENVIADA ( PUXANDO EXCLUSIVIDADE)">0.3 - 📄🗣️AVALIAÇÃO - APRESENTAÇÃO ENVIADA ( PUXANDO EXCLUSIVIDADE)</option>
                      <option value="0.5  - 📄✅ AVALIAÇÃO FEITA - IMÓVEL COM EXCLUSIVIDADE">0.5  - 📄✅ AVALIAÇÃO FEITA - IMÓVEL COM EXCLUSIVIDADE</option>
                      <option value="2.3  - 📄❌ AVALIAÇÃO FEITA - IMÓVEL SEM EXCLUSIVIDADE">2.3  - 📄❌ AVALIAÇÃO FEITA - IMÓVEL SEM EXCLUSIVIDADE</option>
                      <option value="1.1  - 📸📆 AVALIAÇÃO - EM PROCESSO DE AGENDAMENTO">1.1  - 📸📆 AVALIAÇÃO - EM PROCESSO DE AGENDAMENTO</option>
                      <option value="2.2  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO ( PRIORIDADE)">2.2  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO ( PRIORIDADE)</option>
                      <option value="2.3  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO">2.3  - 📸✅ IMÓVEL JÁ CAPTADO > BUSCAR AVALIAÇÃO/  RELACIONAMENTO</option>
                      <option value="2.1  - ☎️EM TRATATIVA DE CAPTAÇÃO">2.1  - ☎️EM TRATATIVA DE CAPTAÇÃO</option>
                      <option value="1.2  - 🗓️ VERIFICAR SE VOLTOU A VENDER">1.2  - 🗓️ VERIFICAR SE VOLTOU A VENDER</option>
                      <option value="1.3 ❌  IMÓVEL COM EXCLUSIVIDADE COM OUTRA IMOBILIARIA - VERIFICAR SE ENCERROU">1.3 ❌  IMÓVEL COM EXCLUSIVIDADE COM OUTRA IMOBILIARIA - VERIFICAR SE ENCERROU</option>
                      <option value="3 - ☎️ TEM IMÓVEL PARA VENDER EM OUTRO ESTADO">3 - ☎️ TEM IMÓVEL PARA VENDER EM OUTRO ESTADO</option>
                      <option value="3.1 🔄 - QUER PERMUTA (TROCAR POR OUTO IMÓVEL)">3.1 🔄 - QUER PERMUTA (TROCAR POR OUTO IMÓVEL)</option>
                      <option value="❌ ARQUIVAR IMÓVEL">❌ ARQUIVAR IMÓVEL</option>
                      <option value="✍🏻 ATUALIZAR INFORMAÇÃO">✍🏻 ATUALIZAR INFORMAÇÃO</option>
                    </select>
                  </div>                  
                  <button type="submit" id="salvarCards">Salvar</button>
                </div>

                  </div>
                </div>
              </div>
            </li>
            `;

const fieldForm = `
            <div
            class="filter-container"
            data-field-type=""
            data-variavel=""
          >
            <label></label>
            <div class="field-value" data-index="">
              <input type="" name="" placeholder="" />
            </div>
          </div>
          `;

const htmlcomparacao = `<table>
              <tr>
                <th>Informação</th>
                <th>Cliente</th>
                <th>Imovel</th>
                <th>Status</th>
              </tr>
              <tr>
                <td data-parametro="Identificação">Identificação</td>
                <td data-parametro="customer_id"></td>
                <td data-parametro="url_imovel"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Identificação-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Nome do Contato">Nome do Contato</td>
                <td data-parametro="Nome"></td>
                <td data-parametro="advertiser"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Nome do Contato-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Telefone do Contato">Telefone do Contato</td>
                <td data-parametro="Telefone"></td>
                <td data-parametro="whats"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Telefone do Contato-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Situação Geral">Situação Geral</td>
                <td data-parametro="SituacaoGeral"></td>
                <td data-parametro="#"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Situação Geral-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Atendimento">Atendimento</td>
                <td data-parametro="ATENDIMENTO"></td>
                <td data-parametro="#"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Atendimento-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Atendimento Secundário">Atendimento Secundário</td>
                <td data-parametro="ATENDIMENTO_SECUNDAR"></td>
                <td data-parametro="#"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Atendimento Secundário-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Captação">Captação</td>
                <td data-parametro="CAPTACAO"></td>
                <td data-parametro="#"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Captação-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Anunciante">Anunciante</td>
                <td data-parametro="#"></td>
                <td data-parametro="advertiser"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Anunciante-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Endereço">Endereço</td>
                <td data-parametro="#"></td>
                <td data-parametro="endereco"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Endereço-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Bairro">Bairro</td>
                <td data-parametro="BAIRROS"></td>
                <td data-parametro="bairro"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Bairro-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Observações sobre o Bairro">Observações sobre o Bairro</td>
                <td data-parametro="OBS_SOBRE_O_BAIRRO"></td>
                <td data-parametro="#"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Observações sobre o Bairro-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Tipo do Imóvel">Tipo do Imóvel</td>
                <td data-parametro="TIPOLOGIA"></td>
                <td data-parametro="tipo_imovel"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Tipo do Imóvel-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Enquadramento">Enquadramento</td>
                <td data-parametro="ENQUADRAMENTO"></td>
                <td data-parametro="enquadramento"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Enquadramento-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Metragem Mínima">Metragem Mínima</td>
                <td data-parametro="METRAGEM_MINIMA"></td>
                <td data-parametro="metragem"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Metragem Mínima-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Quartos">Quartos</td>
                <td data-parametro="QUARTOS"></td>
                <td data-parametro="quartos"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Quartos-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Suítes">Suítes</td>
                <td data-parametro="SUITE"></td>
                <td data-parametro="suites"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Suítes-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Banheiros">Banheiros</td>
                <td data-parametro="BANHEIROS"></td>
                <td data-parametro="banheiro"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Banheiros-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Vagas de Garagem">Vagas de Garagem</td>
                <td data-parametro="VAGA_DE_GARAGEM"></td>
                <td data-parametro="vagas"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Vagas de Garagem-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Valor de Venda">Valor de Venda</td>
                <td data-parametro="VALOR_LIMITE"></td>
                <td data-parametro="valor"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Valor de Venda-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Valor de Condomínio">Valor de Condomínio</td>
                <td data-parametro="VALOR_DO_CONDOMINIO"></td>
                <td data-parametro="condominio"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Valor de Condomínio-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Valor de IPTU">Valor de IPTU</td>
                <td data-parametro="#"></td>
                <td data-parametro="iptu"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Valor de IPTU-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Preço do m2">Preço do m2</td>
                <td data-parametro="VALOR_DO_MT2"></td>
                <td data-parametro="preco_m2"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Preço do m2-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Observações sobre o Valor">Observações sobre o Valor</td>
                <td data-parametro="OBS_SOBRE_O_VALOR"></td>
                <td data-parametro="#"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Observações sobre o Valor-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Exigências">Exigências</td>
                <td data-parametro="EXIG_NAO_PODE_FALTAR"></td>
                <td data-parametro="#"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Exigências-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Andar">Andar</td>
                <td data-parametro="ANDAR"></td>
                <td data-parametro="andar"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Andar-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Posição Solar">Posição Solar</td>
                <td data-parametro="POSICAO_SOLAR"></td>
                <td data-parametro="posicao_solar"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Posição Solar-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Posição do Prédio">Posição do Prédio</td>
                <td data-parametro="POSICAO_PREDIO"></td>
                <td data-parametro="posicao_predio"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Posição do Prédio-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Forma de Pagamento">Forma de Pagamento</td>
                <td data-parametro="FORMA_DE_PAGAMENTO"></td>
                <td data-parametro="#"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Forma de Pagamento-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Aceita Permuta">Aceita Permuta</td>
                <td data-parametro="aceita_permuta"></td>
                <td data-parametro="aceita_permuta"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Aceita Permuta-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Aceita FGTS">Aceita FGTS</td>
                <td data-parametro="aceita_fgts"></td>
                <td data-parametro="aceita_fgts"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Aceita FGTS-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Aceita Financiamento">Aceita Financiamento</td>
                <td data-parametro="aceita_financiamento"></td>
                <td data-parametro="aceita_financiamento"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Aceita Financiamento-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Reforma (Texto)">Reforma (Texto)</td>
                <td data-parametro="REFORMA"></td>
                <td data-parametro="REFORMA"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Reforma (Texto)-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Reformado">Reformado</td>
                <td data-parametro="reformado"></td>
                <td data-parametro="reformado"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Reformado-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Hidráulica e Elétrica (Texto)">Hidráulica e Elétrica (Texto)</td>
                <td data-parametro="HIDRAULICA_E_ELETRIC"></td>
                <td data-parametro="HIDRAULICA_E_ELETRIC"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Hidráulica e Elétrica (Texto)-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Hidráulica reformada">Hidráulica reformada</td>
                <td data-parametro="reforma_hidraulica"></td>
                <td data-parametro="reforma_hidraulica"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Hidráulica reformada-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Elétrica reformada">Elétrica reformada</td>
                <td data-parametro="reforma_eletrica"></td>
                <td data-parametro="reforma_eletrica"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Elétrica reformada-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Fachada reformada">Fachada reformada</td>
                <td data-parametro="FACHADA"></td>
                <td data-parametro="FACHADA"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Fachada reformada-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Mobiliado">Mobiliado</td>
                <td data-parametro="MOBILIADO"></td>
                <td data-parametro="mobiliado"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Mobiliado-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Varanda">Varanda</td>
                <td data-parametro="VARANDA"></td>
                <td data-parametro="varanda"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Varanda-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Vazado">Vazado</td>
                <td data-parametro="VAZADO"></td>
                <td data-parametro="vazado"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Vazado-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Descrição da Vista">Descrição da Vista</td>
                <td data-parametro="VISTA"></td>
                <td data-parametro="VISTA"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Descrição da Vista-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Vista Livre">Vista Livre</td>
                <td data-parametro="vista_livre"></td>
                <td data-parametro="vista_livre"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Vista Livre-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="DCE">DCE</td>
                <td data-parametro="DCE"></td>
                <td data-parametro="dce"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="DCE-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Tipo de Cozinha">Tipo de Cozinha</td>
                <td data-parametro="TIPO_DE_COZINHA"></td>
                <td data-parametro="tipo_cozinha"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Tipo de Cozinha-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Tipo de Piso">Tipo de Piso</td>
                <td data-parametro="PISO"></td>
                <td data-parametro="piso"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Tipo de Piso-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Elevador">Elevador</td>
                <td data-parametro="ELEVADOR"></td>
                <td data-parametro="elevador"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Elevador-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Gás Encanado">Gás Encanado</td>
                <td data-parametro="GAS_ENCANADO"></td>
                <td data-parametro="gas_encanado"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Gás Encanado-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Área de Lazer">Área de Lazer</td>
                <td data-parametro="AREA_DE_LAZER"></td>
                <td data-parametro="AREA_DE_LAZER"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Área de Lazer-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Fitness / Sala de Ginástica">Fitness / Sala de Ginástica</td>
                <td data-parametro="fitness"></td>
                <td data-parametro="fitness"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Fitness / Sala de Ginástica-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Salão de Jogos">Salão de Jogos</td>
                <td data-parametro="salao_de_jogos"></td>
                <td data-parametro="salao_de_jogos"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Salão de Jogos-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Salão de Festas">Salão de Festas</td>
                <td data-parametro="salao_de_festas"></td>
                <td data-parametro="salao_de_festas"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Salão de Festas-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Sauna">Sauna</td>
                <td data-parametro="sauna"></td>
                <td data-parametro="sauna"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Sauna-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Piscina">Piscina</td>
                <td data-parametro="piscina"></td>
                <td data-parametro="piscina"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Piscina-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Quadra Poliesportiva">Quadra Poliesportiva</td>
                <td data-parametro="quadra_poliesportiva"></td>
                <td data-parametro="quadra_poliesportiva"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Quadra Poliesportiva-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Churrasqueira">Churrasqueira</td>
                <td data-parametro="churrasqueira"></td>
                <td data-parametro="churrasqueira"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Churrasqueira-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Playground">Playground</td>
                <td data-parametro="playground"></td>
                <td data-parametro="playground"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Playground-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Espaço Gourmet">Espaço Gourmet</td>
                <td data-parametro="espaco_gourmet"></td>
                <td data-parametro="espaco_gourmet"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Espaço Gourmet-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Depósito">Depósito</td>
                <td data-parametro="deposito"></td>
                <td data-parametro="deposito"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Depósito-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Número de Vagas">Número de Vagas</td>
                <td data-parametro="numero_de_vagas"></td>
                <td data-parametro="numero_de_vagas"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Número de Vagas-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Tipo de Garagem">Tipo de Garagem</td>
                <td data-parametro="TIPO_DE_GARAGEM"></td>
                <td data-parametro="tipo_garagem"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Tipo de Garagem-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Área Construída">Área Construída</td>
                <td data-parametro="AREA_CONSTRUIDA"></td>
                <td data-parametro="area_construida"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Área Construída-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Área Total">Área Total</td>
                <td data-parametro="AREA_TOTAL"></td>
                <td data-parametro="area_total"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Área Total-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Área Útil">Área Útil</td>
                <td data-parametro="AREA_UTIL"></td>
                <td data-parametro="area_util"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Área Útil-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Número de Andares">Número de Andares</td>
                <td data-parametro="numero_de_andares"></td>
                <td data-parametro="numero_de_andares"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Número de Andares-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Andar do Imóvel">Andar do Imóvel</td>
                <td data-parametro="andar_do_imovel"></td>
                <td data-parametro="andar_do_imovel"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Andar do Imóvel-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Descrição do Imóvel">Descrição do Imóvel</td>
                <td data-parametro="DESCRICAO_IMOVEL"></td>
                <td data-parametro="descricao_imovel"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Descrição do Imóvel-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Estado de Conservação">Estado de Conservação</td>
                <td data-parametro="estado_de_conservacao"></td>
                <td data-parametro="estado_de_conservacao"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Estado de Conservação-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Valor de Venda">Valor de Venda</td>
                <td data-parametro="VALOR_DE_VENDA"></td>
                <td data-parametro="valor_de_venda"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Valor de Venda-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Valor do Condomínio">Valor do Condomínio</td>
                <td data-parametro="VALOR_CONDOMINIO"></td>
                <td data-parametro="valor_condominio"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Valor do Condomínio-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="IPTU">IPTU</td>
                <td data-parametro="IPTU"></td>
                <td data-parametro="iptu"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="IPTU-status"></span></td>
              </tr>
              <tr>
                <td data-parametro="Data de Cadastro">Data de Cadastro</td>
                <td data-parametro="data_cadastro"></td>
                <td data-parametro="data_cadastro"></td>
                <td data-parametro="Status"><span class="material-icons" data-parametro="Data de Cadastro-status"></span></td>
              </tr>
            </table>
            <span id="editarCompararCliente">Editar Dados</span>
  `;

// Define the mapping between customer fields and Google Forms entry IDs
const deParaMap = [
  { entry_id: "1960817826", label: "Nome", field_type: "Texto" },
  {
    entry_id: "1341565887",
    label: "CORRETOR_RESPONSAVEL",
    field_type: "Texto",
  },
  { entry_id: "27327529", label: "Telefone", field_type: "Texto" },
  { entry_id: "18303552", label: "CEP", field_type: "Texto" },
  { entry_id: "583880878", label: "BLOCO", field_type: "Texto" },
  { entry_id: "1027160198", label: "ANDAR", field_type: "Número" },
  { entry_id: "79609335", label: "QUADRA", field_type: "Texto" },
  { entry_id: "926409166", label: "OBS_SOBRE_O_VALOR", field_type: "Texto" },
  { entry_id: "117143629", label: "VALOR_LIMITE", field_type: "Número" },
  { entry_id: "2135112450", label: "VALOR_ALUGUEL", field_type: "Número" },
  { entry_id: "190476240", label: "METRAGEM_MINIMA", field_type: "Número" },
  { entry_id: "1780755280", label: "TIPOLOGIA", field_type: "Seleção Única" },
  { entry_id: "173894172", label: "QUARTOS", field_type: "Número" },
  { entry_id: "2010995230", label: "BANHEIROS", field_type: "Número" },
  { entry_id: "1274204812", label: "SUITE", field_type: "Número" },
  {
    entry_id: "1147798654",
    label: "VALOR_DO_CONDOMINIO",
    field_type: "Número",
  },
  {
    entry_id: "1606873076",
    label: "ORIGINAL_OU_INTERNO",
    field_type: "Seleção Única",
  },
  { entry_id: "1418209565", label: "DESTAQUE", field_type: "Seleção Única" },
  { entry_id: "1116430750", label: "VAGAS_COBERTAS", field_type: "Número" },
  { entry_id: "979452409", label: "VAGA_DE_GARAGEM", field_type: "Número" },
  { entry_id: "837319862", label: "ELEVADOR", field_type: "Número (0 ou 1)" },
  {
    entry_id: "219816771",
    label: "AREA_DE_LAZER",
    field_type: "Múltipla Seleção",
  },
  { entry_id: "123132493", label: "Interior", field_type: "Múltipla Seleção" },
  {
    entry_id: "1356019515",
    label: "Posicao_Para_Descricao",
    field_type: "Múltipla Seleção",
  },
  {
    entry_id: "433431237",
    label: "Detalhes_do_Predio_ou_Condominio",
    field_type: "Múltipla Seleção",
  },
  {
    entry_id: "867241147",
    label: "Localizacao_Para_Descricao",
    field_type: "Múltipla Seleção",
  },
  { entry_id: "1283628063", label: "INFOS_DESCRICAO", field_type: "Texto" },
  { entry_id: "398414929", label: "EMAIL_RESPONSAVEL", field_type: "Texto" },
];

export {
  fieldsImoveis,
  htmlFiltroImoveis,
  htmlListaImovel,
  fieldsClientes,
  htmlFiltroClientes,
  htmlListaClientes,
  fieldForm,
  htmlcomparacao,
  deParaMap,
};

// dados tabela
/* th Informação = [
    "Identificação",
    "Nome do Contato",
    "Telefone do Contato",
    "Situação Geral",
    "Atendimento",
    "Atendimento Secundário",
    "Captação",
    "Anunciante",
    "Endereço",
    "Bairro",
    "Observações sobre o Bairro",
    "Tipo do Imóvel",
    "Enquadramento",
    "Metragem Mínima",
    "Quartos",
    "Suítes",
    "Banheiros",
    "Vagas de Garagem",
    "Valor de Venda",
    "Valor de Condomínio",
    "Valor de IPTU",
    "Preço do m2",
    "Observações sobre o Valor",
    "Exigências",
    "Andar",
    "Posição Solar",
    "Posição do Prédio",
    "Forma de Pagamento",
    "Aceita Permuta",
    "Aceita FGTS",
    "Aceita Financiamento",
    "Reforma (Texto)",
    "Reformado",
    "Hidráulica e Elétrica (Texto)",
    "Hidráulica reformada",
    "Elétrica reformada",
    "Fachada reformada",
    "Mobiliado",
    "Varanda",
    "Vazado",
    "Descrição da Vista",
    "Vista Livre",
    "DCE",
    "Tipo de Cozinha",
    "Tipo de Piso",
    "Elevador",
    "Gás Encanado",
    "Área de Lazer",
    "Fitness / Sala de Ginástica",
    "Salão de Jogos",
    "Salão de Festas",
    "Sauna",
    "Piscina",
    "Piscina Aquecida",
    "Quadra Esportiva",
    "Churrasqueira",
    "Cinema",
    "Lavanderia",
    "Playground",
    "Pista de Skate",
    "Lazer Completo",
    "Lazer Parcial",
    "Preferências personalizadas",
    "Data e Hora",
    "Data Hora ou Dúvida",
    "De Onde Veio",
    "Feedback Individual",
    "Quem Fez",
    "Quem Validou",
    "Tentativa",
    "Respondendo",
    "Visitas Feitas",
    "Última Interação",
    "Feedback Negativo",
    "Feedback Positivo",
    "Abertura Pra Ligação",
    "Abertura Pra Abrir Leque",
    "Preferência de Horario de Visita"
]
*/
/* th Cliente = [
    "customer_id",
    "Nome",
    "Telefone",
    "SITUACAO_GERAL",
    "ATENDIMENTO",
    "ATENDIMENTO_SECUNDAR",
    "CAPTACAO",
    "#",
    "#",
    "BAIRROS",
    "OBS_SOBRE_O_BAIRRO",
    "TIPOLOGIA",
    "ENQUADRAMENTO",
    "METRAGEM_MINIMA",
    "QUARTOS",
    "SUITE",
    "BANHEIROS",
    "VAGA_DE_GARAGEM",
    "VALOR_LIMITE",
    "VALOR_DO_CONDOMINIO",
    "#",
    "VALOR_DO_MT2",
    "OBS_SOBRE_O_VALOR",
    "EXIG_NAO_PODE_FALTAR",
    "ANDAR",
    "POSICAO_SOLAR",
    "POSICAO_PREDIO",
    "FORMA_DE_PAGAMENTO",
    "aceita_permuta",
    "aceita_fgts",
    "aceita_financiamento",
    "REFORMA",
    "reformado",
    "HIDRAULICA_E_ELETRIC",
    "reforma_hidraulica",
    "reforma_eletrica",
    "FACHADA",
    "MOBILIADO",
    "VARANDA",
    "VAZADO",
    "VISTA",
    "vista_livre",
    "DCE",
    "TIPO_DE_COZINHA",
    "PISO",
    "ELEVADOR",
    "GAS_ENCANADO",
    "AREA_DE_LAZER",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "lazer_completo",
    "lazer_parcial",
    "PREF_SE_TIVER_MELHOR",
    "DATA_E_HORA",
    "DATA_HORA_OU_DUVIDA",
    "DE_ONDE_VEIO",
    "FEEDBACK_INDIVIDUAL",
    "QUEM_FEZ",
    "QUEM_VALIDOU",
    "TENTATIVA",
    "Respondendo",
    "VisitasFeitas",
    "UltimaInteracao",
    "FeedbackNegativo",
    "FeedbackPositivo",
    "AberturaPraLigacao",
    "AberturaPraAbrirLeque",
    "PreferenciaDeHorariosDeVisita"
]
*/
/* th Imovel = [
    "url_imovel",
    "#",
    "whats",
    "#",
    "#",
    "#",
    "#",
    "advertiser",
    "endereco",
    "bairro",
    "#",
    "tipo_imovel",
    "enquadramento",
    "metragem",
    "quartos",
    "suites",
    "banheiro",
    "vagas",
    "valor",
    "condominio",
    "iptu",
    "preco_m2",
    "#",
    "#",
    "andar",
    "posicao_solar",
    "posicao_predio",
    "#",
    "aceita_permuta",
    "aceita_fgts",
    "aceita_financiamento",
    "#",
    "reformado",
    "#",
    "reforma_hidraulica",
    "reforma_eletrica",
    "fachada_reformada",
    "mobiliado",
    "varanda",
    "vazado",
    "#",
    "vista_livre",
    "dce",
    "tipo_cozinha",
    "piso",
    "elevador",
    "gas_encanado",
    "#",
    "fitness",
    "salao_de_jogos",
    "salao_de_festas",
    "sauna",
    "piscina",
    "piscina_aquecida",
    "quadra_esportiva",
    "churrasqueira",
    "cinema",
    "lavanderia",
    "playground",
    "pista_de_skate",
    "lazer_completo",
    "lazer_parcial",
    "#",
    "dt_atualizacao",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#",
    "#"
]
*/
