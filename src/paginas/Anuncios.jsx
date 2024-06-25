import React, { useEffect } from 'react'
//import { useLocation } from 'react-router-dom';
//import FormularioDePesquisa from '../componentes/FormularioDePesquisa';
//import ResultadosDaPesquisa from '../componentes/ResultadosDaPesquisa';
//import BotaoParaPublicarAnuncio from '../componentes/BotaoParaPublicarAnuncio';
//import { SERVIDOR } from '../../enderecoDoServidor';
import PesquisaDeAnuncios from '../componentes/PesquisaDeAnuncios';

export default function Anuncios() {
  let componenteExiste = true;
  //const [jogos, definirJogos] = useState();
  //const urlAtual = useLocation();
  //const urlParams = new URLSearchParams(urlAtual.search);
  //const [filtros, definirFiltros] = useState();

  useEffect(()=>{
    document.title = 'Anúncios - NLW eSports';

    return ()=>componenteExiste = false;
  }, [])
/*
  useEffect(()=>{
    const dados = {};
    if (urlParams.get('jogo'))
      dados.jogo = urlParams.get('jogo');
    if (urlParams.get('nomeNoJogo'))
      dados.nomeNoJogo = urlParams.get('nomeNoJogo');
    if (urlParams.get('opcoesNome'))
      dados.opcoesNome = urlParams.get('opcoesNome');
    if (urlParams.get('opcoesTempo'))
      dados.opcoesTempo = urlParams.get('opcoesTempo');
    if (urlParams.get('tempoDeJogoAnos'))
      dados.tempoDeJogoAnos = urlParams.get('tempoDeJogoAnos');
    if (urlParams.get('tempoDeJogoMeses'))
      dados.tempoDeJogoMeses = urlParams.get('tempoDeJogoMeses');
    if (dados.opcoesTempo == 'entre') {
      if (urlParams.get('tempoDeJogoAnos2'))
        dados.tempoDeJogoAnos2 = urlParams.get('tempoDeJogoAnos2');
      if (urlParams.get('tempoDeJogoMeses2'))
        dados.tempoDeJogoMeses2 = urlParams.get('tempoDeJogoMeses2');
    }
    if (urlParams.get('quando'))
      dados.quando = urlParams.get('quando');
    if (urlParams.get('de'))
      dados.de = urlParams.get('de');
    if (urlParams.get('ate'))
      dados.ate = urlParams.get('ate');
    let l = 2;
    while (urlParams.get('quando'+l) || urlParams.get('de'+l) || urlParams.get('ate'+l)) {
      if (urlParams.get('quando'+l))
        dados['quando'+l] = urlParams.get('quando'+l);
      if (urlParams.get('de'+l))
        dados['de'+l] = urlParams.get('de'+l);
      if (urlParams.get('ate'+l))
        dados['ate'+l] = urlParams.get('ate'+l);
      l++;
    }
    l--;
    if (l > 1 && urlParams.get('opcoesDisponibilidade'))
      dados.opcoesDisponibilidade = urlParams.get('opcoesDisponibilidade');
    dados.qtdeFiltrosDisponibilidade = 0;
    if (dados.quando || dados.de || dados.ate)
      dados.qtdeFiltrosDisponibilidade = l;
    if (urlParams.get('usaChatDeVoz'))
      dados.usaChatDeVoz = urlParams.get('usaChatDeVoz');
    if (urlParams.get('resultadosPorPagina'))
      dados.resultadosPorPagina = urlParams.get('resultadosPorPagina');
    if (urlParams.get('pagina'))
      dados.pagina = urlParams.get('pagina');
    if (urlParams.get('emOrdem'))
      dados.emOrdem = urlParams.get('emOrdem');
    if (urlParams.get('ordenarPor'))
      dados.ordenarPor = urlParams.get('ordenarPor');

    fetch(SERVIDOR+`/jogos`)
    .then(resp=>resp.json())
    .then(resp=>{
      if (resp.erro)
        throw resp.erro;
      //dados.jogos = resp;
      definirJogos(resp);
    })
    .catch(erro=>{
      console.log(erro);
    })
    .finally(()=>{
      if (componenteExiste)
        definirFiltros(dados);
    });
  
    //console.log(dados);
    //if (componenteExiste)
    //  definirFiltros(dados);
  }, [urlAtual])*/

  return (
    <div className='conteudo'>
      <PesquisaDeAnuncios/>
      {/*{filtros &&
        <>
        <BotaoParaPublicarAnuncio/>
        <FormularioDePesquisa filtros={filtros} listaDeJogos={jogos}/>
        <ResultadosDaPesquisa filtros={filtros}/>
        </>
      }*/}
    </div>
  )
}