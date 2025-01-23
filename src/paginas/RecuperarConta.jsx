import React, { useContext, useEffect, useState } from 'react'
// import { useHistory, useLocation } from 'react-router-dom';
import { contexto } from '../App';
import carregando from '../imagens/loading.svg'
import { SERVIDOR } from '../../enderecoDoServidor';

export default function RecuperarConta() {
  let componenteExiste = true;
  const contexto2 = useContext(contexto);
  const [aguardando, definirAguardando] = useState(false);
  const [mensagem, definirMensagem] = useState('');
  // const historico = useHistory();
  // const urlAtual = useLocation();
  // const urlParams = new URLSearchParams(urlAtual.search);

  useEffect(()=>{
    document.title = 'Recuperar conta - NLW eSports';
    
    return ()=>componenteExiste = false;
  }, [])

  function validarRecuperacao(e) {
    e.preventDefault();
    if (aguardando)
      return;
    const dados = Object.fromEntries(new FormData(e.target));
    if (!dados.email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )) {
      document.getElementById('email').focus();
      definirMensagem('Digite um e-mail válido.');
      return;
    }
    definirMensagem('');
    definirAguardando(true);
    tentarRecuperar(dados.email);
  }

  function tentarRecuperar(email) {
    const dados = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email}),
    };
    fetch(SERVIDOR+`/recuperacao-de-conta`, dados)
    .then(resp=>resp.json())
    .then(resp=>{
      if (resp.erro)
        throw resp.erro;
      alert('E-mail enviado com sucesso. O link de redefinição de senha expira em 10 minutos.');
      definirAguardando(false);
    })
    .catch(erro=>{
      console.log(erro);
      if (componenteExiste) {
        let erroString = 'Erro ao enviar e-mail. Verifique o console de seu navegador para mais detalhes.';
        if (typeof erro == 'string')
          erroString = erro;
        if (erro == 'TypeError: NetworkError when attempting to fetch resource.')
          erroString = 'Não foi possível se comunicar com o servidor.';
        definirMensagem(erroString);
        definirAguardando(false);
      }
    });
  }

  return (
    <div className='conteudo'>
      {!contexto2.usuarioLogado ?
        <>
        <h2>Recuperar conta</h2>
        <div className='comEspacoParaMensagemDeErro'>
          <form className='flex flexColumn alignCenter' onSubmit={e=>validarRecuperacao(e)}>
            <strong>Digite o e-mail da conta para enviar um link de redefinição de senha:</strong>
            <input id='email' name='email' className='emailRecuperar' autoFocus required
              onClick={()=>definirMensagem('')} onChange={()=>definirMensagem('')}
            />
            <button className='botaoEntrar alturaBase' type='submit'>
              {aguardando ? <img className='carregando' src={carregando}/> : 'Enviar'}
            </button>
            {/*<p className='mensagemDeErroCentralizada'>{mensagem}</p>*/}
          </form>
          {mensagem && <p className='mensagemDeErro'>{mensagem}</p>}
        </div>
        </>
      :
        <p>Desconecte a conta atual para continuar com a recuperação da conta.</p>
      }
    </div>
  )
}