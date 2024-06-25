import React, { useEffect } from 'react'

export default function PaginaNaoEncontrada() {
  
  useEffect(()=>{
    document.title = 'Página não encontrada - NLW eSports';
  }, [])

  return (
    <div className='conteudo'>
      <h2>Página Não Encontrada</h2>
    </div>
  )
}