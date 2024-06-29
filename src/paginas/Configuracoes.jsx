import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { contexto } from '../App';
import carregando from '../imagens/loading.svg'
import { SERVIDOR } from '../../enderecoDoServidor';
//import FormularioDeEntrada from '../componentes/FormularioDeEntrada';

export default function Configuracoes() {
  let componenteExiste = true;
  const contexto2 = useContext(contexto);
  const [aguardandoAlterarDados, definirAguardandoAlterarDados] = useState(false);
  const [mensagem, definirMensagem] = useState('');
  //const [erroAoValidar, definirErroAoValidar] = useState(false);
  const [confirmandoExclusaoDaConta, definirConfirmandoExclusaoDaConta] = useState(false);
  const [aguardandoExcluir, definirAguardandoExcluir] = useState(false);
  const [mensagemExcluir, definirMensagemExcluir] = useState('');
  const historico = useHistory();
  const urlAtual = useLocation();
  const [dadosDoUsuario, definirDadosDoUsuario] = useState('');

  useEffect(()=>{
    document.title = 'Configurações - NLW eSports';
    const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    if (!tokenDaSessao || !contexto2.usuarioLogado) {
      document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
      contexto2.definirUsuarioLogado();
      historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
      return;
    }
    //contexto2.autenticarSessao()
    //.then(resp=>{
    //  //console.log(resp);
    //  if (!resp || !contexto2.usuarioLogado) {
    //    document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //    historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
    //  }
    //});
    const dados = {
      method: 'GET',
      headers: {'Authorization': tokenDaSessao}
    };
    fetch(SERVIDOR+`/usuarios/${contexto2.usuarioLogado.id}/dados`, dados)
    .then(resp=>resp.json())
    .then(resp=>{
      if (resp.erro)
        throw resp.erro;
      if (componenteExiste)
        definirDadosDoUsuario(resp);
    })
    .catch(erro=>{
      console.log(erro);
      if (componenteExiste)
        definirMensagem(''+erro);
    });

    return ()=>componenteExiste = false;
  }, [])

  function validarAlteracaoDeDados(e) {
    e.preventDefault();
    if (aguardandoAlterarDados)
      return;
    //definirErroAoValidar(true);
    const dados = Object.fromEntries(new FormData(e.target));
    if (!dados.senhaAtual) {
      document.getElementById('senhaAtual').focus();
      definirMensagem('Digite sua senha atual.');
      return;
    }
    if (dados.email && !dados.email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )) {
      document.getElementById('email').focus();
      definirMensagem('Digite um e-mail válido.');
    }
    if (dados.novaSenha || dados.confirmarNovaSenha) {
      if (!dados.novaSenha) {
        document.getElementById('novaSenha').focus();
        definirMensagem('Digite sua nova senha.');
        return;
      }
      if (!dados.confirmarNovaSenha) {
        document.getElementById('confirmarNovaSenha').focus();
        definirMensagem('Repita sua nova senha.');
        return;
      }
      if (dados.novaSenha != dados.confirmarNovaSenha) {
        //document.getElementById('confirmarSenha').focus();
        definirMensagem('As senhas digitadas não são iguais.');
        return;
      }
      if (dados.senhaAtual == dados.novaSenha) {
        //document.getElementById('confirmarSenha').focus();
        definirMensagem('A nova senha não pode ser igual à atual.');
        return;
      }
    }
    definirMensagem('');
    definirAguardandoAlterarDados(true);
    tentarAlterarDados(dados.email, dados.senhaAtual, dados.novaSenha);
  }

  function tentarAlterarDados(email, senha, novaSenha) {
    //const tokenDaSessao = getCookie('tokenDaSessao');
    //const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    //if (!tokenDaSessao || tokenDaSessao == '0') {
    //  contexto2.definirUsuarioLogado();
    //  historico.push('/entrar');
    //  return;
    //}
    const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    if (!tokenDaSessao || !contexto2.usuarioLogado) {
      document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
      contexto2.definirUsuarioLogado();
      historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
      return;
    }
    //const tokenDaSessao = contexto2.autenticarSessao();
    //tokenDaSessao.then(resp=>{
    //  //console.log('/resultadosDaPesquisa, token='+resp);
    //  //console.log(resp);
    //  if (!resp || !contexto2.usuarioLogado) {
    //    document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //    historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
    //  } else {
        const dados = {
          method: 'PUT',
          //headers: {'Content-Type': 'application/json'},
          headers: {'Content-Type': 'application/json', 'Authorization': tokenDaSessao},
          body: JSON.stringify({email, senha, novaSenha}),
        };
        fetch(SERVIDOR+`/usuarios/${contexto2.usuarioLogado.id}`, dados)
        .then(resp=>resp.json())
        .then(resp=>{
          if (resp.erro)
            throw resp.erro;
          if (componenteExiste) {
            //definirErroAoValidar(false);
            //definirMensagem('Senha alterada com sucesso.');
            definirMensagem('');
            //if (email)
            //  document.getElementById('email').value = email;
            document.getElementById('email').value = resp.email;
            document.getElementById('senhaAtual').value = '';
            document.getElementById('novaSenha').value = '';
            document.getElementById('confirmarNovaSenha').value = '';
            alert('Dados alterados com sucesso.');
          }
        })
        .catch(erro=>{
          console.log(erro);
          if (erro.codigo == 401) { //sessão inexistente
            document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
            contexto2.definirUsuarioLogado();
            historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
            //historico.push('/entrar');
          } if (erro.codigo == 409) { //sessão diferente
            //contexto2.autenticarSessao();
            //historico.push('/conta');
            window.location.reload();
          } else if (componenteExiste)
            definirMensagem(''+erro);
        })
        .finally(()=>{
          if (componenteExiste)
            definirAguardandoAlterarDados(false);
        });
    //  }
    //});
  }

  useEffect(()=>{
    if(confirmandoExclusaoDaConta)
      document.getElementById('confirmarSenhaParaExclusaoDaConta').focus();
  }, [confirmandoExclusaoDaConta])

  function validarExclusaoDaConta() {
    const senha = document.getElementById('confirmarSenhaParaExclusaoDaConta').value;
    if (!senha) {
      definirMensagemExcluir('Digite sua senha.');
      document.getElementById('confirmarSenhaParaExclusaoDaConta').focus();
      return;
    }
    if (confirm('Excluir permanentemente esta conta? Esta ação é irreversível.')) {
      definirAguardandoExcluir(true);
      tentarExcluirConta(senha);
    }
  }

  function tentarExcluirConta(senha) {
    //const tokenDaSessao = getCookie('tokenDaSessao');
    //const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    //if (!tokenDaSessao || tokenDaSessao == '0') {
    //  contexto2.definirUsuarioLogado();
    //  historico.push('/entrar');
    //  return;
    //}
    const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    if (!tokenDaSessao || !contexto2.usuarioLogado) {
      document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
      contexto2.definirUsuarioLogado();
      historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
      return;
    }
    //const tokenDaSessao = contexto2.autenticarSessao();
    //tokenDaSessao.then(resp=>{
    //  //console.log('/resultadosDaPesquisa, token='+resp);
    //  //console.log(resp);
    //  if (!resp || !contexto2.usuarioLogado) {
    //    document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //    historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
    //  } else {
        const dados = {
          method: 'DELETE',
          //headers: {'Content-Type': 'application/json'},
          headers: {'Content-Type': 'application/json', 'Authorization': tokenDaSessao},
          body: JSON.stringify({senha}),
        };
        fetch(SERVIDOR+`/usuarios/${contexto2.usuarioLogado.id}`, dados)
        .then(resp=>resp.json())
        .then(resp=>{
          if (resp.erro)
            throw resp.erro;
          if (componenteExiste) {
            //localStorage.removeItem('usuarioLogado');
            //localStorage.removeItem('idDoUsuarioLogado');
            document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
            alert('Conta excluída.');
            contexto2.definirUsuarioLogado();
            historico.push('/entrar');
          }
        })
        .catch(erro=>{
          console.log(erro);
          if (erro.codigo == 401) { //sessão inexistente
            document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
            contexto2.definirUsuarioLogado();
            historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
            //historico.push('/entrar');
          } if (erro.codigo == 409) { //sessão diferente
            //contexto2.autenticarSessao();
            //historico.push('/conta');
            window.location.reload();
          } else {
            definirAguardandoExcluir(false);
            definirMensagemExcluir(''+erro);
          }
        });
    //  }
    //});
  }

  function desconectarOutrosDispositivos() {
    if (!confirm('Desconectar conta de todos os outros dispositivos?'))
      return;
    //const tokenDaSessao = getCookie('tokenDaSessao');
    //const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    //if (!tokenDaSessao || tokenDaSessao == '0') {
    //  contexto2.definirUsuarioLogado();
    //  historico.push('/entrar');
    //  return;
    //}
    const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    if (!tokenDaSessao || !contexto2.usuarioLogado) {
      document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
      contexto2.definirUsuarioLogado();
      historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
      return;
    }
    //const tokenDaSessao = contexto2.autenticarSessao();
    //tokenDaSessao.then(resp=>{
    //  //console.log('/resultadosDaPesquisa, token='+resp);
    //  //console.log(resp);
    //  if (!resp || !contexto2.usuarioLogado) {
    //    document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //    historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
    //  } else {
        const dados = {
          method: 'DELETE',
          //headers: {'Content-Type': 'application/json'},
          headers: {'Authorization': tokenDaSessao},
          //body: JSON.stringify({id: contexto2.usuarioLogado.id, tokenDaSessao}),
        };
        fetch(SERVIDOR+`/usuarios/${contexto2.usuarioLogado.id}/outras-sessoes`, dados)
        //fetch(SERVIDOR+`/outras-sessoes/${contexto2.usuarioLogado.id}/${tokenDaSessao}`, dados)
        .then(resp=>resp.json())
        .then(resp=>{
          if (resp.erro)
            throw resp.erro;
          if (componenteExiste) {
            if (resp.qtdeSessoesDesconectadas == 0)
              alert('Esta conta não está conectada em outros dispositivos.');
            else
              alert('Esta conta foi desconectada de '+resp.qtdeSessoesDesconectadas
                +' outro(s) dispositivo(s).');
          }
        })
        .catch(erro=>{
          console.log(erro);
          if (erro.codigo == 401) { //sessão inexistente
            document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
            contexto2.definirUsuarioLogado();
            historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
            //historico.push('/entrar');
          } if (erro.codigo == 409) { //sessão diferente
            //contexto2.autenticarSessao();
            //historico.push('/conta');
            window.location.reload();
          } else
            alert('Erro ao tentar desconectar outros dispositivos. Verifique o console de seu navegador para\
            mais detalhes.');
        });
    //  }
    //});
  }
  
  //function getCookie(cname) {
  //  let name = cname + '=';
  //  let decodedCookie = decodeURIComponent(document.cookie);
  //  let ca = decodedCookie.split(';');
  //  for(let i = 0; i < ca.length; i++) {
  //    let c = ca[i];
  //    while (c.charAt(0) == ' ') {
  //      c = c.substring(1);
  //    }
  //    if (c.indexOf(name) == 0) {
  //      return c.substring(name.length, c.length);
  //    }
  //  }
  //  return '';
  //}

  return (
    <div className='conteudo'>
      {/*{!contexto2.usuarioLogado ?
        <FormularioDeEntrada/>
      :*/}
      {contexto2.usuarioLogado &&
        <>
        <h2>Configurações</h2>
        <strong>Alterar dados</strong>
        <div className='comEspacoParaMensagemDeErro'>
          <form className='configuracoes' onSubmit={e=>validarAlteracaoDeDados(e)}>
            {/*<div className='aoLado'>*/}
            {/*<label htmlFor='nome'>Nome</label>
            <input id='nome' name='nome' placeholder={dadosDoUsuario.nome}
              onClick={()=>definirMensagem('')} onChange={()=>definirMensagem('')}
            />*/}
            <label htmlFor='email'>E-mail</label>
            <input id='email' name='email' type='email'
              defaultValue={dadosDoUsuario.email || ''}
              //placeholder={dadosDoUsuario.email || '(conta sem e-mail)'}
              onClick={()=>definirMensagem('')} onChange={()=>definirMensagem('')}
            />
            <label htmlFor='novaSenha'>Nova senha</label>
            <input id='novaSenha' name='novaSenha' type='password'
              onClick={()=>definirMensagem('')} onChange={()=>definirMensagem('')}
            />
            <label htmlFor='confirmarNovaSenha'>Repita a nova senha</label>
            <input id='confirmarNovaSenha' name='confirmarNovaSenha' type='password'
              onClick={()=>definirMensagem('')} onChange={()=>definirMensagem('')}
            />
            {/*</div>*/}
            <br/>
            <label htmlFor='senhaAtual'>Digite a senha atual para confirmar</label>
            <input id='senhaAtual' name='senhaAtual' type='password' required
              onClick={()=>definirMensagem('')} onChange={()=>definirMensagem('')}
            />
            <button className='botaoEntrar alturaBase' type='submit'>
              {aguardandoAlterarDados ? <img className='carregando' src={carregando}/> : 'Salvar'}
            </button>
            {/*<p className='mensagemDeErroCentralizada'>{mensagem}</p>*/}
            {/*{erroAoValidar && <p className='mensagemDeErroCentralizada'>{mensagem}</p>}*/}
          </form>
          {/*<p className={erroAoValidar ? 'mensagemDeErro' : 'mensagemDeSucesso'}>{mensagem}</p>*/}
          {mensagem && <p className='mensagemDeErro'>{mensagem}</p>}
        </div>

        <strong>Desconectar outros dispositivos</strong>
        <button className='alturaBase' onClick={desconectarOutrosDispositivos}>Desconectar</button>

        <strong>Excluir conta</strong>
        {!confirmandoExclusaoDaConta ?
          <button className='excluirConta alturaBase' onClick={()=>definirConfirmandoExclusaoDaConta(true)}>
            Excluir minha conta
          </button>
        :
          <>
          <p>Digite sua senha novamente antes de prosseguir com esta operação.</p>
          <div className='comEspacoParaMensagemDeErro'>
            <div className='flex flexColumn'>
              <input id='confirmarSenhaParaExclusaoDaConta' type='password' placeholder='Senha atual'
                onClick={()=>definirMensagemExcluir('')} onChange={()=>definirMensagemExcluir('')}
              />
              <button className='excluirConta alturaBase' onClick={validarExclusaoDaConta}>
                {aguardandoExcluir ? <img className='carregando' src={carregando}/> : 'Excluir minha conta'}
              </button>
              <button className='alturaBase' onClick={()=>{
                definirConfirmandoExclusaoDaConta(false);
                definirMensagemExcluir('');
              }}>
                Cancelar
              </button>
              {/*<p className='mensagemDeErroCentralizada'>{mensagemExcluir}</p>*/}
            </div>
            {mensagemExcluir && <p className='mensagemDeErro'>{mensagemExcluir}</p>}
          </div>
          </>
        }
        </>
      }
    </div>
  )
}