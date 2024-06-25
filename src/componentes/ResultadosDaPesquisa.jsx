import React, { useEffect, useState, useContext } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { contexto } from '../App';
import CartaoDeAnuncio from './CartaoDeAnuncio';
import carregando from '../imagens/loading.svg'
import ModalConectar from './ModalConectar';
import { SERVIDOR } from '../../enderecoDoServidor';

export default function ResultadosDaPesquisa({filtros, apenasDoUsuario}) {
  let componenteExiste = true;
  const contexto2 = useContext(contexto);
  const [erroAoObterDados, definirErroAoObterDados] = useState(false);
  //const [paginas, definirPaginas] = useState(['']);
  const [paginaAtual, definirPaginaAtual] = useState(1);
  const [anuncios, definirAnuncios] = useState();
  const [resultadosPorPagina, definirResultadosPorPagina] = useState(10);
  //const [ordenarPor, definirOrdenarPor] = useState('');
  //const [emOrdem, definirEmOrdem] = useState('');
  //const [anunciosPorPagina, definirAnunciosPorPagina] = useState();
  const [discord, definirDiscord] = useState('');
  //const historico = useHistory();
  const urlAtual = useLocation();
  const [botoesDeExcluirDesabilitados, definirBotoesDeExcluirDesabilitados] = useState(false);
  const [paginacao, definirPaginacao] = useState(['1']);
  const [totalDeAnuncios, definirTotalDeAnuncios] = useState();
  //const [urlAtualSemPagina, definirUrlAtualSemPagina] = useState('');
  const [enderecoAtual, definirEnderecoAtual] = useState('');
  const [searchDoEnderecoAtual, definirSearchDoEnderecoAtual] = useState('');
  const [posicaoScroll, definirPosicaoScroll] = useState(0);
  //const [aguardando, definirAguardando] = useState(true);
  const [qtdeDeFiltros, definirQtdeDeFiltros] = useState(0);
  const [tempoDePesquisa, definirTempoDePesquisa] = useState(0);

  useEffect(()=>{
    //const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    //este componente está presente em duas páginas, uma delas pública, por isso a condição é diferente:
    //if (!tokenDaSessao && contexto2.usuarioLogado) {
    //  document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //  contexto2.definirUsuarioLogado();
    //  if (urlAtual.pathname == '/meus-anuncios')
    //    historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
    //  else
    //    historico.push(urlAtual.pathname);
    //  return;
    //}
    //const tokenDaSessao = contexto2.autenticarSessao();
    //tokenDaSessao.then(resp=>{
    //  //console.log('/resultadosDaPesquisa, token='+resp);
    //  //console.log(resp);
    //  if (!resp && contexto2.usuarioLogado) {
    //    document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //    contexto2.definirUsuarioLogado();
    //    //console.log('redirecionou');
    //    if (urlAtual.pathname == '/meus-anuncios')
    //      historico.push('/entrar?redir=meus-anuncios');
    //    else
    //      historico.push(urlAtual.pathname);
    //  }
    //});
    function obterScrollLimite() {
      if (componenteExiste) {
        let offset = document.getElementById('barraSuperior').offsetHeight + (
          document.getElementById('resultadosDaPesquisa')
          ? document.getElementById('resultadosDaPesquisa').offsetTop
          : 0
        );
        definirPosicaoScroll(Math.min(window.scrollY,offset));
      }
    };
    // document.body.onscroll = ()=>definirPosicaoScroll(Math.min(
    //   window.scrollY,
    //   document.getElementById('resultadosDaPesquisa').offsetTop
    //   + document.getElementById('barraSuperior').offsetHeight
    // ));
    document.addEventListener('scroll',obterScrollLimite);
    // document.addEventListener('scroll',()=>definirPosicaoScroll(Math.min(
    //   window.scrollY,
    //   document.getElementById('resultadosDaPesquisa').offsetTop
    //   + document.getElementById('barraSuperior').offsetHeight
    // )));
    // console.log(document.onscroll);

    return ()=>{
    // console.log(document.onscroll);
      // document.removeEventListener('scroll',ss);
      document.onscroll = '';
      // document.body.scroll = undefined;
      componenteExiste = false;
    }
  }, [])

  useEffect(()=>{
    definirAnuncios();
  }, [urlAtual])

  useEffect(()=>{
		const tempoInicio = Date.now();
    const dados = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    };
    if (apenasDoUsuario)
      dados.headers = {
        'Content-Type': 'application/json',
        'Authorization': contexto2.getCookie('tokenDaSessao')
      };
    //console.log(filtros);
    //console.log(dados.body);
    const params = new URLSearchParams(filtros);
    const querystring = '?' + params.toString();
    //const objString = '?' + new URLSearchParams(dados.body).toString();
    //console.log(objString);
    params.delete('pagina');
    params.delete('qtdeFiltrosDisponibilidade');
    let size = 0;
    for (const k in filtros) {
      //console.log(k);
      if (k != 'pagina' && k != 'qtdeFiltrosDisponibilidade')
        size++;
    }
    //definirQtdeDeFiltros(params.size);
    definirQtdeDeFiltros(size);

    let url = apenasDoUsuario ? '/meus-anuncios' : '/anuncios';
    let rota = apenasDoUsuario ? ('/usuarios/'+contexto2.usuarioLogado.id+'/anuncios') : url;
    //if (apenasDoUsuario){
    //  url = '/meus-anuncios';
    //  rota = '/usuarios/'+contexto2.usuarioLogado.id+'/anuncios';
    //}
    //const urlSemPagina = url + (params.size > 0 ? '?'+params.toString() : '');
    //definirUrlAtualSemPagina(urlSemPagina);
    definirEnderecoAtual(url);
    //definirSearchDoEnderecoAtual(params.size > 0 ? '?'+params.toString() : '');
    definirSearchDoEnderecoAtual(size > 0 ? '?'+params.toString() : '');
    //console.log(urlSemPagina);
    //if (params.has('pagina'))
    //  definirPaginaAtual(parseInt(params.get('pagina')));

    fetch(SERVIDOR+rota+querystring, dados)
    .then(resp=>resp.json())
    .then(resp=>{
      if (resp.erro)
        throw resp.erro;
      if (componenteExiste) {
        definirErroAoObterDados(false);
        definirAnuncios(resp.anuncios);
        definirResultadosPorPagina(resp.resultadosPorPagina);
        definirTotalDeAnuncios(resp.totalDeAnuncios);
        definirPaginaAtual(resp.pagina);
        const paginac = [];
        //for (let i = 0; i < resp.totalDePaginas; i++) {
        //  pagin.push(i+1);
        //}
        paginac.push(1);
        if (resp.totalDePaginas > 1) {
          //let inicial = resp.pagina >= 4 ? resp.pagina-2 : 1;
          let inicial = resp.pagina <= 3 ? 1 :
            (resp.pagina >= resp.totalDePaginas-2 ? resp.totalDePaginas-4 : resp.pagina-2);
          
          if (resp.totalDePaginas >= 7) {
            if (inicial == 3)
              paginac.push(2);
            else if (inicial >= 4)
              paginac.push('~');
          }

          for (let i = (inicial > 1 ? inicial : 2); i < inicial+5 && i < resp.totalDePaginas; i++) {
            //if(i == resp.totalDePaginas)
            //  break;
            paginac.push(i);
          }
          
          if (resp.totalDePaginas >= 7) {
            if(inicial == resp.totalDePaginas-6)
              paginac.push(resp.totalDePaginas-1);
            else if(inicial <= resp.totalDePaginas-7)
              paginac.push('~');
          }
          
          paginac.push(resp.totalDePaginas);
        }
        definirPaginacao(paginac);
        //definirAguardando(false);
        
        // if (filtros.resultadosPorPagina && !isNaN(filtros.resultadosPorPagina)
        // && filtros.resultadosPorPagina >= 3 && filtros.resultadosPorPagina <= 100)
        //   definirResultadosPorPagina(filtros.resultadosPorPagina);
        // else
        //   definirResultadosPorPagina(10);

        //if (filtros.ordenarPor) definirOrdenarPor(filtros.ordenarPor);
        //else definirOrdenarPor('');

        //if (filtros.emOrdem) definirEmOrdem(filtros.emOrdem);
        //else definirEmOrdem('');
        
        const tempoPesquisa = Date.now() - tempoInicio;
        definirTempoDePesquisa(tempoPesquisa);
        //console.log('tempoPesquisa='+tempoPesquisa);
        if(urlAtual.state && urlAtual.state.posicao){
          //console.log(urlAtual.state.posicao);
          window.scrollTo(0,urlAtual.state.posicao);
        }
      }
    })
    .catch(erro=>{
      console.log(erro);
      if (componenteExiste) {
        definirErroAoObterDados(true);
        //definirAguardando(false);
      }
    });
  //}, [urlAtual,filtros])
  }, [filtros])

  //useEffect(()=>{
  //  if (!anuncios)
  //    return;
  //  document.getElementById('resultadosPorPagina2').value = resultadosPorPagina;
  //  const arr = [];
  //  for (let i = 0; i < anuncios.length / resultadosPorPagina; i++)
  //    arr.push('');
  //  if (componenteExiste) {
  //    definirPaginas(arr);
  //    definirPaginaAtual(1);
  //  }
  //}, [anuncios,resultadosPorPagina])

  //useEffect(()=>{
  //  if (!anuncios)
  //    return;
  //  if (componenteExiste)
  //    definirAnunciosPorPagina(
  //      anuncios.slice((paginaAtual-1)*resultadosPorPagina,paginaAtual*resultadosPorPagina)
  //    );
  //}, [paginas,paginaAtual])

  //useEffect(()=>{
  //  if (!anuncios)
  //    return;
  //  let criterio = ordenarPor;
  //  //console.log(criterio);
  //  let ordem = 1;
  //  if (!criterio)
  //    criterio = 'dataDeCriacao';
  //  if(!emOrdem)
  //    ordem = -1;
  //  const a = [...anuncios.sort((a,b)=>{
  //    //console.log(a[criterio]);
  //    //console.log(b[criterio]);
  //    let x = a[criterio];
  //    let y = b[criterio];
  //    if (typeof a[criterio] == 'string') {
  //      x = x.toLowerCase();
  //      y = y.toLowerCase();
  //    }
  //    if (x < y) return -1*ordem;
  //    if (x > y) return 1*ordem;
  //    return 0;
  //  })];
  //  if (componenteExiste)
  //    definirAnuncios(a);
  //}, [ordenarPor,emOrdem])

  function obterDiscord(idDoAnuncio) {
    const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    if (!tokenDaSessao || !contexto2.usuarioLogado) {
      alert('É preciso entrar com uma conta para conectar-se ao jogador.');
      return;
    }
    //const tokenDaSessao = contexto2.autenticarSessao();
    //tokenDaSessao.then(resp=>{
    //  //console.log('/resultadosDaPesquisa, token='+resp);
    //  //console.log(resp);
    //  if (!resp || !contexto2.usuarioLogado) {
    //    document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //    alert('É preciso entrar com uma conta para conectar-se ao jogador.');
    //  } else {
        const dados = {
          method: 'GET',
          headers: {'Authorization': tokenDaSessao},
        };
        fetch(SERVIDOR+`/anuncios/${idDoAnuncio}/discord`, dados)
        .then(resp=>resp.json())
        .then(resp=>{
          if (resp.erro)
            throw resp.erro;
          if (componenteExiste) {
            //definirErroAoObterDados(false);
            definirDiscord(resp.discord);
          }
        })
        .catch(erro=>{
          console.log(erro);
          //if (componenteExiste)
          //  definirErroAoObterDados(true);
          //if (erro.codigo == 401)
          //  alert('É preciso entrar com uma conta para conectar-se ao jogador.');
          //else
            alert('Erro ao conectar-se ao jogador. Verifique o console de seu navegador para mais detalhes.');
        });
    //  }
    //});
  }

  return (
    <div id='resultadosDaPesquisa' className='resultadosDaPesquisa flex flexColumn'>
      {!anuncios &&
        (!erroAoObterDados ?
          <img className='carregando' src={carregando}/>
        :
          <p>Erro ao obter dados dos anúncios do servidor.</p>
        )
      }
      {/*{aguardando ?
        <img className='carregando' src={carregando}/>
      :
        <>
        
        </>
      }*/}
      {anuncios &&
      <>
      <div className='flex cabecalho fundoSemitransparente'>
        {/*implementar nova paginação aki*/}
        <div>
          <h2>
            {totalDeAnuncios > 1 ?
              totalDeAnuncios + ' anúncios encontrados.'
            :
              (totalDeAnuncios > 0 ? totalDeAnuncios : 'Nenhum') + ' anúncio encontrado.'
            }
          </h2>
          {paginacao.length > 1 &&
            <p>
              {
                'Exibindo '
                +(anuncios.length > 1 ? 'do '+((paginaAtual-1)*resultadosPorPagina + 1)+'º ao ' : '')
                +((paginaAtual-1)*resultadosPorPagina + anuncios.length)+'º resultado:'
              }
            </p>
          }
        </div>
        
        <div className='paginas'>
        {paginacao.length > 1 &&
          //<div className='flex flexWrap paginas'>
          <div className='flex'>
            {/*<Link to={urlAtualSemPagina}>«</Link>*/}
            {/*<label className={paginaAtual > 1 ? 'linkDePagina' : ''}
              onClick={paginaAtual > 1 ? ()=>{definirPaginaAtual(1)} : undefined}
            >
              «
            </label>*/}
            {paginaAtual == 1
            ?
              <label>‹</label>
            :
              <Link to={{
                  pathname: enderecoAtual,
                  search: searchDoEnderecoAtual
                    + (paginaAtual > 2 ? ((qtdeDeFiltros > 0 ? '&' : '?')+'pagina='+(paginaAtual-1)) : ''),
                  state: {posicao: posicaoScroll}
                }}
                //to={
                //  urlAtualSemPagina
                //  + (paginaAtual > 2 ? ((qtdeDeFiltros > 0 ? '&' : '?')+'pagina='+(paginaAtual-1)) : '')
                //}
              >
                ‹
              </Link>
            }
            {/*<label className={paginaAtual > 1 ? 'linkDePagina' : ''}
              onClick={paginaAtual > 1 ? ()=>{definirPaginaAtual(paginaAtual-1)} : undefined}
            >
              ‹
            </label>*/}
            {paginacao.map((p,i)=>
              paginaAtual == p
              ?
                <strong key={i}>{p}</strong>
              :
                isNaN(p)
                ?
                  <p key={i}>{p}</p>
                :
                  <Link key={i} to={{
                    pathname: enderecoAtual,
                    search: searchDoEnderecoAtual
                      + (i > 0 ? ((qtdeDeFiltros > 0 ? '&' : '?')+'pagina='+p) : ''),
                    state: {posicao: posicaoScroll}
                  }}
                    //to={
                    //  urlAtualSemPagina + (i > 0 ? ((qtdeDeFiltros > 0 ? '&' : '?')+'pagina='+p) : '')
                    //}
                  >
                    {p}
                  </Link>
              //<label key={i} className={i+1 == paginaAtual ? 'paginaAtual' : 'linkDePagina'}
              //  onClick={paginaAtual != i+1 ? ()=>definirPaginaAtual(i+1) : undefined}
              //>
              //  {i+1}
              //</label>
            )}
            {paginaAtual == paginacao[paginacao.length-1]
            ?
              <label>›</label>
            :
              <Link to={{
                pathname: enderecoAtual,
                search: searchDoEnderecoAtual
                  + (qtdeDeFiltros > 0 ? '&' : '?') + 'pagina=' + (paginaAtual+1),
                state: {posicao: posicaoScroll}
              }}
                //to={
                //  urlAtualSemPagina
                //  + (qtdeDeFiltros > 0 ? '&' : '?') + 'pagina=' + (paginaAtual+1)
                //}
              >
                ›
              </Link>
            }
            {/*<label className={paginaAtual < paginas.length ? 'linkDePagina' : ''}
              onClick={paginaAtual < paginas.length ? ()=>{definirPaginaAtual(paginaAtual+1)} : undefined}
            >
              ›
            </label>*/}
            {/*<label className={paginaAtual < paginas.length ? 'linkDePagina' : ''}
              onClick={paginaAtual < paginas.length ? ()=>{definirPaginaAtual(paginas.length)} : undefined}
            >
              »
            </label>*/}
          </div>
        }
        <p>({tempoDePesquisa/1000} segundos)</p>
        </div>
        {/*<div>
          {anuncios && (anuncios.length == 0 ?
            <h2>Nenhum anúncio encontrado.</h2>
          :
            <h2>
              {anuncios.length} anúncio{anuncios.length > 1 ? 's' : ''}
              encontrado{anuncios.length > 1 ? 's' : ''}.
            </h2>
          )}
          {anunciosPorPagina && paginas && paginas.length > 1 &&
            <p>
              {
                'Exibindo '
                +(anunciosPorPagina.length > 1 ? 'do '+((paginaAtual-1)*resultadosPorPagina + 1)+'º ao ' : '')
                +((paginaAtual-1)*resultadosPorPagina + anunciosPorPagina.length)+'º resultado:'
              }
            </p>
          }
        </div>*/}
        {/*<div className='flex flexColumn'>
          <div className='flex flexWrap opcoesDePagina'>
            <div className='flex'>
              <label htmlFor='resultadosPorPagina2'>Resultados por página</label>
              <input  id='resultadosPorPagina2' type='tel' maxLength='3' size='1' pattern='\d+' required
                defaultValue={resultadosPorPagina}
                onBlur={e=>{
                  let n = e.target.value;
                  if (n > 0 && componenteExiste)
                    definirResultadosPorPagina(n);
                  else
                    e.target.value = resultadosPorPagina;
                }}
                onKeyDown={e=>{
                  if (e.repeat)
                    return;
                  if (e.key == 'Enter') {
                    let n = e.target.value;
                    if (n > 0 && componenteExiste)
                      definirResultadosPorPagina(n);
                    else
                      e.target.value = resultadosPorPagina;
                  }
                }}
              />
            </div>

            <div className='flex flexWrap'>
              <label className={paginaAtual > 1 ? 'linkDePagina' : ''}
                onClick={paginaAtual > 1 ? ()=>{definirPaginaAtual(1)} : undefined}
              >
                «
              </label>
              <label className={paginaAtual > 1 ? 'linkDePagina' : ''}
                onClick={paginaAtual > 1 ? ()=>{definirPaginaAtual(paginaAtual-1)} : undefined}
              >
                ‹
              </label>
              {paginas.map((p,i)=>
                <label key={i} className={i+1 == paginaAtual ? 'paginaAtual' : 'linkDePagina'}
                  onClick={paginaAtual != i+1 ? ()=>definirPaginaAtual(i+1) : undefined}
                >
                  {i+1}
                </label>
              )}
              <label className={paginaAtual < paginas.length ? 'linkDePagina' : ''}
                onClick={paginaAtual < paginas.length ? ()=>{definirPaginaAtual(paginaAtual+1)} : undefined}
              >
                ›
              </label>
              <label className={paginaAtual < paginas.length ? 'linkDePagina' : ''}
                onClick={paginaAtual < paginas.length ? ()=>{definirPaginaAtual(paginas.length)} : undefined}
              >
                »
              </label>
            </div>
          </div>

          <div className='flex flexWrap opcoesDePagina'>
            <label>Ordenar por</label>
            <select value={ordenarPor} onChange={e=>definirOrdenarPor(e.target.value)}>
              <option value=''>Data de publicação</option>
              <option value='nomeDoJogo'>Nome do jogo</option>
              <option value='nomeNoJogo'>Nome do jogador</option>
              <option value='tempoDeJogoEmMeses'>Tempo de jogo</option>
              <option value='diasQueJoga'>Dia que joga</option>
              <option value='deHora'>Hora que começa</option>
              <option value='ateHora'>Hora que termina</option>
              <option value='usaChatDeVoz'>Chat de voz</option>
            </select>
            <select value={emOrdem} onChange={e=>definirEmOrdem(e.target.value)}>
              <option value=''>Decrescente</option>
              <option value='crescente'>Crescente</option>
            </select>
          </div>
        </div>*/}
      </div>

      <div className='jogosPagina'>
        {/*{anuncios &&*/}
          {anuncios.map((anuncio,i)=>
            <CartaoDeAnuncio
              key={anuncio.idDoAnuncio}
              nomeDoJogo={anuncio.nomeDoJogo}
              anuncio={anuncio}
              funcConectar={()=>obterDiscord(anuncio.idDoAnuncio)}
              funcExcluirAnuncio={()=>{
                if (componenteExiste)
                  //definirAnuncioPraExcluir(anuncio.id);
                  //definirIdDoAnuncioPraExcluir(anuncio.id);
                  definirAnuncios(anuncios.filter(an=>an.idDoAnuncio != anuncio.idDoAnuncio));
              }}
              excluindo={botoesDeExcluirDesabilitados}
              definirExcluindo={definirBotoesDeExcluirDesabilitados}
            />
          )}
        {/*{anunciosPorPagina &&
          anunciosPorPagina.map((anuncio,i)=>
            <CartaoDeAnuncio
              key={anuncio.idDoAnuncio}
              nomeDoJogo={anuncio.nomeDoJogo}
              anuncio={anuncio}
              funcConectar={()=>obterDiscord(anuncio.idDoAnuncio)}
              funcExcluirAnuncio={()=>{
                if (componenteExiste)
                  //definirAnuncioPraExcluir(anuncio.id);
                  //definirIdDoAnuncioPraExcluir(anuncio.id);
                  definirAnuncios(anuncios.filter(an=>an.idDoAnuncio != anuncio.idDoAnuncio));
              }}
              excluindo={botoesDeExcluirDesabilitados}
              definirExcluindo={definirBotoesDeExcluirDesabilitados}
            />
          )
        }*/}
        {discord && <ModalConectar discord={discord} funcFechar={()=>definirDiscord('')}/>}
      </div>
      </>
      }
    </div>
  )
}