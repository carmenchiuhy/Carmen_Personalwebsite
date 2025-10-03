var title = document.querySelector("h1");
title.innerHTML = "This is the title from code.js";

var button = document.querySelector("#cv");

button.addEventListener("click", myfunction);

function myfunction() {
    alert("Let me tell you more about me!");
}


var mycode = document.createElement("div");
//change basic attributes
mycode.id = "mywork";
mycode.innerHTML = "Here is some of my recent work!";
mycode.style.color = "black";
mycode.style.backgroundColor = "white";   
mycode.style.textAlign = "center";
mycode.style.cursor = "pointer"; 

//add event listener
mycode.addEventListener("click", welcometowork);

document.querySelector("#mywork").appendChild(mycode);

function welcometowork() {
    //alert("Welcome to my work section!");

    mycode.innerHTML = "Thank you for visiting my work section!";
    mycode.style.backgroundColor = "orange";
    mycode.style.fontSize = "20px";
}





//try

var one = document.createElement("div");
//change basic attributes
one.id = "1";
one.innerHTML = "Hello!";
one.style.color = "black";
one.style.backgroundColor = "white";   
one.style.textAlign = "center";

//add event listener
one.addEventListener("click", w);

document.querySelector("#1").appendChild(one);

function w() {
    alert("Welcome to my work section!");
}


