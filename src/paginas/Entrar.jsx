import React, { useContext, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { contexto } from '../App';
import FormularioDeEntrada from '../componentes/FormularioDeEntrada';

export default function Entrar() {
  const contexto2 = useContext(contexto);
  const historico = useHistory();
  const urlParams = new URLSearchParams(useLocation().search);

  useEffect(()=>{
    document.title = 'Entrar - NLW eSports';
    if (contexto2.usuarioLogado) {
      if (urlParams.get('redir'))
        historico.push('/'+urlParams.get('redir'));
      else
        historico.push('/conta');
    }
  }, [contexto2.usuarioLogado])

  return (
    <div className='conteudo'>
    {!contexto2.usuarioLogado ?
      <FormularioDeEntrada/>
    :
      <p>Desconecte a conta atual para entrar com outra.</p>
    }
    </div>
  )
}