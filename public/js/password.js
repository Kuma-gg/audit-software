(function () {
    var socket = io("/password");
    var inputMaximum = document.getElementById("inputMaximum");
    var inputMinimum = document.getElementById("inputMinimum");
    var inputPasswordExpiration = document.getElementById("inputPasswordExpiration");
    var checkUppercase = document.getElementById("checkUppercase");
    var checkLowercase = document.getElementById("checkLowercase");
    var checkNumber = document.getElementById("checkNumber");
    var checkSpace = document.getElementById("checkSpace");
    var buttonSubmit = document.getElementById("buttonSubmit");

    buttonSubmit.addEventListener("click", () => {
        socket.emit("update", getForm());
    });

    function getForm() {
        return {
            maximumCharacters: inputMaximum.value,
            minimumCharacters: inputMinimum.value,
            passwordExpiration: inputPasswordExpiration.value,
            hasUppercase: checkUppercase.value,
            hasLowercase: checkLowercase.value,
            hasNumber: checkNumber.value,
            hasSpace: checkSpace.value
        };
    }

    socket.on("updated", (object) => {

    });
})();