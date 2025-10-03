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
mycode.style.color = "white";

//add event listener
mycode.addEventListener("click", welcometowork);

document.querySelector("#mywork").appendChild(mycode);

function welcometowork() {
    //alert("Welcome to my work section!");

    mycode.innerHTML = "I am glad you are here!";
}

