import React, { useEffect, useState } from 'react'
import carregando from '../imagens/loading.svg'
import iconeFechar from '../imagens/x.svg'
import { SERVIDOR } from '../../enderecoDoServidor';

export default function ModalParaCriarAnuncio({funcRecarregarJogos,funcFechar}) {
  let componenteExiste = true;
  const [erroAoObterDados, definirErroAoObterDados] = useState(false);
  const [jogos, definirJogos] = useState();
  const [dias, definirDias] = useState([
    {abrev:'D', dia:'domingo', marcado:false},
    {abrev:'S', dia:'segunda', marcado:false},
    {abrev:'T', dia:'terça', marcado:false},
    {abrev:'Q', dia:'quarta', marcado:false},
    {abrev:'Q', dia:'quinta', marcado:false},
    {abrev:'S', dia:'sexta', marcado:false},
    {abrev:'S', dia:'sábado', marcado:false},
  ]);
  //const [usaChatDeVoz, definirUsaChatDeVoz] = useState(false);
  const [publicando, definirPublicando] = useState(false);

  useEffect(()=>{
    document.body.onkeydown = e=>fechar(e);
    fetch(SERVIDOR+`/jogos`)
    .then(resp=>resp.json())
    .then(resp=>{
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

  function fechar(e) {
    if (e.repeat)
      return;
    if (e.key == 'Escape')
      funcFechar();
  }

  async function publicarAnuncio(e) {
    if (publicando)
      return;
    e.preventDefault();
    if (document.getElementById('jogo').value == 'nenhum') {
      //document.getElementById('jogo').style.backgroundColor = 'red';
      document.getElementById('jogo').style.animation = 'chamarAtencao 500ms';
      document.getElementById('jogo').focus();
      setTimeout(() => {
        document.getElementById('jogo').style.animation = '';
      }, 500);
      return;
    }
    if (!dias.some(dia=>dia.marcado)) {
      document.getElementById('dias').style.animation = 'chamarAtencao 1000ms';
      //dias.map(dia=>document.getElementById(dia.dia).style.animation = 'chamarAtencaoDias 0.5s')
      setTimeout(() => {
        document.getElementById('dias').style.animation = '';
        //dias.map(dia=>document.getElementById(dia.dia).style.animation = '')
      }, 1000);
      return;
    }
    if (document.getElementById('tempo de jogo').value < 0) {
      document.getElementById('tempo de jogo').focus();
      return;
    }
    const dados = Object.fromEntries(new FormData(e.target));
    const diasNum = [];
    dias.map((dia,id)=>{
      if (dia.marcado)
        diasNum.push(id);
    });
    const novoAnuncio = JSON.stringify({
      jogoId: dados.jogoId,
      nomeDoUsuario: dados.nome,
      tempoDeJogoEmAnos: Number(dados.tempoDeJogo),
      discord: dados.discord,
      diasQueJoga: diasNum.join(),
      deHora: dados.horaDe,
      ateHora: dados.horaAte,
      usaChatDeVoz: dados.usaChatDeVoz,
    });
    definirPublicando(true);
    tentarPublicar(dados.jogoId, novoAnuncio);
  }

  function tentarPublicar(jogoId, anuncio) {
    const dados = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: anuncio,
    };
    fetch(SERVIDOR+`/jogos/${jogoId}/anuncios`, dados)
    .then(resp=>{
      if (resp.ok) {
        funcRecarregarJogos();
        alert('Anúncio publicado com sucesso!');
      } else
        alert('Erro ao publicar anúncio. Verifique o console de seu navegador para mais detalhes.');
    })
    .catch(erro=>{
      console.log(erro);
      alert('Erro ao publicar anúncio. Verifique o console de seu navegador para mais detalhes.');
    })
    .finally(()=>{
      if (componenteExiste)
        definirPublicando(false);
    });
  }

  return (
    <div className='modalAnuncioFora' onClick={funcFechar}>
      <div className='modalAnuncio' onClick={e=>e.stopPropagation()}>

        <img className='botaoCopiar botaoFechar' src={iconeFechar} onClick={funcFechar}/>
        <h2>Publique seu anúncio</h2>
        <form className='flex flexColumn' onSubmit={publicarAnuncio}>

          <label>Jogo</label>
          <select disabled={!jogos} id='jogo' name='jogoId'
            onFocus={e=>e.target.style.backgroundColor=''}
          >
            <option value='nenhum'>
              {!jogos ?
                (!erroAoObterDados ? 'Buscando jogos...' : 'Erro ao obter dados dos jogos do servidor.')
              :
                'Selecione um jogo'
              }
            </option>
            {jogos && jogos.map((jogo,id)=>{
              return <option key={id} value={jogo.id}>{jogo.nome}</option>
            })}
          </select>

          <label htmlFor='nome'>Nome ou apelido</label>
          <input id='nome' name='nome' required/>

          <div className='aoLado'>

            <div className='flex flexColumn'>
              <label htmlFor='discord'>Discord</label>
              {/*<input id='discord' name='discord' placeholder='Nome de Usuário#0000'
                pattern='.*[\S][#][\d]{4}' required
              />*/}
              <input id='discord' name='discord' required/>
            </div>

            <div className='flex flexColumn'>
              <label htmlFor='tempo de jogo'>Joga há quantos anos?</label>
              <input id='tempo de jogo' name='tempoDeJogo' type='tel' maxLength='2' pattern='\d*' required/>
            </div>

            <div className='flex flexColumn'>
              <label>Dias disponíveis</label>
              <div id='dias' className='flex dias'>
                {dias.map((dia,id)=>
                  <input
                    key={id}
                    id={dia.dia}
                    type='button'
                    value={dia.abrev}
                    title={dia.dia}
                    className={dia.marcado ? 'roxinho' : ''}
                    onClick={()=>{
                      document.getElementById('dias').style.borderColor='#71717a';
                      definirDias([
                        ...dias.slice(0,id),
                        {...dia, marcado: !dia.marcado},
                        ...dias.slice(id+1)
                      ]);
                    }}
                  />
                )}
              </div>
            </div>

            <div className='flex flexColumn'>
              <label>Horário disponível</label>
              <div className='flex'>
                <label htmlFor='de'>De</label>
                <input id='de' name='horaDe' type='time' required/>
                <label htmlFor='até'>Até</label>
                <input id='até' name='horaAte' type='time' required/>
              </div>
            </div>

          </div>

          <div className='chatDeVoz'>
            <input id='voz' name='usaChatDeVoz' type='checkbox'/>
            <label htmlFor='voz'>Costumo usar o chat de voz</label>
          </div>

          <button type='submit' disabled={publicando} className='botaoPublicarAnuncio roxinho'>
            {!publicando ? 'Publicar' : <img className='carregando' src={carregando}/>}
          </button>

        </form>

      </div>
    </div>
  )
}