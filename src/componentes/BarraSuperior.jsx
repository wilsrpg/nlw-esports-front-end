import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom';
import { contexto } from '../App';
import iconeMenu from '../imagens/icons8-menu.svg'
import iconeUsuario from '../imagens/user-circle-svgrepo-com.svg'
import FormularioDeEntrada from './FormularioDeEntrada';
import { SERVIDOR } from '../../enderecoDoServidor';

export default function BarraSuperior() {
  const contexto2 = useContext(contexto);
  const urlAtual = useLocation();
  const historico = useHistory();
  const larguraDeColapso = 450;
  const [telaEstreita, definirTelaEstreita] = useState(window.innerWidth <= larguraDeColapso);
  const larguraDeColapso2 = 900;
  const [telaEstreita2, definirTelaEstreita2] = useState(window.innerWidth <= larguraDeColapso2);
  const [exibindoMenuDaPaginaSuspenso, definirExibindoMenuDaPaginaSuspenso] = useState(false);
  const [exibindoMenuDoUsuarioSuspenso, definirExibindoMenuDoUsuarioSuspenso] = useState(false);

  useEffect(()=>{
    window.onresize = ()=>{
      if (window.innerWidth <= larguraDeColapso)
        definirTelaEstreita(true);
      else
        definirTelaEstreita(false);
      if (window.innerWidth <= larguraDeColapso2)
        definirTelaEstreita2(true);
      else
        definirTelaEstreita2(false);
    };
    window.onclick = fecharMenus;
    document.body.addEventListener('keydown',e=>fecharMenusPeloTeclado(e),{once:true});
  }, [])

  useEffect(()=>{
    const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    //if (!tokenDaSessao || !contexto2.usuarioLogado) {
    //  document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //  contexto2.definirUsuarioLogado();
    //}
    if (!tokenDaSessao) {
      //document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
      if (contexto2.usuarioLogado) {
        contexto2.definirUsuarioLogado();
        //console.log('sem cookie, com usuário; deslogando');
      }
      //contexto2.autenticarSessao();
    } else
    //if (tokenDaSessao && !contexto2.usuarioLogado) {
    if (!contexto2.usuarioLogado) {
      //contexto2.definirAguardando(true);
      contexto2.autenticarSessao();
      //console.log('com cookie, sem usuário logado; autenticando');
      //mas se for um cookie roubado?
    }
  }, [urlAtual])

  //useEffect(()=>{
  //  const token = contexto2.autenticarSessao();
  //  console.log(token);
  //  if (!token || !contexto2.usuarioLogado) {
  //    document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
  //    //historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
  //    historico.push('/entrar');
  //  }
  //}, [urlAtual])
  //}, [urlAtual,contexto2.usuarioLogado])

  //useEffect(()=>{
  //  if (!contexto2.usuarioLogado) {
  //    document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
  //    //historico.push('/entrar?redir='+urlAtual.pathname.slice(1));
  //    historico.push('/entrar');
  //  }
    
  //  //return ()=>componenteExiste = false;
  //}, [contexto2.usuarioLogado])

  useEffect(()=>{
    fecharMenus();
  }, [urlAtual,telaEstreita,telaEstreita2])

  function fecharMenusPeloTeclado(e) {
    if (e.repeat)
      return;
    if (e.key == 'Escape')
      fecharMenus();
  }

  async function fecharMenus() {
    definirExibindoMenuDaPaginaSuspenso(false);
    definirExibindoMenuDoUsuarioSuspenso(false);
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

  function sair() {
    definirExibindoMenuDoUsuarioSuspenso(false);
    //localStorage.removeItem('usuarioLogado');
    //localStorage.removeItem('idDoUsuarioLogado');
    //document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
    //contexto2.definirUsuarioLogado();
    //historico.push('/entrar');
    //const tokenDaSessao = getCookie('tokenDaSessao');
    //console.log(tokenDaSessao);
    const tokenDaSessao = contexto2.getCookie('tokenDaSessao');
    if (!tokenDaSessao || !contexto2.usuarioLogado) {
      document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
      contexto2.definirUsuarioLogado();
      historico.push('/entrar');
      return;
    }
    //} else {
      const dados = {
        method: 'DELETE',
        //headers: {'Content-Type': 'application/json'},
        headers: {'Authorization': tokenDaSessao},
        //body: JSON.stringify({tokenDaSessao}),
      };
      fetch(SERVIDOR+`/sessoes`, dados)
      //fetch(SERVIDOR+`/sessoes/${tokenDaSessao}`, dados)
      .then(resp=>resp.json())
      .then(resp=>{
        if (resp.erro)
          throw resp.erro;
        //localStorage.removeItem('idDoUsuarioLogado');
        //localStorage.removeItem('usuarioLogado');
        //document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;httponly=true;path=/';
        document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
        contexto2.definirUsuarioLogado();
        historico.push('/entrar');
      })
      .catch(erro=>{
        console.log(erro);
        alert('Erro ao tentar sair. Verifique o console de seu navegador para mais detalhes.');
      });
    //}
  }

  function exibirMenuDaPagina(e) {
    e.stopPropagation();
    definirExibindoMenuDoUsuarioSuspenso(false);
    definirExibindoMenuDaPaginaSuspenso(!exibindoMenuDaPaginaSuspenso);
  }

  function exibirMenuDoUsuario(e) {
    e.stopPropagation();
    definirExibindoMenuDaPaginaSuspenso(false);
    definirExibindoMenuDoUsuarioSuspenso(!exibindoMenuDoUsuarioSuspenso);
  }

  function OpcoesDoMenuDaPagina() {
    return (
      <>
      <Link to='/'>
        Página Inicial
      </Link>
      <Link to='/jogos'>
        Jogos
      </Link>
      <Link to='/anuncios'>
        Anúncios
      </Link>
      </>
    )
  }

  function OpcoesDoMenuDoUsuario() {
    return (
      <>
      <Link to='/conta'>
        Conta
      </Link>
      {/*<Link to={`/usuarios/${contexto2.usuarioLogado}`}>
        Meu perfil
      </Link>*/}
      {/*<Link to='/amigos'>
        Amigos
      </Link>*/}
      <Link to='/meus-anuncios'>
        Meus anúncios
      </Link>
      <Link to='/configuracoes'>
        Configurações
      </Link>
      <a onClick={sair}>
        Sair
      </a>
      </>
    )
  }

  return (
    <>
    <header className='cabecalho'>
      <div id='barraSuperior' className='barraSuperior'>
        <nav>
          {telaEstreita ?
            <img className='botaoCopiar' src={iconeMenu} onClick={e=>exibirMenuDaPagina(e)}/>
          :
            <OpcoesDoMenuDaPagina/>
          }
        </nav>

        {telaEstreita2 || contexto2.usuarioLogado ?
          <div className='flex'>
            {contexto2.usuarioLogado && <span className='nomeDoUsuario'>{contexto2.usuarioLogado.nome}</span>}
            <img className='botaoCopiar' src={iconeUsuario} onClick={e=>exibirMenuDoUsuario(e)}/>
          </div>
        :
          urlAtual.pathname != '/entrar' &&
            <FormularioDeEntrada funcFecharMenu={()=>definirExibindoMenuDoUsuarioSuspenso(false)} cabecalho/>
        }
      </div>

      {exibindoMenuDaPaginaSuspenso &&
        <div className='gambiarra'>
          <div className='invisivel'>
          </div>
          <div className='menuSuspenso' onClick={e=>e.stopPropagation()}>
            <OpcoesDoMenuDaPagina/>
          </div>
        </div>
      }

      {exibindoMenuDoUsuarioSuspenso && urlAtual.pathname != '/entrar' &&
        <div className='gambiarra direita'>
          <div className='invisivel'>
          </div>
          <div className='menuSuspenso' onClick={e=>e.stopPropagation()}>
            {contexto2.usuarioLogado ?
              <OpcoesDoMenuDoUsuario/>
            :
              <FormularioDeEntrada funcFecharMenu={()=>definirExibindoMenuDoUsuarioSuspenso(false)} suspenso/>
            }
          </div>
        </div>
      }
    </header>
    </>
  )
}