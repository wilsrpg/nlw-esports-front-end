import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../imagens/NLW-eSports-Logo.svg'
import carregando from '../imagens/loading.svg'
import CartaoDeJogo from '../componentes/CartaoDeJogo'
//import lupa from '../imagens/magnifying-glass-plus-reverse.svg'
import setaDupla from '../imagens/caret-double-right.svg'
import ModalParaCriarAnuncio from '../componentes/ModalParaCriarAnuncio';
import ModalDeJogoSelecionado from '../componentes/ModalDeJogoSelecionado'
import { SERVIDOR } from '../../enderecoDoServidor';
import { contexto } from '../App'
import BotaoParaPublicarAnuncio from '../componentes/BotaoParaPublicarAnuncio'

export default function App() {
  let componenteExiste = true;
  const contexto2 = useContext(contexto);
  const [erroAoObterDados, definirErroAoObterDados] = useState(false);
  const [recarregarJogos, definirRecarregarJogos] = useState(false);
  const [jogos, definirJogos] = useState();
  const [exibindoModalParaCriarAnuncio, definirExibindoModalParaCriarAnuncio] = useState(false);
  const [jogoProModalDeAnuncios, definirJogoProModalDeAnuncios] = useState('');

  useEffect(()=>{
    document.title = 'NLW eSports';
    //const dados = {
    //  method: 'POST',
    //  headers: {'Content-Type': 'application/json'},
    //  body: JSON.stringify({qtde: 3}),
    //};
    //fetch(SERVIDOR+`/jogos-recentes`, dados)
    //.then(resp=>resp.json())
    //.then(resp=>console.log(resp));

    return ()=>componenteExiste = false;
  }, [])

  useEffect(()=>{
    if (exibindoModalParaCriarAnuncio && !recarregarJogos || jogoProModalDeAnuncios)
      return;
    const qtdeJogosExibidos = 4;
    //const dados = {
    //  method: 'POST',
    //  headers: {'Content-Type': 'application/json'},
    //  body: JSON.stringify({qtde: qtdeJogosExibidos}),
    //};
    //fetch(SERVIDOR+`/jogos-recentes`, dados)
    //fetch(SERVIDOR+`/jogos-recentes/${qtdeJogosExibidos}`)
    fetch(SERVIDOR+`/jogos?ordenarPor=anuncio&qtde=${qtdeJogosExibidos}`)
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
    })
    .finally(()=>{
      if (componenteExiste)
        definirRecarregarJogos(false);
    });
  }, [exibindoModalParaCriarAnuncio,recarregarJogos,jogoProModalDeAnuncios])

  return (
    <>
    <div className='conteudo'>
      <img src={logo}/>
      <h1>Seu <span className='gradienteNlwGay'>duo</span> está aqui.</h1>

      <div className='jogos'>
        {!jogos ?
          (!erroAoObterDados ?
            <img className='carregando' src={carregando}/>
          :
            <p>Erro ao obter dados dos jogos do servidor.</p>
          )
        :
          (jogos.length == 0 ?
            <p>Nenhum jogo cadastrado.</p>
          :
            <>
            {jogos.map((jogo,i)=>
              <Link key={i} to={`/anuncios?jogo=${jogo.nomeUrl}`}>
                <CartaoDeJogo jogo={jogo}/>
              </Link>
            )}
            <div className='botaoIrParaJogos'>
              <Link to='/jogos'>
                <img src={setaDupla} title='Ir para página de jogos'/>
              </Link>
            </div>
            </>
          )
        }
      </div>

      <div className='caixaAtras gradienteNlwGay'>
        <div className='caixaFrente'>
          <div>
            <strong>Não encontrou seu duo?</strong>
            <p>Publique um anúncio para encontrar novos players!</p>
          </div>
          <BotaoParaPublicarAnuncio/>
          {/*<Link to={contexto2.usuarioLogado ? '/novo-anuncio' : '/entrar'}*/}
          {/*<Link to='/novo-anuncio'
            className={`botaoAbrirModalPraPublicar botao ${contexto2.usuarioLogado ? 'semShrink' : ''}`}
          >*/}
          {/*<button className='botaoAbrirModalPraPublicar'
            onClick={()=>definirExibindoModalParaCriarAnuncio(true)}
          >*/}
            {/*<img className='lupa' src={lupa}/>
            <span>{contexto2.usuarioLogado ? 'Publicar anúncio' : 'Entre para publicar um anúncio'}</span>*/}
          {/*</button>*/}
          {/*</Link>*/}
        </div>
      </div>
    </div>

    {exibindoModalParaCriarAnuncio &&
      <ModalParaCriarAnuncio
        funcRecarregarJogos={()=>definirRecarregarJogos(true)}
        funcFechar={()=>definirExibindoModalParaCriarAnuncio(false)}
      />
    }

    {jogoProModalDeAnuncios &&
      <ModalDeJogoSelecionado
        jogo={jogoProModalDeAnuncios}
        funcFechar={()=>definirJogoProModalDeAnuncios('')}
      />
    }
    </>
  )
}