(function () {
    var socket = io("/password");
    var inputId = document.getElementById("inputId");
    var inputMaximum = document.getElementById("inputMaximum");
    var inputMinimum = document.getElementById("inputMinimum");
    var inputAttempts = document.getElementById("inputAttempts");
    var inputPasswordExpiration = document.getElementById("inputPasswordExpiration");
    var checkUppercase = document.getElementById("checkUppercase");
    var checkLowercase = document.getElementById("checkLowercase");
    var checkNumber = document.getElementById("checkNumber");
    var checkSpace = document.getElementById("checkSpace");
    var checkResetPasswordOnFirstLogin = document.getElementById("checkResetPasswordOnFirstLogin");
    var checkBirthday = document.getElementById("checkBirthday");
    var buttonSubmit = document.getElementById("buttonSubmit");

    buttonSubmit.addEventListener("click", () => {
        socket.emit("update", getForm());
    });

    function getForm() {
        return {
            id: inputId.value,
            maximumCharacters: inputMaximum.value,
            minimumCharacters: inputMinimum.value,
            attempts: inputAttempts.value,
            passwordExpiration: inputPasswordExpiration.value,
            hasUppercase: checkUppercase.checked,
            hasLowercase: checkLowercase.checked,
            hasNumber: checkNumber.checked,
            hasSpace: checkSpace.checked,
            resetPasswordOnFirstLogin: checkResetPasswordOnFirstLogin.checked,
            birthday: checkBirthday.checked
        };
    }

    socket.on("updated", (object) => {
        if (object.success) {
            M.toast({ html: "Configuration saved" });
        } else {
            M.toast({ html: "Server error" });
        }
    });
})();