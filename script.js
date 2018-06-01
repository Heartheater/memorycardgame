"use strict";

let startingCards = initialDeck();
let shuffledCards = shuffle(startingCards);
let turnedCards = [];
let matchingCards = [];
let gameOver = false;
let moves = 0;
let callTime;
let sec = 0;
let min = 0;

getCards();

$('.card').on("click", function() {
    //ignore card if it's already flipped
    if (!($(this).hasClass("flip"))) {
        flipCard(this);
        checkTurnedCards(this);
        //each click = 1 move
        moves += 1;
        displayMoves(moves);
        updateRatingStars();
        //start timer when first card is clicked
        if (moves === 1) {
            startTimer();
        }
    }
    return;
});

function startTimer() {
    callTime = setInterval(timer, 1000);
    return;
}

//grab the existing cards from the DOM
function initialDeck() {
    let existingCards = [];
    existingCards = document.querySelectorAll(".card");
    return nodeListToString(existingCards);
}

//turn the existingCards array into a string array
function nodeListToString(card) {
    let strArr = [];
    for (let img in card) {
        if (card.hasOwnProperty(img)) {
            strArr.push(card[img].innerHTML);
        }
    }
    return strArr;
}

function getCards() {
    let cardContainer = createCards();
    document.querySelector(".card-container").innerHTML = cardContainer.innerHTML;
    return;
}

function createCards() {
    //create table row and append table data(cards) to it
    let cardContainer = document.createElement("tr");
    for (let i = 0; i < shuffledCards.length; i++) {
        //create td for each card
        let td = document.createElement("td");
        td.innerHTML = shuffledCards[i];

        //add class 'card' to each
        td.classList.add("card");
        td.classList.add("hidden");
        //keep the original identifying class of the particular img, ex. 'bird' for the bird img
        td.classList.add($(shuffledCards[i]).attr("class"));
        cardContainer.appendChild(td);
    }
    return cardContainer;
}


function flipCard(card) {
    $(card).toggleClass("flip");
    $(card).toggleClass("hidden");
    return;
}

//show the number of moves taken
function displayMoves(moves) {
    let p = document.querySelector(".moves");
    p.innerHTML = `Moves Taken: ${moves}`;
    return;
}

function checkTurnedCards(card) {
    //limit currently turned cards to two
    if (turnedCards.length < 2) {
        turnedCards.push(card);
        //if there's 2 face up cards, check if they match
        if (turnedCards.length === 2) {
            checkMatch(turnedCards[0], turnedCards[1]);
            //check if all cards are matched
            if (matchingCards.length === startingCards.length) {
                gameOver = true;
                updateRatingStars();
                showWinningMsg();
            }
        }
    }
    else {
        //flip turned cards to hide them again
        flipCard(turnedCards[0]);
        flipCard(turnedCards[1]);
        turnedCards = [];
        turnedCards.push(card);
    }
    return;
}

function checkMatch(card1, card2) {
    //check if the two turned cards match
    let matching = checkClass(turnedCards[0], turnedCards[1]);
    if (matching) {
        //console.log("Cards match!");
        $(turnedCards[0]).addClass("matched");
        $(turnedCards[1]).addClass("matched");
        //add matching cards to matchingCards array
        matchingCards.push(turnedCards[0], turnedCards[1]);
        //remove matching cards from the unmatched cards 
        return turnedCards = [];
    }
    else {
        return 0;
    }
}

function checkClass(card1, card2) {
    let class1Arr = [];
    let class2Arr = [];
    //get each card's classes
    class1Arr.push($(card1).attr("class").toString());
    class2Arr.push($(card2).attr("class").toString());
    //narrow down classes to get the image's identifying class only
    let class1 = class1Arr[0].split(" ");
    let class2 = class2Arr[0].split(" ");
    class1 = class1[1];
    class2 = class2[1];
    //return true if card images match
    if (class1 == class2) {
        return true;
    }
    else {
        return false;
    }
}

function showWinningMsg() {
    let stars = document.querySelector(".star-container").innerHTML;
    let time = timer();

    $(".winning-msg").toggleClass("show-msg");
    document.querySelector(".winning-time").innerHTML = `Total time taken: ${time}`;
    document.querySelector(".winning-stars").innerHTML = `Star Rating: ${stars}`;
}


function updateRatingStars() {
    //limited to 3 stars
    let starContainer = document.querySelector(".star-container");
    //depending on moves taken change the class of fa-star between an empty and colored star
    if (moves <= 22) {
        // three stars
        starContainer.innerHTML = "<i class='fa fa-star'> </i><i class='fa fa-star'> </i><i class='fa fa-star'> </i>";
    } else if (moves > 22 && moves < 46) {
        // two stars
        starContainer.innerHTML = "<i class='fa fa-star'> </i><i class='fa fa-star'> </i><i class='far fa-star'> </i>";
    } else{
        // one star
        starContainer.innerHTML = "<i class='fa fa-star'> </i><i class='far fa-star'> </i><i class='far fa-star'> </i>";
    }
}

function timer() {
    let p = document.querySelector(".timer");
    let output;

    if (gameOver) {
        //stop timer
        clearInterval(callTime);
    }
    sec += 1;
    if (sec === 60) {
        min += 1;
        sec = 0;
    }
    //add leading zeros
    if (sec < 10 && min < 10) {
        output = `0${min}: 0${sec}`;
    } else if (sec < 10) {
        output = `${min}: 0${sec}`;
    } else if (min < 10) {
        output = `0${min}: ${sec}`;
    } else {
        output = `${min}:${sec}`;
    }
    p.innerHTML = `Time: ${output}`;
    return output;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

$(".replay").click(function replay() {
    location.reload();
});



