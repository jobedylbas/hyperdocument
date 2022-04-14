const express = require('express')
const fetch = require('node-fetch');
const router = express.Router()

router.get('/', async function (req, res, next) {
  res.render('index', { breadcrumbs: [] })
})

router.get('/about', async function (req, res, next) {
  res.render('about', { breadcrumbs: ["Sobre"] })
})

router.get('/references', async function (req, res, next) {
  res.render('references', { breadcrumbs: ["Referências"] })
})

router.get('/generations', async function (req, res, next) {
  res.render('generations', { breadcrumbs: ["Gerações"] })
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
  let lastBreadcrumb = "Geração "+req.query.id
  res.render('generation', { pokemons: pokemons, id: req.query.id, breadcrumbs: [{ name: 'Gerações', path: '/generations' }, lastBreadcrumb]} )
})

router.get('/pokemons/pokemon', async function (req, res, next) {
  var data = {}
  
  if (req.query.id.length === 0){
    res.render( 'error' , { breadcrumbs: []} )
  } else {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon/'+req.query.id)

    try {
      data = await response.json()
      let dataName = data.name.charAt(0).toUpperCase() + data.name.slice(1)
      res.render('pokemon', { pokemon: data, breadcrumbs: [{name: "Pokemons", path: '/pokemons'}, dataName] })
    } catch(e) {
      res.render( 'error' , { breadcrumbs: []} )
    }
  }
})

router.get('/pokemons', async function (req, res, next) {
  let response = await fetch('https://pokeapi.co/api/v2/pokemon/?offset='+req.query.offset+'&limit=10')
  let data = await response.json()

  let pokemons = await Promise.all(data.results.map(async (item) => {
    let response = await fetch(item.url)
  
    return await response.json()
  }))

  res.render('pokemons', { pokemons: pokemons, offset: parseInt(req.query.offset), breadcrumbs: ["Pokemons"] })
})

router.get('/types', async function (req, res, next) {
  let response = await fetch('https://pokeapi.co/api/v2/type/')
  let data = await response.json()

  res.render('types', { response: data, breadcrumbs: ["Tipos"] })
})

router.get('/types/type', async function (req, res, next) {
  let response = await fetch('https://pokeapi.co/api/v2/type/'+req.query.id)

  let data = await response.json()
  let dataName = data.name.charAt(0).toUpperCase() + data.name.slice(1)
  let path = [{name: "Tipos", path: "types"}, dataName]
  
  res.render('type', { response: data, breadcrumbs: path })
})

router.get('/moves', async function (req, res, next) {
  let response = await fetch('https://pokeapi.co/api/v2/move/?offset='+req.query.offset+'&limit=10')
  let data = await response.json()

  res.render('moves', { moves: data, offset: parseInt(req.query.offset), breadcrumbs: ["Movimentos"] })
})

router.get('/moves/move', async function (req, res, next) {
  let response = await fetch('https://pokeapi.co/api/v2/move/'+req.query.id)
  let data = await response.json()

  let dataName = data.name.charAt(0).toUpperCase() + data.name.slice(1)
  res.render('move', { move: data, breadcrumbs: [{ name: 'Movimentos', path: '/moves' }, dataName]} )
})

module.exports = router
