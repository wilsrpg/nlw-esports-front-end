import React, { useEffect, useState } from 'react'
import iconeFechar from '../imagens/x.svg'
import iconeSucesso from '../imagens/icons8-check.svg'
import iconeCopiar from '../imagens/icons8-restore-down-26.png'
import iconeCopiado from '../imagens/icons8-checked.svg'

export default function ModalConectar({discord, funcFechar}) {
  const [imagensCarregadas, definirImagensCarregadas] = useState(0);
  const [carregou, definirCarregou] = useState(false);
  const [copiou, definirCopiou] = useState(false);

  useEffect(()=>{
    document.body.onkeydown = e=>fechar(e);
  }, [])

  useEffect(()=>{
    if (imagensCarregadas == 2)
      definirCarregou(true);
  }, [imagensCarregadas])

  function fechar(e) {
    if (e.repeat)
      return;
    if (e.key == 'Escape')
      funcFechar();
  }

  function copiar() {
    navigator.clipboard.writeText(discord);
    definirCopiou(true);
  }

  return (
    <div className='modalAnuncioFora' onClick={funcFechar}>
      {/*{carregou &&*/}
      <div className='modalAnuncio' style={{visibility: !carregou ? 'hidden' : 'visible'}}
        onClick={e=>e.stopPropagation()}
      >

        <img className='botaoCopiar botaoFechar' src={iconeFechar}
          onClick={funcFechar} onLoad={()=>definirImagensCarregadas(imagensCarregadas+1)}
        />
        <div className='modalConectarInterior'>
          <img src={iconeSucesso} onLoad={()=>definirImagensCarregadas(imagensCarregadas+1)}/>
          <div className='centralizado'>
            <h2>Let's play!</h2>
            <p>Agora é só começar a jogar!</p>
          </div>
          <div className='centralizado'>
            <strong>Adicione no Discord:</strong>
          <div className='discord'>
            <strong>{discord}</strong>
            {window.isSecureContext && (
              !copiou ? 
                <img src={iconeCopiar} className='botaoCopiar' onClick={copiar}/>
              :
                <img src={iconeCopiado} className='botaoCopiar' onClick={()=>definirCopiou(false)}/>
            )}
          </div>
          </div>
        </div>

      </div>
      {/*}*/}
    </div>
  )
}