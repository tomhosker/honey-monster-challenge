/*
This is a front end script which defines a function which shows/hides elements.
*/

// Local constants.
ELEMENT_ID = "show-hide"

// The function in question
function showHide() {
    let element = document.getElementById(ELEMENT_ID);

    if (element.style.display === "none") element.style.display = "block";
    else element.style.display = "none";
}
