import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { contexto } from '../App';
import lupa from '../imagens/magnifying-glass-plus-reverse.svg'

export default function BotaoParaPublicarAnuncio() {
  const contexto2 = useContext(contexto);

  return (
    <Link to={contexto2.usuarioLogado ? '/novo-anuncio' : '/entrar?redir=novo-anuncio'}
      className={`botaoAbrirModalPraPublicar botao ${contexto2.usuarioLogado ? 'semShrink' : ''}`}
    >
      <img className='lupa' src={lupa}/>
      <span>{contexto2.usuarioLogado ? 'Publicar anúncio' : 'Entre para publicar um anúncio'}</span>
    </Link>
  )
}