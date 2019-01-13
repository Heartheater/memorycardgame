"use strict";

//get the starting cards from the DOM
let cardDeck = getDOMCards();
//shuffle the deck
shuffle(cardDeck);
//put the shuffled cards back into the DOM
replaceCardsInDOM();


//This grabs all existing cards from the DOM and creates an array of them
function getDOMCards() {
    const allDOMCards = document.querySelectorAll(".card");
    //since the cards were taken from the DOM, they are all Node elements
    //and need to be converted into string data types to use them
    return nodeListToString(allDOMCards);
}

//turns a NodeList into an array of strings
function nodeListToString(nodeList) {
    let strArr = [];
    //make sure the nodeList is an array, then map through each node to extract the innerHTML
    Array.from(nodeList).map(node => {
        //put the node's innerHTML into strArr
       return strArr.push(node.innerHTML);
    });
    return strArr;
}

// Shuffle function from http://stackoverflow.com/a/2450976
// this will alter the array that's passed to it
function shuffle(array) {
    //set current index to the last element
    let currentIndex = array.length - 1;
    let lastIndex, randomIndex;

    //loops through array backwards until reaching zero
    while (currentIndex > 0) {
        //generate a random number
        randomIndex = Math.floor(Math.random() * currentIndex);

        currentIndex -= 1;

        //store the currentIndex temporarily
        lastIndex = array[currentIndex];

        //then swap the currentIndex element with the randomIndex
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = lastIndex;
    }
}

//this converts the array of cards (cardDeck) back into DOM elements
function convertCards() {
    //cardContainer will hold all the cards
    //it's a table row element that we'll append each card (table data) to
    let cardContainer = document.createElement("tr");

    for (let i = 0; i < cardDeck.length; i++) {
        //create a table data element for each card
        let card = document.createElement("td");
        card.innerHTML = cardDeck[i];

        //add class 'card' to each
        card.classList.add("card");
        card.classList.add("hidden");
        //keep the original identifying class of the particular img, ex. 'bird' for the bird img
        card.classList.add($(cardDeck[i]).attr("class"));
        cardContainer.appendChild(card);
    }
    return cardContainer;
}

function replaceCardsInDOM() {
    const newCards = convertCards();
    //replace all the old unshuffled cards in the DOM with the newly shuffled cards
    document.querySelector(".card-container").innerHTML = newCards.innerHTML;
}


let turnedCards = [];
let matchingCards = [];
let gameOver = false;
let movesTaken = 0;
let callTime = 0;
let sec = 0;
let min = 0;

//flip cards when they're clicked
$('.card').on("click", function () {
    //Ignore if it's already flipped
    if (!($(this).hasClass("flip"))) {
        flipCard(this);
        checkTurnedCards(this);
        //each click = 1 move
        movesTaken += 1;
        displayMoves(movesTaken);
        updateRatingStars();
        //start timer when first card is clicked
        if (movesTaken === 1) {
            startTimer();
        }
    }
    return;
});



function startTimer() {
    callTime = setInterval(timer, 1000);
    return;
}


function flipCard(card) {
    $(card).toggleClass("flip");
    $(card).toggleClass("hidden");
    return;
}

//show the number of movesTaken taken
function displayMoves(movesTaken) {
    let p = document.querySelector(".moves");
    p.innerHTML = `Moves Taken: ${movesTaken}`;
    return;
}

function checkTurnedCards(card) {
    //limit currently turned cards to two
    if (turnedCards.length < 2) {
        turnedCards.push(card);
        //if there's 2 face up cards, check if they match
        if (turnedCards.length === 2) {
            testMatch(turnedCards[0], turnedCards[1]);
            //check if all cards are matched and player won
            if (matchingCards.length === cardDeck.length) {
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

function testMatch(card1, card2) {
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
//this takes two cards and checks if their class names match
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
    if (class1 === class2) {
        return true;
    }
    else {
        return false;
    }
}


function updateRatingStars() {
    //limited to 3 stars
    let starContainer = document.querySelector(".star-container");
    //depending on movesTaken taken change the class of fa-star between an empty and colored star
    if (movesTaken <= 22) {
        // three stars
        starContainer.innerHTML = "<i class='fa fa-star'> </i><i class='fa fa-star'> </i><i class='fa fa-star'> </i>";
    } else if (movesTaken > 22 && movesTaken < 46) {
        // two stars
        starContainer.innerHTML = "<i class='fa fa-star'> </i><i class='fa fa-star'> </i><i class='far fa-star'> </i>";
    } else {
        // one star
        starContainer.innerHTML = "<i class='fa fa-star'> </i><i class='far fa-star'> </i><i class='far fa-star'> </i>";
    }
}

//run timer while game is running
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


function showWinningMsg() {
    let stars = document.querySelector(".star-container").innerHTML;
    let time = timer();

    $(".winning-msg").toggleClass("show-msg");
    document.querySelector(".winning-time").innerHTML = `Total time taken: ${time}`;
    document.querySelector(".winning-stars").innerHTML = `Star Rating: ${stars}`;
}

//reload page if user clicks the replay button
document.querySelector(".replay").addEventListener("click", () => location.reload());
