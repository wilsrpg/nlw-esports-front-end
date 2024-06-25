import React, { createContext, useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'
import carregando from './imagens/loading.svg'
import BarraSuperior from './componentes/BarraSuperior'
//import BarraInferior from './componentes/BarraInferior'
import PaginaInicial from './paginas/PaginaInicial'
import Jogos from './paginas/Jogos'
import Anuncios from './paginas/Anuncios'
//import Perfil from './paginas/Perfil'
import Conta from './paginas/Conta'
import Configuracoes from './paginas/Configuracoes'
import Registrar from './paginas/Registrar'
import PaginaNaoEncontrada from './paginas/PaginaNaoEncontrada'
import Entrar from './paginas/Entrar'
import NovoAnuncio from './paginas/NovoAnuncio'
import MeusAnuncios from './paginas/MeusAnuncios'
import { SERVIDOR } from '../enderecoDoServidor';
import RecuperarConta from './paginas/RecuperarConta'
import RedefinirSenha from './paginas/RedefinirSenha'

/*falta:
-não reutilizar id no banco de dados
-mudar nomenclatura no banco de dados pra este_padrao: NÃO, em outro projeto faço isso
-verificar envio de e-mails
-cadastrar jogo? NÃO
-alterar nome da coluna idDoAnuncio da tabela Anuncios para "id" e fazer a correspondência nos arquivos
  CartaoDeAnuncio e ResultadosDaPesquisa
*/

export const contexto = createContext();

export default function App() {
  const [usuarioLogado, definirUsuarioLogado] = useState();
  const [aguardando, definirAguardando] = useState(true);
  
  useEffect(()=>{
    autenticarSessao();
    /*const tokenDaSessao = getCookie('tokenDaSessao');
    //console.log('tokenDaSessao:');
    //console.log(tokenDaSessao);
    if (tokenDaSessao && tokenDaSessao != '0' && tokenDaSessao != 'undefined') {
      //console.log('com cookie=['+tokenDaSessao+']');
      autenticarSessao(tokenDaSessao);
      //const usuarioLogado = autenticarSessao(tokenDaSessao);
      //if (usuarioLogado)
      //  definirUsuarioLogado({
      //    id: usuarioLogado.id,
      //    nome: usuarioLogado.nome
      //  });
      //else
    }
    else
    //  console.log('sem cookie');
      definirAguardando(false);
    
    //if (localStorage.getItem('idDoUsuarioLogado'))
    //  definirUsuarioLogado({
    //    id: localStorage.getItem('idDoUsuarioLogado'),
    //    nome: localStorage.getItem('usuarioLogado')
    //  });*/
  }, [contexto])

  function getCookie(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    //console.log('decodedCookie:');
    //console.log(decodedCookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  async function autenticarSessao() {
    definirAguardando(true);
    autenticarSessao2();
  }

  async function autenticarSessao2() {
    //console.log('entrou em autenticarSessao');
    //let tokenResposta;
    const tokenDaSessao = getCookie('tokenDaSessao');
    if (!tokenDaSessao) {
      definirUsuarioLogado();
      definirAguardando(false);
      return;
    }
    const dados = {
      method: 'PUT',
      headers: {'Authorization': tokenDaSessao},
      //body: JSON.stringify({tokenDaSessao})
    };
    //let usuarioLogado;
    await fetch(SERVIDOR+`/sessoes`, dados)
    //fetch(SERVIDOR+`/sessoes/${tokenDaSessao}`)
    .then(resp=>resp.json())
    .then(resp=>{
      if (resp.erro)
        throw resp.erro;
      //if (componenteExiste) {
      definirUsuarioLogado({
        id: resp.idDoUsuario,
        nome: resp.nome
      });
      //usuarioLogado = {id: resp.id, nome: resp.nome};
      //setCookie('tokenDaSessao', resp.tokenDaSessao, 30);
      document.cookie = 'tokenDaSessao=' + resp.tokenDaSessao
                        + (resp.manterSessao ? ';expires='
                        + new Date(resp.dataDeExpiracao).toUTCString() : '')
                        + ';samesite=lax;path=/';
      //}
      //tokenResposta = resp.tokenDaSessao;
    })
    .catch(erro=>{
      console.log(erro);
      document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
      definirUsuarioLogado();
      //alert('Erro ao autenticar sessão. Verifique o console de seu navegador para mais detalhes.');
      //if (componenteExiste)
      //  definirErroAoObterDados(true);
    })
    .finally(()=>definirAguardando(false));
    //return tokenResposta;
  }

  //function desconectar() {
  //  document.cookie = 'tokenDaSessao=;expires=0;samesite=lax;path=/';
  //  definirUsuarioLogado();
  //  historico.push('/entrar');
  //}

  return (
    <contexto.Provider value={{usuarioLogado, definirUsuarioLogado, getCookie, autenticarSessao}}>
      {aguardando ?
        <div className='conteudo'>
          <img className='carregando' src={carregando}/>
        </div>
      :
      //{!aguardando &&
        <BrowserRouter>
          <BarraSuperior/>
          <Switch>
            <Route exact path='/'>
              <PaginaInicial/>
            </Route>
            <Route path='/registrar'>
              <Registrar/>
            </Route>
            <Route path='/entrar'>
              <Entrar/>
            </Route>
            <Route path='/recuperar-conta'>
              <RecuperarConta/>
            </Route>
            <Route path='/redefinir-senha'>
              <RedefinirSenha/>
            </Route>
            <Route path='/conta'>
              <Conta/>
            </Route>
            {/*<Route path='/usuarios/:nome'>
              <Perfil />
            </Route>*/}
            {/*<Route path='/amigos'>
              <Amigos/>
            </Route>*/}
            <Route path='/meus-anuncios'>
              <MeusAnuncios/>
            </Route>
            <Route path='/configuracoes'>
              <Configuracoes/>
            </Route>
            {/*<Route path='/usuarios/:nome/anuncios'>
              <Anuncios />
            </Route>*/}
            {/*<Route path='/jogos/:nome'> //página de informações do jogo
              <Jogos />
            </Route>*/}
            <Route path='/jogos'>
              <Jogos/>
            </Route>
            <Route path='/anuncios'>
              <Anuncios/>
            </Route>
            <Route path='/novo-anuncio'>
              <NovoAnuncio/>
            </Route>
            <Route>
              <PaginaNaoEncontrada/>
            </Route>
          </Switch>
          {/*<BarraInferior/>*/}
        </BrowserRouter>
      }
    </contexto.Provider>
  )
}