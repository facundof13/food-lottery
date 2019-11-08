let searchString = '';
let wheel;
let globalPlaces = [];
let pastelColorsArr = ["#17223b", "#263859", "#6b778d"];
let rating = 5;
let httpsAvail = location.protocol == 'https:'
let geoAvail = navigator.geolocation
console.log(`https: ${httpsAvail}\ngeoLocation: ${geoAvail}`)

const zipcode = document.getElementById("zipcode")
if (!httpsAvail || !geoAvail) {
    zipcode.style = 'display: block'
}

if (window.innerWidth < 500) {
    document.getElementById("canvas").width = window.innerWidth - 15;
    document.getElementById("canvas").height = window.innerWidth - 15;
} else {
    canvas.width = 500;
    canvas.height = 500;
}



function getSearchString() {
    const textBoxValue = document.getElementById("otherFoodCategory").value;
    const selectorValue = document.getElementById("selector").value;

    if (textBoxValue !== "Or another category" || textBoxValue === "") {
        searchString = textBoxValue;
    } else if (selectorValue !== null) {
        searchString = selectorValue;
    } else {
        searchString = 'food';
    }
}



async function startSearch() {
    document.getElementById('loader').style = "display: block"
    document.getElementById("searchButton").disabled = true;
    if (!httpsAvail) {
        const zip = document.getElementById('zip-box').value;
        const food = await fetch('/api/zipsearch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({zip: zip, searchString: searchString})
        })
        document.getElementById('loader').style = "display: none"
        document.getElementById("searchButton").disabled = false;
        handleResponse(food)
    }
    else if (geoAvail) {
        navigator.geolocation.getCurrentPosition(position => {
            const pos = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }
            fetch(`/api/${searchString}&${pos.lat}&${pos.long}`)
                .then(response => {
                    handleResponse(response);
                });
        });
    }
}

function handleResponse(obj) {
    obj.json().then(json => {
        let filteredPlaces = [];
        if (rating == 5) {
            makeWheel(json);
        } else {
            for (let i = 0; i < json.length; i++) {
                if (json[i].rating >= rating) {
                    filteredPlaces.push(json[i]);
                }
            }
            makeWheel(filteredPlaces);
        }
    });
}

function makeWheel(foodPlaces) {
    document.getElementById('prizepointer').style.display = 'block';
    document.getElementById('spinButton').style.display = 'block';
    document.getElementById('resetButton').style.display = 'block';
    globalPlaces = foodPlaces;

    wheel = new Winwheel({
        'textAlignment': 'center',
        'pointerAngle': 90,
        'animation': {
            'type': 'spinToStop',
            'callbackFinished': 'appendPrize()'
        }
    });
    for (let i = 0; i < foodPlaces.length; i++) {
        let newSegment = wheel.addSegment();
        newSegment.text = foodPlaces[i].name;
        newSegment.textFontSize = 10;
        newSegment.fillStyle = pastelColorsArr[i % pastelColorsArr.length];
        newSegment.textFillStyle = 'white';

    }
    wheel.deleteSegment(1);
    wheel.draw();
}

function spinWheel() {
    wheel.startAnimation();
    document.getElementById('spinButton').disabled = true;
}

function resetWheel() {
    document.getElementById('spinButton').disabled = false;
    wheel.stopAnimation(false);
    wheel.rotationAngle = 0;
    wheel.draw();

    document.getElementById("winner").innerHTML = "";
}

function appendPrize() {
    let winningSegment = wheel.getIndicatedSegment().text;
    let winningPlace;
    for (let i = 0; i < globalPlaces.length; i++) {
        if (globalPlaces[i].name === winningSegment)
            winningPlace = globalPlaces[i];
    }

    let div = document.getElementById("winner");
    console.log(winningPlace);
    div.innerHTML += `<p>${winningPlace.name} | Rating: ${winningPlace.rating}</p><p>${winningPlace.formatted_address}</p><p><a href="http://www.google.com/search?q=${winningPlace.name}" target="_blank">Find this place on Google</a>`
}

function pauseButtonSpamming(btn) {
    btn.disabled = true;
    setTimeout(() => {
        btn.disabled = false;
    }, 1000);
}

function getFilters() {
    rating = document.getElementById('starsFilter').value;
}