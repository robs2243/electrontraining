var btn_vor = document.getElementById("btn_vor");
var btn_unten_vor = document.getElementById("btn_unten_vor");
var btn_zuruck = document.getElementById("btn_zuruck");
var btn_unten_zuruck = document.getElementById("btn_unten_zuruck");

var bild = document.getElementById("bild");
var bild_unten = document.getElementById("bild_unten");

btn_vor.addEventListener("click", ()=>{

    bild.src = "katze2.jpg"

})

btn_unten_vor.addEventListener("click", ()=>{

    bild_unten.src = "hund2.jpg"

})


btn_zuruck.addEventListener("click", ()=>{

    bild.src = "katze.jpg"

})


btn_unten_zuruck.addEventListener("click", ()=>{

    bild_unten.src = "hund.jpg"

})