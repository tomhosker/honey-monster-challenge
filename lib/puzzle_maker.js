/*
This code defines a class which generates our polygon problem.
*/

// Imports.
const WORD_LIST = require("./word_list.js");

// Local constants.
const MAX_WORD_LENGTH = 8
const MIN_WORD_LENGTH = 4
const MIN_OTHER_WORDS = 4

// The class in question.
class PuzzleMaker {
    constructor(){
        this.wordArbiter = new WordArbiter();
        this.polygon = this.makePolygon();
    }

    // Make a suitable polygon object.
    makePolygon(){
        const maxLengthWord = this.wordArbiter.getRandomMaxLengthWord();
        const decomposition = PuzzleMaker.decomposeWord(maxLengthWord);
        const result =
            new Polygon(
                decomposition[0], decomposition.slice(1), maxLengthWord
            );

        if(result.otherWords.length >= MIN_OTHER_WORDS) return result;

        return this.makePolygon();
    }

    // Decompose a word into a list of its letters, and scramble that list.
    static decomposeWord(word){
        let result = [];

        for(let i = 0; i < word.length; i++) {
            result.push(word[i]);
        }

        result = PuzzleMaker.shuffle(result);
        return result;
    }

    // Re-arrange the elements in an array randomly.
    static shuffle(array) {
        let randomIndex;
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random()*currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}

// A class to decide what is and isn't a word.
class WordArbiter {
    constructor() {
        this.wordSet = new Set(WORD_LIST);
    }

    // Decide whether a given string is a valid word.
    isAWord(stringOfLetters) {
        if (this.wordSet.has(stringOfLetters)) return true;
        return false;
    }

    // Get a random word from the set.
    getRandomWord() {
        let result = WORD_LIST[Math.floor(Math.random()*WORD_LIST.length)];

        return result;
    }

    // Get a random word from the set of our maximum length.
    getRandomMaxLengthWord() {
        let result = "";

        while (result.length !== MAX_WORD_LENGTH) result = this.getRandomWord();

        return result
    }
}

// The class in question.
class Polygon {
    constructor(innerLetter, outerLetters, maxLetterWord) {
        this.innerLetter = innerLetter;
        this.outerLetters = outerLetters;
        this.maxLetterWord = maxLetterWord;
        this.wordArbiter = new WordArbiter();
        this.otherWords = this.getOtherWords();
    }

    // Get a list of all the shorter words which also meet our requirements.
    getOtherWords() {
        let combinations, permutations, candidate, result;
        let wordSet = new Set();

        combinations = getCombinations(stringToLetterArray(this.maxLetterWord));
        for (let i = 0; i < combinations.length; i++) {
            permutations = getPermutations(combinations[i]);
            for (let j = 0; j < permutations.length; j++) {
                candidate = letterArrayToString(permutations[j]);
                if (
                    candidate.length > MIN_WORD_LENGTH &&
                    candidate.indexOf(this.innerLetter) >= 0 &&
                    this.wordArbiter.isAWord(candidate)
                ) {
                    wordSet.add(candidate);
                }
            }
        }
        result = Array.from(wordSet);
        result.sort();

        return result;
    }
}

/**********************
 ** HELPER FUNCTIONS **
 *********************/

// Ronseal.
function letterArrayToString(letterArray) {
    let result = "";

    for (let i = 0; i < letterArray.length; i++) {
        result = result+letterArray[i];
    }

    return result;
}

// Ronseal.
function stringToLetterArray(string) {
    let result = [];

    for (let i = 0; i < string.length; i++) {
        result.push(string[i]);
    }

    return result;
}

// Get the combinations, in the mathematical sense of the word, from an array.
function getCombinations(valuesArray) {
    let combi = [];
    let temp = [];
    let slent = Math.pow(2, valuesArray.length);

    for (let i = 0; i < slent; i++) {
        temp = [];
        for (var j = 0; j < valuesArray.length; j++) {
            if ((i & Math.pow(2, j))) {
                temp.push(valuesArray[j]);
            }
        }
        if (temp.length > 0) combi.push(temp);
    }

    return combi;
}

// Get the permutations, in the mathematical sense of the word, from an array.
function getPermutations(valuesArray) {
    let length = valuesArray.length,
        result = [valuesArray.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = valuesArray[i];
            valuesArray[i] = valuesArray[k];
            valuesArray[k] = p;
            ++c[i];
            i = 1;
            result.push(valuesArray.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }

    return result;
}

module.exports = PuzzleMaker
