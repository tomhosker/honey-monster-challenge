/*
Returns the home page.
*/

// Imports.
const express = require("express");

// Local imports.
const Finaliser = require("../lib/finaliser.js");
const PuzzleMaker = require("../lib/puzzle_maker.js");

// Constants.
const router = express.Router();
const finaliser = new Finaliser();

// GET home page.
router.get("/", function (req, res, next) {
    const puzzleMaker = new PuzzleMaker();
    const properties = {
        title: "Welcome",
        innerLetter: puzzleMaker.polygon.innerLetter,
        outerLetters: puzzleMaker.polygon.outerLetters.join(", "),
        maxLetterWord: puzzleMaker.polygon.maxLetterWord,
        otherWords: puzzleMaker.polygon.otherWords.join(", ")
    };

    finaliser.protoRender(req, res, "index", properties);
});

module.exports = router;
