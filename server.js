import { response } from 'express'
import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import cors from 'cors'

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`Server listening on port: ${port}`)
})


// const getData = async (req,res= response)=>{
    // const data = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=100',{
//       method: 'GET',
//     })
//     if(!data){
//         console.log('error here')
//         return{}
//     }

//   }

app.get('/api/',async (req,res)=>{
    const limit = req.query.limit
    const offset = req.query.offset
    // const data = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=100`,{
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`,{
        method: 'GET'
    })
    if(!data) res.end('Not Found')
    console.log(data)
    const text = await data.text()
    
    res.end(text)
})




app.get('/api/:id',async (req,res)=>{
    const id = req.params.id
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`,{
        method: 'GET'
    })
    if(!data) res.end('Not Found')
    console.log(data)
    const text = await data.text()
    res.end(text)
})

