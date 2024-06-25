import React, { useEffect, useState } from 'react'
import CartaoDeAnuncio from './CartaoDeAnuncio';
import carregando from '../imagens/loading.svg'
import ModalConectar from './ModalConectar';
import iconeFechar from '../imagens/x.svg'
import { SERVIDOR } from '../../enderecoDoServidor';

export default function ModalDeJogoSelecionado({jogo, funcFechar}) {
  let componenteExiste = true;
  const [erroAoObterDados, definirErroAoObterDados] = useState(false);
  const [anuncios, definirAnuncios] = useState();
  const [discord, definirDiscord] = useState('');

  useEffect(()=>{
    fetch(SERVIDOR+`/jogos/${jogo.nomeUrl}/anuncios`)
    .then(resp=>resp.json())
    .then(resp=>{
      if (resp.erro)
        throw resp.erro;
      if (componenteExiste) {
        definirErroAoObterDados(false);
        definirAnuncios(resp);
      }
    })
    .catch(erro=>{
      console.log(erro);
      if (componenteExiste)
        definirErroAoObterDados(true);
    });

    return ()=>componenteExiste = false;
  }, [])

  useEffect(()=>{
    if (!discord)
      document.body.onkeydown = e=>fechar(e);
  }, [discord])

  function fechar(e) {
    if (e.repeat)
      return;
    if (e.key == 'Escape')
      funcFechar();
  }

  function obterDiscord(anuncioId) {
    fetch(SERVIDOR+`/anuncios/${anuncioId}/discord`)
    .then(resp=>resp.json())
    .then(resp=>{
      if (componenteExiste) {
        definirErroAoObterDados(false);
        definirDiscord(resp.discord);
      }
    })
    .catch(erro=>{
      console.log(erro);
      if (componenteExiste)
        definirErroAoObterDados(true);
    });
  }

  return (
    <div className={`modalAnuncioFora ${discord && ' semFundo'}`} onClick={funcFechar}>
      <div className='modalAnuncio' onClick={e=>e.stopPropagation()}>

        <img className='botaoCopiar botaoFechar' src={iconeFechar} onClick={funcFechar}/>
        <div className='jogoSelecionado'>
          <img className='imagemDoJogo' src={jogo.urlImagem}/>
          <div>
            <h2>{jogo.nome}</h2>
            <strong>Conecte-se e comece a jogar!</strong>
            {(anuncios && anuncios.length > 0) &&
              <p>{anuncios.length} anúncio{anuncios.length > 1 ? 's' : ''}</p>
            }
          </div>
        </div>

        <div className='anuncios'>
          {!anuncios ?
            (!erroAoObterDados ?
              <img className='carregando' src={carregando}/>
            :
              <p>Erro ao obter dados dos anúncios do servidor.</p>
            )
          :
            (anuncios.length == 0 ?
              <p>Nenhum anúncio publicado.</p>
            :
              anuncios.map((anuncio,id)=>
                <CartaoDeAnuncio
                  key={id}
                  anuncio={anuncio}
                  funcConectar={()=>obterDiscord(anuncio.id)}
                />
              )
            )
          }
        </div>

        {discord && <ModalConectar discord={discord} funcFechar={()=>definirDiscord('')}/>}

      </div>
    </div>
  )
}