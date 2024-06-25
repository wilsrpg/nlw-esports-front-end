import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { contexto } from '../App';
import carregando from '../imagens/loading.svg'
import { SERVIDOR } from '../../enderecoDoServidor';

export default function RedefinirSenha() {
  let componenteExiste = true;
  const contexto2 = useContext(contexto);
  const [redefinicaoOk, definirRedefinicaoOk] = useState();
  const [aguardando, definirAguardando] = useState(false);
  const [mensagem, definirMensagem] = useState('');
  const historico = useHistory();
  const urlParams = new URLSearchParams(useLocation().search);

  useEffect(()=>{
    document.title = 'Redefinir senha - NLW eSports';
    //console.log('token='+urlParams.get('token')+'\nid='+urlParams.get('id'));
    if (!urlParams.get('token') || !urlParams.get('id'))
      definirMensagem('Página acessada sem dados de redefinição de senha.');
    else {
      fetch(SERVIDOR+`/recuperacao-de-conta/?`+urlParams.toString())
      .then(resp=>resp.json())
      .then(resp=>{
        if (resp.erro)
          throw resp.erro;
        if (componenteExiste)
          definirRedefinicaoOk(true);
      })
      .catch(erro=>{
        console.log(erro);
        if (componenteExiste) {
          definirRedefinicaoOk(false);
          definirMensagem(''+erro);
        }
      });
    }

    return ()=>componenteExiste = false;
  }, [])

  function validarRedefinicaoDeSenha(e) {
    e.preventDefault();
    if (aguardando)
      return;
    const dados = Object.fromEntries(new FormData(e.target));
    if (dados.novaSenha != dados.confirmarNovaSenha) {
      definirMensagem('As senhas digitadas não são iguais.');
      return;
    }
    definirMensagem('');
    definirAguardando(true);
    tentarRedefinir(dados.novaSenha);
  }

  function tentarRedefinir(novaSenha) {
    const dados = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token: urlParams.get('token'), idDoUsuario: urlParams.get('id'), novaSenha}),
    };
    fetch(SERVIDOR+`/redefinicao-de-senha`, dados)
    .then(resp=>resp.json())
    .then(resp=>{
      if (resp.erro)
        throw resp.erro;
      alert('Senha redefinida com sucesso. Entre com seu nome de usuário e senha para acessar o sistema.');
      historico.push('/entrar');
      //definirAguardando(false);
    })
    .catch(erro=>{
      console.log(erro);
      if (componenteExiste) {
        definirMensagem(''+erro);
        definirAguardando(false);
      }
    });
  }

  return (
    <div className='conteudo'>
      {!contexto2.usuarioLogado ?
        <>
        <h2>Redefinir senha</h2>
        <div className='comEspacoParaMensagemDeErro'>
          {redefinicaoOk &&
            <form className='flex flexColumn' onSubmit={e=>validarRedefinicaoDeSenha(e)}>
              <strong>Digite e confirme sua nova senha:</strong>
              <input id='novaSenha' name='novaSenha' type='password' placeholder='Nova senha' required
                onClick={()=>definirMensagem('')} onChange={()=>definirMensagem('')}
              />
              <input id='confirmarNovaSenha' name='confirmarNovaSenha' type='password'
                placeholder='Repita a nova senha'
                onClick={()=>definirMensagem('')} onChange={()=>definirMensagem('')} required
              />
              <button className='alturaBase' type='submit'>
                {aguardando ? <img className='carregando' src={carregando}/> : 'Redefinir'}
              </button>
            </form>
            }
          {mensagem && <p className='mensagemDeErro'>{mensagem}</p>}
        </div>
        </>
      :
        <p>Desconecte a conta atual para continuar com a redefinição de senha.</p>
      }
    </div>
  )
}