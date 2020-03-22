
function removeLoadingHtml() {
    $('#Loading').remove();
    $('#progressBar').remove();
}


function getPrivateLink() {
    return "";
}


function createGameHtml() {

    $('#Menu').remove();
    $('#Main').html("<div id=cr-stage></div>");

}


function restart() {
    location.reload(false);
}

function toLobby() {
    window.location.href += "../";
}

