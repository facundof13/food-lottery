let searchString = '';
let wheel;
let globalPlaces = [];
let pastelColorsArr = ["#17223b", "#263859", "#6b778d"]

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

    if (textBoxValue !== "Or enter another category" || textBoxValue === "") {
        searchString = textBoxValue;
    } else if (selectorValue !== null) {
        searchString = selectorValue;
    } else {
        searchString = 'food';
    }
}



function startSearch() {
    document.getElementById("searchButton").disabled = true;
    setTimeout(() => {
        document.getElementById("searchButton").disabled = false;
    }, 1000);
    if (navigator.geolocation) {
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
    } else {
        fetch(`/api/${searchString}&40.7128&74.0060`)
            .then(response => {
                handleResponse(response);
            });
    }
}

function handleResponse(obj) {
    obj.json().then(json => {
        makeWheel(json);

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
        newSegment.textFontSize = 8;
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
    div.innerHTML += `<p>${winningPlace.name}</p><p>${winningPlace.formatted_address}</p><p><a href="http://www.google.com/search?q=${winningPlace.name}" target="_blank">Find this place on Google</a>`
}

function pauseButtonSpamming(btn) {
    btn.disabled = true;
    setTimeout(() => {
        btn.disabled = false;
    }, 1000);
}