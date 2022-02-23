//TODO: try catch for fetch
import './App.css'
import React, {  useEffect, useReducer, useRef, useState } from 'react'
import  ReactDOM  from 'react-dom'


function App() {
  // const getData = async ()=>{
  //   const data = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=100',{
  //     method: 'GET',
  //   })
  //   if(!data) console.log('error here')
  // }
  const [data,setData] = useState(null)
  const [limit,setLimit] = useState(30)
  //DEF: forceUpdate
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  
  const totalPokemon = 1140
  
  let pagesNumber = Math.ceil(totalPokemon/limit)
  const [pageNo,setPageNo] = useState(2)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentClick, setCurrentClick] = useState(null)
  const [showSpinner,setShowSpinner] = useState(false)
  const handleGet = ()=>{
    // await fetch('/api',{
    //   method: 'GET'
    // })
    // fetch("http://localhost:5000/api")
    //   .then((res) =>{return res.json()})
    //   .then((res)=>setData(res.results))
    
    fetch(`http://localhost:5000/api/?limit=${limit}&offset=${(currentPage-1) * limit}`)
    .then((res)=>{
      setShowSpinner(true)
      return res.json()
    })
    .then((res)=>{
      setShowSpinner(false)
      setData(res.results)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  

  const handleLimitChange = (e)=>{
    setLimit(parseInt(e.target.value))
    //DEF: forceUpdate for change page numbers when limit per page is changed
    forceUpdate()
  }
  //DEF:

  
  // console.log(pagesNumber)
  const handlePageClick = (e)=>{
    let current = e.target.value
    setCurrentClick(e.target)
    
    
    
    if(current === '>>'){
      current = Math.floor((pageNo+pagesNumber)/2)
      
    }
    else if(current === '<<'){
      current = Math.floor((pageNo-2))
    }
    else current = parseInt(current)
    // console.log(current)

    if(current <= 1){
      setCurrentPage(1)
      setPageNo(2)
    }
    // else if(current == pagesNumber-1){
    //   setCurrentPage(pagesNumber)
    //   setPageNo(pagesNumber-1)
    // }
    else if(current >= pagesNumber){
      setCurrentPage(pagesNumber)
      setPageNo(pagesNumber-1)
    }
    else{
      setCurrentPage(current)
      setPageNo(current+1)
    }
    // fetch data with offset= limit =number https://pokeapi.co/api/v2/pokemon/?limit=10&offset=30
    // fetch(`http://localhost:5000/api/?limit=${number}&offset=${(currentPage-1) * number}`)
    forceUpdate()
    
    
  }
  
  useEffect(()=>{
    if(!currentClick) return()=>{}

    // console.log(limit, (currentPage-1) * limit)
    let pages = document.querySelectorAll('.btn')
    pages.forEach((p)=>{
      const attr = p.getAttribute('value')
      p.classList.remove('current-page')
      // if(attr === currentClick.getAttribute('value')) p.classList.add('current-page')
      // console.log(p.getAttribute('value'),currentPage)
      if(p.getAttribute('value') === currentPage.toString()){
        // console.log(p.getAttribute('value'),currentPage,'here')
        p.classList.add('current-page')
      }
    })
    // currentClick.classList.add('current-page')
    fetch(`http://localhost:5000/api/?limit=${limit}&offset=${(currentPage-1) * limit}`)
    .then((res)=>{
      setShowSpinner(true)
      return res.json()
    })
    .then((res)=>{
      setShowSpinner(false)
      setData(res.results)
    })
    .catch(err=>{
      console.log(err)
    })
  
    // .then((res)=>res.json())
    // .then((res)=>setData(res.results))
    return()=>{}
  },[currentPage])

  return (
    <section className='app'>
      <input className='btn' type='button' value='GET' onClick={()=>handleGet()}/>
      <div className='limit'>
        <span><label className='radio-text' htmlFor='limit-25'>25</label><input className='radio' onChange={(e)=>{handleLimitChange(e)}} value='25' id='limit-25' type='radio' name='limit'/></span>
        <span><label className='radio-text' htmlFor='limit-50'>50</label><input className='radio' onChange={(e)=>{handleLimitChange(e)}} value='50' id='limit-50' type='radio' name='limit'/></span>
        <span><label className='radio-text' htmlFor='limit-100'>100</label><input className='radio' onChange={(e)=>{handleLimitChange(e)}} value='100' id='limit-100' type='radio' name='limit'/></span>
        <span><label className='radio-text' htmlFor='limit-all'>all</label><input className='radio' onChange={(e)=>{handleLimitChange(e)}} value='10228' id='limit-all' type='radio' name='limit'/></span>
        <span>Pokemon per page</span>
      </div>
      <div className='pages' style={{'visibility': `${!data?'hidden':'visible'}`}}>
        {/* <Pages number={limit}/> */}
        {/* {console.log(limit)} */}
          <span><input className='btn' onClick={(e)=>handlePageClick(e)} type='button' value={pagesNumber-pagesNumber+1}/></span>
          <span><input className='btn' onClick={(e)=>handlePageClick(e)} type='button' value='<<'/></span>
          <span><input className='btn' onClick={(e)=>handlePageClick(e)} type='button' value={pageNo-1}/></span>
          <span><input className='btn' onClick={(e)=>handlePageClick(e)} type='button' value={pageNo}/></span>
          <span><input className='btn' onClick={(e)=>handlePageClick(e)} type='button' value={pageNo+1}/></span>
          <span><input className='btn' onClick={(e)=>handlePageClick(e)} type='button' value='>>'/></span>
          <span><input className='btn' onClick={(e)=>handlePageClick(e)} type='button' value={pagesNumber}/></span>
      </div>
      {/* <p>{!data?'loading...':data.results}</p> */}
      <div className='pokeball'>
        {!data?'loading'
        :(
          showSpinner?<p>LOADING...</p> 
            :(
              data.map(item=> <Pokemon key={makeid(7)} pokemon={item}/>)
            )
        )}
      </div>
    </section>
  )
}

function makeid(length) {
  var result           = ''
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$^&*()_+'
  var charactersLength = characters.length
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// function Pages(props)
// {
//   const {number} = props
//   // console.log(props)
//   const totalPokemon = 10228
//   //DEF: perpageLimit
//   // const ppLimit =  limit
//   // console.log(typeof(number),number)
//   let pagesNumber = Math.ceil(totalPokemon/number)
//   const [pageNo,setPageNo] = useState(2)
//   const [currentPage, setCurrentPage] = useState(1)
//   // console.log(pagesNumber)
//   const handleClick = (e)=>{
//     let current = e.target.value
//     if(current === '>>'){
//       current = Math.floor((pageNo+pagesNumber)/2)
      
//     }
//     else if(current === '<<'){
//       current = Math.floor((1+pageNo)/2)
//     }
//     else current = parseInt(current)
//     // console.log(current)

//     if(current <= 1){
//       setCurrentPage(1)
//       setPageNo(2)
//     }
//     else if(current >= pagesNumber){
//       setCurrentPage(pagesNumber)
//       setPageNo(pagesNumber-1)
//     }
//     else{
//       setCurrentPage(current)
//       setPageNo(current)
//     }
//     //TODO: fetch data with offset= limit =number https://pokeapi.co/api/v2/pokemon/?limit=10&offset=30
//     // fetch(`http://localhost:5000/api/?limit=${number}&offset=${(currentPage-1) * number}`)
    
    
//   }
//   useEffect(()=>{
//     console.log(currentPage)
//     return ()=>{}
//   },[currentPage])
//   const child = useRef()
//   return(
//     <>
//       <div className='page-controller' data-currentPage={currentPage} ref={child}>
//         <span><input onClick={(e)=>handleClick(e)} type='button' value={pagesNumber-pagesNumber+1}/></span>
//         <span><input onClick={(e)=>handleClick(e)} type='button' value='<<'/></span>
//         <span><input onClick={(e)=>handleClick(e)} type='button' value={pageNo-1}/></span>
//         <span><input onClick={(e)=>handleClick(e)} type='button' value={pageNo}/></span>
//         <span><input onClick={(e)=>handleClick(e)} type='button' value={pageNo+1}/></span>
//         <span><input onClick={(e)=>handleClick(e)} type='button' value='>>'/></span>
//         <span><input onClick={(e)=>handleClick(e)} type='button' value={pagesNumber}/></span>
//       </div>
//     </>
//   )
// }

function Pokemon(props)
{
  const [img,setImg] = useState(null)
  const {id, name, url} = props.pokemon
  // let lols = 'a/1/'
  // lols[Nu(lols.length-2)]
  const pokeClick = (e)=>{
    const dataref = e.target.getAttribute('data-ref')
    // console.log(dataref)
    
    const IDparam = dataref.split('pokemon/')[1].split('/')[0]
    
    // console.log(IDparam)
    fetch(`http://localhost:5000/api/${IDparam}`)
    .then(res=>res.json())
    .then(res=>setImg(res.sprites.other["official-artwork"].front_default))
    
    

  }

  return(
    <>
      <p>{id}</p>
      <p>{name}</p>
      <p>{url}</p>
      <input className='btn poke-btn' type='button' data-ref={url} value='populate' onClick={(e)=>pokeClick(e)} disabled={img?true:false}/>
      
      
        <input className='btn poke-btn' type='button' disabled={img?false:true} value='Get more images' />
        <img src={!img?null:img} />
      
    </>
  )
}

export default App
