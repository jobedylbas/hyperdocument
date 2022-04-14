document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('search-form').onsubmit = function() {
        console.log('test')
        window.location = '/pokemons/pokemon?id=' + document.getElementById('search-bar').value;
        return false;
    }
});