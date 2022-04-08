const express = require('express')
const fetch = require('node-fetch');
const router = express.Router()

router.get('/', async function (req, res, next) {
  res.render('index')
})

router.get('/about', async function (req, res, next) {
  res.render('about')
})

router.get('/generations', async function (req, res, next) {
  res.render('generations')
})

router.get('/generation', async function (req, res, next) {
  let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit='+req.query.limit+'&offset='+req.query.offset)
  let data = await response.json()
  
  let pokemons = await Promise.all(data.results.map(async (item) => {
    let response = await fetch(item.url)
  
    return await response.json()
  }))

  pokemons.sort(function(a, b) {
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  })

  res.render('generation', { pokemons: pokemons, id: req.query.id } )
})

router.get('/pokemon', async function (req, res, next) {
  let response = await fetch('https://pokeapi.co/api/v2/pokemon/'+req.query.id)
  let data = await response.json()

  res.render('pokemon', { pokemon: data })
})

router.get('/types', async function (req, res, next) {
  let response = await fetch('https://pokeapi.co/api/v2/type/')
  let data = await response.json()

  res.render('types', { response: data })
})


module.exports = router
