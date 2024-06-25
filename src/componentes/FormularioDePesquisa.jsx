import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import carregando from '../imagens/loading.svg'
import { SERVIDOR } from '../../enderecoDoServidor';
import { contexto } from '../App';

export default function FormularioDePesquisa({filtros, apenasDoUsuario}) {
  let componenteExiste = true;
  const contexto2 = useContext(contexto);
  const [erroAoObterDados, definirErroAoObterDados] = useState(false);
  const [jogos, definirJogos] = useState();
  const [opcoesTempo, definirOpcoesTempo] = useState(filtros.opcoesTempo || '');
  const [opcoesTempoEntre, definirOpcoesTempoEntre] = useState(false);
  const dias = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  const [diasDisponiveis, definirDiasDisponiveis] = useState(['']);
  const [aplicandoDisponilibidade, definirAplicandoDisponilibidade] = useState(false);
  const historico = useHistory();
  const [aguardando, definirAguardando] = useState(false);
  const urlAtual = useLocation();
  const [tempoDeJogoAnosState, definirTempoDeJogoAnosState] = useState('');
  const [tempoDeJogoMesesState, definirTempoDeJogoMesesState] = useState('');
  const [tempoDeJogoAnos2State, definirTempoDeJogoAnos2State] = useState('');
  const [tempoDeJogoMeses2State, definirTempoDeJogoMeses2State] = useState('');
  const [resultadosPorPaginaState, definirResultadosPorPaginaState] = useState(10);

  useEffect(()=>{
    if (!contexto2)
      return;
    fetch(SERVIDOR+`/jogos`)
    .then(resp=>resp.json())
    .then(resp=>{
      if (resp.erro)
        throw resp.erro;
      if (componenteExiste) {
        definirErroAoObterDados(false);
        definirJogos(resp);
      }
    })
    .catch(erro=>{
      console.log(erro);
      if (componenteExiste)
        definirErroAoObterDados(true);
    });
    //if (listaDeJogos)
    //  definirJogos(listaDeJogos);
    //else
    //  definirErroAoObterDados(true);

    return ()=>componenteExiste = false;
  }, [])

  useEffect(()=>{
    document.getElementById('pesquisa').reset();
    if (filtros.opcoesNome)
      document.getElementById('opcoesNome').value = filtros.opcoesNome;
    if (filtros.nomeNoJogo)
      document.getElementById('nomeNoJogo').value = filtros.nomeNoJogo;
    if (componenteExiste) {
      if (filtros.opcoesTempo) {
        document.getElementById('opcoesTempo').value = filtros.opcoesTempo;
        if (filtros.opcoesTempo == 'entre')
          definirOpcoesTempoEntre(true);
      } else
        definirOpcoesTempo('');
      if (filtros.tempoDeJogoAnos && !isNaN(filtros.tempoDeJogoAnos)
          && filtros.tempoDeJogoAnos >= 0 && filtros.tempoDeJogoAnos <= 100)
        //document.getElementById('tempoDeJogoAnos').value = filtros.tempoDeJogoAnos;
        definirTempoDeJogoAnosState(filtros.tempoDeJogoAnos);
      if (filtros.tempoDeJogoMeses && !isNaN(filtros.tempoDeJogoMeses)
          && filtros.tempoDeJogoMeses >= 0 && filtros.tempoDeJogoMeses <= 100)
        //document.getElementById('tempoDeJogoAnos').value = filtros.tempoDeJogoAnos;
        definirTempoDeJogoMesesState(filtros.tempoDeJogoMeses);
    }
    if (filtros.quando)
      document.getElementById('quando').value = filtros.quando;
    if (filtros.de)
      document.getElementById('de').value = filtros.de;
    if (filtros.ate)
      document.getElementById('ate').value = filtros.ate;
    const ate = document.getElementById('ate');
    if (ate.value && document.getElementById('de').value
    && ate.value <= document.getElementById('de').value) {
      //ate.style.backgroundColor = 'lightgray';
      ate.style.cursor = 'help';
      ate.title = 'Do dia seguinte';
    } else {
      //ate.style.backgroundColor = '';
      ate.style.cursor = 'default';
      ate.title = '';
    }
    const arr = [''];
    for (let i = 1; i < filtros.qtdeFiltrosDisponibilidade; i++)
      arr.push('');
    if (filtros.usaChatDeVoz)
      document.getElementById('usaChatDeVoz').value = filtros.usaChatDeVoz;
    //if (filtros.resultadosPorPagina)
    //  document.getElementById('resultadosPorPagina').value = filtros.resultadosPorPagina;
    //if (componenteExiste && filtros.resultadosPorPagina && !isNaN(filtros.resultadosPorPagina)
    //    && filtros.resultadosPorPagina >= 3 && filtros.resultadosPorPagina <= 100)
    //  //document.getElementById('tempoDeJogoAnos').value = filtros.tempoDeJogoAnos;
    //  definirResultadosPorPaginaState(filtros.resultadosPorPagina);
    if (filtros.emOrdem)
      document.getElementById('emOrdem').value = filtros.emOrdem;
    if (filtros.ordenarPor)
      document.getElementById('ordenarPor').value = filtros.ordenarPor;
    if (componenteExiste) {
      if (filtros.resultadosPorPagina) {
        if (isNaN(filtros.resultadosPorPagina))
          definirResultadosPorPaginaState(10);
        else if(filtros.resultadosPorPagina < 3)
          definirResultadosPorPaginaState(3);
        else if (filtros.resultadosPorPagina > 100)
          definirResultadosPorPaginaState(100);
        else
          definirResultadosPorPaginaState(filtros.resultadosPorPagina);
      } else
        definirResultadosPorPaginaState(10);
      definirDiasDisponiveis(arr);
      definirAplicandoDisponilibidade(true);
      definirAguardando(false);
    }
  }, [filtros])

  useEffect(()=>{
    if (filtros.jogo && jogos)
      document.getElementById('jogo').value = filtros.jogo;
  }, [jogos,filtros])

  useEffect(()=>{
    if (opcoesTempoEntre && componenteExiste) {
      //if (filtros.tempoDeJogoAnos2)
      //  document.getElementById('tempoDeJogoAnos2').value = filtros.tempoDeJogoAnos2;
      //if (filtros.tempoDeJogoMeses2)
      //  document.getElementById('tempoDeJogoMeses2').value = filtros.tempoDeJogoMeses2;
      if (filtros.tempoDeJogoAnos2 && !isNaN(filtros.tempoDeJogoAnos2)
          && filtros.tempoDeJogoAnos2 >= 0 && filtros.tempoDeJogoAnos2 <= 100)
        //document.getElementById('tempoDeJogoAnos').value = filtros.tempoDeJogoAnos;
        definirTempoDeJogoAnos2State(filtros.tempoDeJogoAnos2);
      if (filtros.tempoDeJogoMeses2 && !isNaN(filtros.tempoDeJogoMeses2)
          && filtros.tempoDeJogoMeses2 >= 0 && filtros.tempoDeJogoMeses2 <= 100)
        //document.getElementById('tempoDeJogoAnos').value = filtros.tempoDeJogoAnos;
        definirTempoDeJogoMeses2State(filtros.tempoDeJogoMeses2);
      //if (componenteExiste)
        definirOpcoesTempoEntre(false);
    }
  }, [opcoesTempoEntre])

  useEffect(()=>{
    if (aplicandoDisponilibidade) {
      if (filtros.opcoesDisponibilidade)
        document.getElementById('opcoesDisponibilidade').value = filtros.opcoesDisponibilidade;
      for (let i = 2; i <= diasDisponiveis.length; i++) {
        if (filtros['quando'+i])
          document.getElementById('quando'+i).value = filtros['quando'+i];
        if (filtros['de'+i])
          document.getElementById('de'+i).value = filtros['de'+i];
        if (filtros['ate'+i])
          document.getElementById('ate'+i).value = filtros['ate'+i];
        const ate = document.getElementById('ate'+i);
        if (ate.value && document.getElementById('de'+i).value
        && ate.value <= document.getElementById('de'+i).value) {
          //ate.style.backgroundColor = 'lightgray';
          ate.style.cursor = 'help';
          ate.title = 'Do dia seguinte';
        } else {
          //ate.style.backgroundColor = '';
          ate.style.cursor = 'default';
          ate.title = '';
        }
      }
      if (componenteExiste)
        definirAplicandoDisponilibidade(false);
    }
  }, [aplicandoDisponilibidade])

  //useEffect(()=>{
  //  document.getElementById('resultadosPorPagina').value = resultadosPorPaginaState;
  //}, [resultadosPorPaginaState])

  function pesquisar(e) {
    e.preventDefault();
    if (aguardando)
      return;
    if (erroAoObterDados)
      return;
    
    const dados = Object.fromEntries(new FormData(e.target));
    //console.log(dados);
    if (!dados.jogo)
      delete dados.jogo;
    
    if (!dados.opcoesNome)
      delete dados.opcoesNome;
    if (!dados.nomeNoJogo)
      delete dados.nomeNoJogo;

    if (!dados.opcoesTempo)
      delete dados.opcoesTempo;
    if (!dados.tempoDeJogoAnos)
      delete dados.tempoDeJogoAnos;
    if (!dados.tempoDeJogoMeses)
      delete dados.tempoDeJogoMeses;
    if (!dados.tempoDeJogoAnos2)
      delete dados.tempoDeJogoAnos2;
    if (!dados.tempoDeJogoMeses2)
      delete dados.tempoDeJogoMeses2;

    let l = 2;
    while (dados['quando'+l]) {
      if (!dados['de'+l])
        delete dados['de'+l];
      if (!dados['ate'+l])
        delete dados['ate'+l];
      l++;
    }
    l--;
    for (let i = 0; i < l; i++) {
      let id = i == 0 ? '' : i+1;
      if (dados['quando'+id] == 'qualquerDia' && !dados['de'+id] && !dados['ate'+id]) {
        for (let j = i; j < l-1; j++) {
          let atual = j == 0 ? '' : j+1;
          let proximo = j+2;
          if (dados['quando'+proximo])
            dados['quando'+atual] = dados['quando'+proximo];
          if (dados['de'+proximo])
            dados['de'+atual] = dados['de'+proximo];
          if (dados['ate'+proximo])
            dados['ate'+atual] = dados['ate'+proximo];
        }
        if (l > 1) {
          delete dados['quando'+l];
          delete dados['de'+l];
          delete dados['ate'+l];
        }
        l--;
        i--;
      }
    }
    if (!dados.opcoesDisponibilidade)
      delete dados.opcoesDisponibilidade;
    if (dados.quando == 'qualquerDia' && !dados.de && !dados.ate){
      delete dados.quando;
    }
    if (!dados.de)
      delete dados.de;
    if (!dados.ate)
      delete dados.ate;

    if (!dados.usaChatDeVoz)
      delete dados.usaChatDeVoz;
    if (!dados.resultadosPorPagina || dados.resultadosPorPagina == 10 || dados.resultadosPorPagina == 0)
      delete dados.resultadosPorPagina;
    if (!dados.emOrdem)
      delete dados.emOrdem;
    if (!dados.ordenarPor)
      delete dados.ordenarPor;
    
    const qtdeCampos = Object.entries(dados).length;
    //console.log(dados);
    let url = '/anuncios';
    if (apenasDoUsuario)
      url = '/meus-anuncios';
    let destino = url + (qtdeCampos == 0 ? '' : '?'+new URLSearchParams(dados));
    if (destino != urlAtual.pathname+urlAtual.search) {
      if (componenteExiste)
        definirAguardando(true);
      //carregarPesquisa(dados);
      carregarPesquisa(destino);
    }
  }

  //function carregarPesquisa(dados) {
  //  let url = '/anuncios';
  //  if (apenasDoUsuario)
  //    url = '/meus-anuncios';
  //  historico.push(url+'?'+new URLSearchParams(dados));
  //}
  function carregarPesquisa(destino) {
    historico.push(destino);
  }

  function controlarValor(e,minimo,maximo,funcDefinir) {
    if (e.target.value == '')
      funcDefinir('');
    let n = parseInt(e.target.value);
    if (!isNaN(n) && n >= minimo && n <= maximo)
      funcDefinir(n);
    else if (n > maximo)
      funcDefinir(maximo);
    else if (n < minimo)
      funcDefinir(minimo);
  }

  function incDecValor(e,minimo,maximo,funcDefinir) {
    if (e.key != 'ArrowUp' && e.key != 'ArrowDown')
      return;
    let n = parseInt(e.target.value);
    if (e.target.value == '')
      funcDefinir(minimo);
    else if (e.key == 'ArrowUp' && n < maximo)
      funcDefinir(n+1);
    else if (e.key == 'ArrowDown' && n > minimo)
      funcDefinir(n-1);
  }

  return (
    <div className='flex flexColumn'>
      <h2>Pesquise anúncios</h2>
      <form id='pesquisa' className='flex flexColumn fundoSemitransparente' onSubmit={e=>pesquisar(e)}>

        <div className='jogosPagina formularioDePesquisa'>
          {/*<div className='flex flexColumn'>
            <label>Jogo</label>
            <select disabled={!jogos} id='jogo' name='jogo'>
              <option value=''>
                {!jogos ?
                  (!erroAoObterDados ? 'Buscando jogos...' : 'Erro ao obter dados dos jogos do servidor.')
                :
                  'Qualquer um'
                }
              </option>
              {jogos && jogos.map((jogo,i)=>{
                return <option key={i} value={jogo.nomeUrl}>{jogo.nome}</option>
              })}
            </select>
          </div>

          <div className='flex flexColumn'>
            <div className='flex flexWrap'>
              <label htmlFor='nomeNoJogo'>Nome no jogo</label>
              <select id='opcoesNome' name='opcoesNome'>
                <option value=''>contém</option>
                <option value='comecaCom'>começa com</option>
                <option value='terminaCom'>termina com</option>
                <option value='exatamente'>exatamente</option>
                <option value='naoContem'>não contém</option>
              </select>
            </div>
            <input id='nomeNoJogo' name='nomeNoJogo' className='nomeNoJogo'/>
          </div>

          <div className='flex flexColumn'>
            <div className='flex flexWrap'>
              <label>Joga há quanto tempo?</label>
              <select id='opcoesTempo' name='opcoesTempo' value={opcoesTempo}
                onChange={e=>definirOpcoesTempo(e.target.value)}
              >
                <option value=''>no mínimo</option>
                <option value='noMaximo'>no máximo</option>
                <option value='entre'>entre</option>
              </select>
            </div>
            <div className='flex flexColumn'>
              <div className='flex flexWrap'>
                <input id='tempoDeJogoAnos' className='tempoDeJogo' name='tempoDeJogoAnos'
                  //type='tel' maxLength='2' pattern='\d*'
                  value={tempoDeJogoAnosState}
                  onChange={e=>{
                    if (e.target.value == '')
                      definirTempoDeJogoAnosState('');
                    const n = parseInt(e.target.value);
                    if (!isNaN(n) && n >= 0 && n <= 100)
                      definirTempoDeJogoAnosState(n);
                    else if (n > 100)
                      definirTempoDeJogoAnosState(100);
                  }}
                  onKeyDown={e=>{
                    //console.log(e.key);
                    let n = parseInt(e.target.value);
                    if (e.target.value == '')
                      n = 0;
                    if (e.key == 'ArrowUp' && n < 100)
                      definirTempoDeJogoAnosState(n+1);
                    if (e.key == 'ArrowDown'&& n > 0)
                      definirTempoDeJogoAnosState(n-1);
                  }}
                />
                <label htmlFor='tempoDeJogoAnos'>ano(s)</label>

                <input id='tempoDeJogoMeses' className='tempoDeJogo' name='tempoDeJogoMeses'
                  //type='tel' maxLength='2' pattern='\d*'
                  value={tempoDeJogoMesesState}
                  onChange={e=>{
                    if (e.target.value == '')
                      definirTempoDeJogoMesesState('');
                    const n = parseInt(e.target.value);
                    if (!isNaN(n) && n >= 0 && n <= 100)
                      definirTempoDeJogoMesesState(n);
                    else if (n > 100)
                      definirTempoDeJogoMesesState(100);
                  }}
                  onKeyDown={e=>{
                    //console.log(e.key);
                    let n = parseInt(e.target.value);
                    if (e.target.value == '')
                      n = 0;
                    if (e.key == 'ArrowUp' && n < 100)
                      definirTempoDeJogoMesesState(n+1);
                    if (e.key == 'ArrowDown'&& n > 0)
                      definirTempoDeJogoMesesState(n-1);
                  }}
                />
                <label htmlFor='tempoDeJogoMeses'>mês(es)</label>
              </div>
              {opcoesTempo == 'entre' &&
                <div className='flex flexWrap'>
                  <input id='tempoDeJogoAnos2' className='tempoDeJogo' name='tempoDeJogoAnos2'
                    //type='tel' maxLength='2' pattern='\d*'
                    value={tempoDeJogoAnos2State}
                    onChange={e=>{
                      if (e.target.value == '')
                        definirTempoDeJogoAnos2State('');
                      const n = parseInt(e.target.value);
                      if (!isNaN(n) && n >= 0 && n <= 100)
                        definirTempoDeJogoAnos2State(n);
                      else if (n > 100)
                        definirTempoDeJogoAnos2State(100);
                    }}
                    onKeyDown={e=>{
                      //console.log(e.key);
                      let n = parseInt(e.target.value);
                      if (e.target.value == '')
                        n = 0;
                      if (e.key == 'ArrowUp' && n < 100)
                        definirTempoDeJogoAnos2State(n+1);
                      if (e.key == 'ArrowDown'&& n > 0)
                        definirTempoDeJogoAnos2State(n-1);
                    }}
                  />
                  <label htmlFor='tempoDeJogoAnos2'>ano(s)</label>

                  <input id='tempoDeJogoMeses2' className='tempoDeJogo' name='tempoDeJogoMeses2'
                    //type='tel' maxLength='2' pattern='\d*'
                    value={tempoDeJogoMeses2State}
                    onChange={e=>{
                      if (e.target.value == '')
                        definirTempoDeJogoMeses2State('');
                      const n = parseInt(e.target.value);
                      if (!isNaN(n) && n >= 0 && n <= 100)
                        definirTempoDeJogoMeses2State(n);
                      else if (n > 100)
                        definirTempoDeJogoMeses2State(100);
                    }}
                    onKeyDown={e=>{
                      //console.log(e.key);
                      let n = parseInt(e.target.value);
                      if (e.target.value == '')
                        n = 0;
                      if (e.key == 'ArrowUp' && n < 100)
                        definirTempoDeJogoMeses2State(n+1);
                      if (e.key == 'ArrowDown'&& n > 0)
                        definirTempoDeJogoMeses2State(n-1);
                    }}
                  />
                  <label htmlFor='tempoDeJogoMeses2'>mês(es)</label>
                </div>
              }
            </div>
          </div>

          <div className='flex flexColumn'>
            <div className='flex flexWrap'>
              <label>Disponibilidade</label>
              <button className='carregando' type='button'
                onClick={()=>definirDiasDisponiveis(diasDisponiveis.concat(''))}
              >
                +
              </button>
              {diasDisponiveis.length > 1 &&
                <select id='opcoesDisponibilidade' name='opcoesDisponibilidade'>
                  <option value=''>Em todos</option>
                  <option value='emQualquer'>Em pelo menos um</option>
                </select>
              }
            </div>
            {diasDisponiveis.map((d,i)=>{
              let id = i == 0 ? '' : i+1;
              return (
                <div key={i} className='flex flexWrap'>
                  <select id={'quando'+id} name={'quando'+id}>
                    <option value='qualquerDia'>Qualquer dia</option>
                    <option value='todoDia'>Todo dia</option>
                    <option value='semana'>De segunda a sexta</option>
                    <option value='finsDeSemana'>Fins de semana</option>
                    {dias.map((dia,j)=>
                      <option key={j} value={dia}>{dia[0].toUpperCase()+dia.slice(1)}</option>
                    )}
                  </select>
                  <div className='flex flexWrap'>
                    <div className='flex'>
                      <label htmlFor={'de'+id}>De</label>
                      <input id={'de'+id} name={'de'+id} type='time'
                        onChange={()=>{
                          const ate = document.getElementById('ate'+id);
                          if (ate.value && ate.value <= document.getElementById('de'+id).value) {
                            //ate.style.backgroundColor = 'lightgray';
                            ate.style.cursor = 'help';
                            ate.title = 'Do dia seguinte';
                          } else {
                            //ate.style.backgroundColor = '';
                            ate.style.cursor = 'default';
                            ate.title = '';
                          }
                        }}
                      />
                    </div>
                    <div className='flex flexWrap'>
                      <label htmlFor={'ate'+id}>Até</label>
                      <input id={'ate'+id} name={'ate'+id} type='time'
                        onChange={()=>{
                          const ate = document.getElementById('ate'+id);
                          //console.log(ate.value);
                          if (ate.value && ate.value <= document.getElementById('de'+id).value) {
                            //ate.style.backgroundColor = 'lightgray';
                            ate.style.cursor = 'help';
                            ate.title = 'Do dia seguinte';
                          } else {
                            //ate.style.backgroundColor = '';
                            ate.style.cursor = 'default';
                            ate.title = '';
                          }
                        }}
                      />
                      {diasDisponiveis.length > 1 &&
                        <button className='carregando' type='button'
                          onClick={()=>{
                            for(let j=i; j < diasDisponiveis.length-1; j++){
                              let atual = j == 0 ? '' : j+1;
                              let proximo = j+2;
                              document.getElementById('quando'+atual).value =
                                document.getElementById('quando'+proximo).value;
                              document.getElementById('de'+atual).value =
                                document.getElementById('de'+proximo).value;
                              document.getElementById('ate'+atual).value =
                                document.getElementById('ate'+proximo).value;
                            }
                            definirDiasDisponiveis(diasDisponiveis.slice(1));
                          }}
                        >
                          ×
                        </button>
                      }
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className='flex flexColumn'>
            <label>Usa chat de voz</label>
            <select id='usaChatDeVoz' name='usaChatDeVoz'>
              <option value=''>Tanto faz</option>
              <option value='sim'>Sim</option>
              <option value='não'>Não</option>
            </select>
          </div>

          <div className='flex flexColumn'>
            <label htmlFor='resultadosPorPagina'>Anúncios por página</label>
            <input id='resultadosPorPagina' name='resultadosPorPagina' className='tempoDeJogo'
              //type='tel' maxLength='3' pattern='\d*' defaultValue='10'
              value={resultadosPorPaginaState}
              onChange={e=>{
                if (e.target.value == '')
                  definirResultadosPorPaginaState('');
                const n = parseInt(e.target.value);
                if (!isNaN(n) && n >= 3 && n <= 100)
                  definirResultadosPorPaginaState(n);
                else if (n > 100)
                  definirResultadosPorPaginaState(100);
                else if (n < 3)
                  definirResultadosPorPaginaState(3);
              }}
              onKeyDown={e=>{
                //console.log(e.key);
                let n = parseInt(e.target.value);
                if (e.target.value == '')
                  n = 0;
                if (e.key == 'ArrowUp' && n < 100)
                  definirResultadosPorPaginaState(n+1);
                if (e.key == 'ArrowDown'&& n > 0)
                  definirResultadosPorPaginaState(n-1);
              }}
            />
          </div>

          <div className='formularioDeEntradaSuspenso'>
            <label>Ordenar por</label>
            <select id='ordenarPor' name='ordenarPor'>
              <option value=''>Data de publicação</option>
              <option value='nomeDoJogo'>Nome do jogo</option>
              <option value='nomeNoJogo'>Nome do jogador</option>
              <option value='tempoDeJogoEmMeses'>Tempo de jogo</option>
              <option value='diasQueJoga'>Dias que joga</option>
              <option value='horaDeInicio'>Hora que começa</option>
              <option value='horaDeTermino'>Hora que termina</option>
              <option value='usaChatDeVoz'>Chat de voz</option>
            </select>
            <label>Em ordem</label>
            <select id='emOrdem' name='emOrdem'>
              <option value=''>Decrescente</option>
              <option value='crescente'>Crescente</option>
            </select>
          </div>*/}

          <div className='aoLado'>
            <div className='flex'>
              <label>Jogo</label>
              <select disabled={!jogos} id='jogo' name='jogo'>
                <option value=''>
                  {!jogos ?
                    (!erroAoObterDados ? 'Buscando jogos...' : 'Erro ao obter dados dos jogos do servidor.')
                  :
                    'Qualquer um'
                  }
                </option>
                {jogos && jogos.map((jogo,i)=>{
                  return <option key={i} value={jogo.nomeUrl}>{jogo.nome}</option>
                })}
              </select>
            </div>

            <div className='aoLado formularioDePesquisa'>
              <div className='flex'>
                <label htmlFor='nomeNoJogo'>Nome no jogo</label>
                <select id='opcoesNome' name='opcoesNome'>
                  <option value=''>contém</option>
                  <option value='comecaCom'>começa com</option>
                  <option value='terminaCom'>termina com</option>
                  <option value='exatamente'>exatamente</option>
                  <option value='naoContem'>não contém</option>
                </select>
              </div>
              <input id='nomeNoJogo' name='nomeNoJogo'/>
            </div>

            <div className='flex'>
              <label>Joga há quanto tempo?</label>
              <select id='opcoesTempo' name='opcoesTempo' value={opcoesTempo}
                onChange={e=>definirOpcoesTempo(e.target.value)}
              >
                <option value=''>no mínimo</option>
                <option value='noMaximo'>no máximo</option>
                <option value='entre'>entre</option>
              </select>
            </div>
            <div className='flex flexColumn'>
              <div className='flex'>
                <input id='tempoDeJogoAnos' className='tempoDeJogo' name='tempoDeJogoAnos'
                  value={tempoDeJogoAnosState}
                  onChange={e=>controlarValor(e,0,100,definirTempoDeJogoAnosState)}
                  onKeyDown={e=>incDecValor(e,0,100,definirTempoDeJogoAnosState)}
                />
                <label htmlFor='tempoDeJogoAnos'>ano(s)</label>

                <input id='tempoDeJogoMeses' className='tempoDeJogo' name='tempoDeJogoMeses'
                  value={tempoDeJogoMesesState}
                  onChange={e=>controlarValor(e,0,100,definirTempoDeJogoMesesState)}
                  onKeyDown={e=>incDecValor(e,0,100,definirTempoDeJogoMesesState)}
                />
                <label htmlFor='tempoDeJogoMeses'>mês(es)</label>
              </div>
              {opcoesTempo == 'entre' &&
                <div className='flex'>
                  <input id='tempoDeJogoAnos2' className='tempoDeJogo' name='tempoDeJogoAnos2'
                    value={tempoDeJogoAnos2State}
                    onChange={e=>controlarValor(e,0,100,definirTempoDeJogoAnos2State)}
                  onKeyDown={e=>incDecValor(e,0,100,definirTempoDeJogoAnos2State)}
                  />
                  <label htmlFor='tempoDeJogoAnos2'>ano(s)</label>

                  <input id='tempoDeJogoMeses2' className='tempoDeJogo' name='tempoDeJogoMeses2'
                    value={tempoDeJogoMeses2State}
                    onChange={e=>controlarValor(e,0,100,definirTempoDeJogoMeses2State)}
                    onKeyDown={e=>incDecValor(e,0,100,definirTempoDeJogoMeses2State)}
                  />
                  <label htmlFor='tempoDeJogoMeses2'>mês(es)</label>
                </div>
              }
            </div>

            <div className='flex flexColumn'>
            <div className='flex'>
              <label>Disponibilidade</label>
              <button className='carregando botaoMais' type='button'
                onClick={()=>definirDiasDisponiveis(diasDisponiveis.concat(''))}
              >
                +
              </button>
            </div>
              {diasDisponiveis.length > 1 &&
                <select id='opcoesDisponibilidade' name='opcoesDisponibilidade'>
                  <option value=''>Em todos</option>
                  <option value='emQualquer'>Em pelo menos um</option>
                </select>
              }
            </div>
            <div className='flex flexColumn'>
              {diasDisponiveis.map((d,i)=>{
                let id = i == 0 ? '' : i+1;
                return (
                  <div key={i} className='aoLado'>
                    <div className='flex'>
                      <select id={'quando'+id} name={'quando'+id}>
                        <option value='qualquerDia'>Qualquer dia</option>
                        <option value='todoDia'>Todo dia</option>
                        <option value='semana'>De segunda a sexta</option>
                        <option value='finsDeSemana'>Fins de semana</option>
                        {dias.map((dia,j)=>
                          <option key={j} value={dia}>{dia[0].toUpperCase()+dia.slice(1)}</option>
                        )}
                      </select>
                    </div>
                    <div className='flex flexWrap'>
                      <div className='flex'>
                        <label htmlFor={'de'+id}>De</label>
                        <input id={'de'+id} name={'de'+id} type='time'
                          onChange={()=>{
                            const ate = document.getElementById('ate'+id);
                            if (ate.value && ate.value <= document.getElementById('de'+id).value) {
                              //ate.style.backgroundColor = 'lightgray';
                              ate.style.cursor = 'help';
                              ate.title = 'Do dia seguinte';
                            } else {
                              //ate.style.backgroundColor = '';
                              ate.style.cursor = 'default';
                              ate.title = '';
                            }
                          }}
                        />
                      </div>
                      <div className='flex'>
                        <label htmlFor={'ate'+id}>Até</label>
                        <input id={'ate'+id} name={'ate'+id} type='time'
                          onChange={()=>{
                            const ate = document.getElementById('ate'+id);
                            //console.log(ate.value);
                            if (ate.value && ate.value <= document.getElementById('de'+id).value) {
                              //ate.style.backgroundColor = 'lightgray';
                              ate.style.cursor = 'help';
                              ate.title = 'Do dia seguinte';
                            } else {
                              //ate.style.backgroundColor = '';
                              ate.style.cursor = 'default';
                              ate.title = '';
                            }
                          }}
                        />
                      </div>
                        {diasDisponiveis.length > 1 ?
                          <button className='carregando' type='button'
                            onClick={()=>{
                              for(let j=i; j < diasDisponiveis.length-1; j++){
                                let atual = j == 0 ? '' : j+1;
                                let proximo = j+2;
                                document.getElementById('quando'+atual).value =
                                  document.getElementById('quando'+proximo).value;
                                document.getElementById('de'+atual).value =
                                  document.getElementById('de'+proximo).value;
                                document.getElementById('ate'+atual).value =
                                  document.getElementById('ate'+proximo).value;
                              }
                              definirDiasDisponiveis(diasDisponiveis.slice(1));
                            }}
                          >
                            ×
                          </button>
                        :
                          <div className='carregando'/>
                        }
                      {/*</div>*/}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className='flex'>
              <label>Usa chat de voz</label>
              <select id='usaChatDeVoz' name='usaChatDeVoz'>
                <option value=''>Tanto faz</option>
                <option value='sim'>Sim</option>
                <option value='não'>Não</option>
              </select>
            </div>

            <div className='flex'>
              <label htmlFor='resultadosPorPagina'>Anúncios por página</label>
              <input id='resultadosPorPagina' name='resultadosPorPagina' className='tempoDeJogo'
                value={resultadosPorPaginaState}
                onChange={e=>controlarValor(e,3,100,definirResultadosPorPaginaState)}
                onKeyDown={e=>incDecValor(e,3,100,definirResultadosPorPaginaState)}
              />
            </div>

            <div className='flex'>
              <label>Ordenar por</label>
              <select id='ordenarPor' name='ordenarPor'>
                <option value=''>Data de publicação</option>
                <option value='nomeDoJogo'>Nome do jogo</option>
                <option value='nomeNoJogo'>Nome do jogador</option>
                <option value='tempoDeJogoEmMeses'>Tempo de jogo</option>
                <option value='diasQueJoga'>Dias que joga</option>
                <option value='horaDeInicio'>Hora que começa</option>
                <option value='horaDeTermino'>Hora que termina</option>
                <option value='usaChatDeVoz'>Chat de voz</option>
              </select>
            </div>
            <div className='flex'>
              <label>Em ordem</label>
              <select id='emOrdem' name='emOrdem'>
                <option value=''>Decrescente</option>
                <option value='crescente'>Crescente</option>
              </select>
            </div>
          </div>

        </div>

        <div className='botoes'>
          <button type='reset' className='botaoPublicarAnuncio' onClick={()=>{
              definirOpcoesTempo('');
              definirDiasDisponiveis(['']);
              definirResultadosPorPaginaState(10);
              definirTempoDeJogoAnosState('');
              definirTempoDeJogoAnos2State('');
              definirTempoDeJogoMesesState('');
              definirTempoDeJogoMeses2State('');
            }}
          >
            Limpar
          </button>
          <button type='submit' className='botaoPublicarAnuncio' disabled={erroAoObterDados}
          //onClick={()=>definirAguardando(true)}
          >
            {!aguardando ? 'Pesquisar' : <img className='carregando' src={carregando}/>}
          </button>
        </div>

      </form>
    </div>
  )
}