import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { contexto } from '../App';

export default function Perfil() {
  const contexto2 = useContext(contexto);
  const {nome} = useParams();

  useEffect(()=>{
    document.title = 'Perfil de '+nome+' - NLW eSports';
  }, [])

  return (
    <div className='conteudo'>
      <h2>Perfil</h2>
      {contexto2.usuarioLogado.nome == nome ?
        <strong>Visualizando seu perfil.</strong>
      :
        <strong>Visualizando perfil de <span className='nomeDoUsuario'>{nome}</span>.</strong>
      }
    </div>
  )
}