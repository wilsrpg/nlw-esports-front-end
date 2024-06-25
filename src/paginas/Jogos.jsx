import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import CartaoDeJogo from '../componentes/CartaoDeJogo';
import carregando from '../imagens/loading.svg'
import { SERVIDOR } from '../../enderecoDoServidor';

export default function Jogos() {
  let componenteExiste = true;
  const [erroAoObterDados, definirErroAoObterDados] = useState(false);
  const [jogos, definirJogos] = useState();

  useEffect(()=>{
    document.title = 'Jogos - NLW eSports';
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

    return ()=>componenteExiste = false;
  }, [])

  return (
    <div className='conteudo'>
      <h2>Clique em um jogo para ver os anúncios publicados.</h2>
      <div className='jogosPagina'>
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
            jogos.map((jogo,i)=>
              <Link key={i} to={`/anuncios?jogo=${jogo.nomeUrl}`}>
                <CartaoDeJogo jogo={jogo}/>
              </Link>
            )
          )
        }
      </div>
    </div>
  )
}