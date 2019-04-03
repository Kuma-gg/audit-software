(function () {
    var socket = io("/user");
    var newButton = document.getElementById("newButton");
    var updateButtons = document.getElementsByClassName("update");
    var removeButtons = document.getElementsByClassName("remove");
    var modal = M.Modal.getInstance(document.getElementById("modal"));
    var modalTitle = document.getElementById("modalTitle");
    var modalSumbit = document.getElementById("modalSubmit");
    var inputId = document.getElementById("inputId");
    var inputName = document.getElementById("inputName");
    var inputLastName = document.getElementById("inputLastName");
    var inputBirthday = document.getElementById("inputBirthday");
    var inputUsername = document.getElementById("inputUsername");
    var inputPassword = document.getElementById("inputPassword");
    var inputRepeatPassword = document.getElementById("inputRepeatPassword");
    var selectRole = document.getElementById("selectRole");
    var inputEmail = document.getElementById("inputEmail");
    var inputPasswordExpirationDate = document.getElementById("inputPasswordExpirationDate");
    var inputPasswordExpirationTime = document.getElementById("inputPasswordExpirationTime");
    var checkForceUpdatePassword = document.getElementById("checkForceUpdatePassword");
    var errorMessage = document.getElementById("errorMessage");
    var table = document.getElementById("table");
    var picker = M.Datepicker.getInstance(inputBirthday);
    var editing = false;

    newButton.addEventListener("click", () => {
        modalTitle.innerHTML = "New user";
        modalSumbit.innerHTML = "Create";
        inputId.value = "";
        inputName.value = "Miguel";
        inputLastName.value = "Miguel";
        inputBirthday.value = getLocalTimeFormat(new Date());
        inputUsername.value = "Miguel";
        inputPassword.value = "Miguel666";
        inputRepeatPassword.value = "Miguel666";
        inputEmail.value = "Miguel@gmail.com";
        inputPasswordExpirationDate.value = getLocalTimeFormat(new Date(inputPasswordExpirationDate.dataset.original));
        checkForceUpdatePassword.checked = checkForceUpdatePassword.dataset.original === "true";
        errorMessage.innerHTML = "";
        M.updateTextFields();
        editing = false;
        modal.open();
    });

    inputBirthday.addEventListener("focus", () => {
        picker.open();
    });

    modalSumbit.addEventListener("click", () => {
        if (editing) {
            socket.emit("update", getForm());
        } else {
            socket.emit("insert", getForm());
        }
    });

    for (i = 0; i < removeButtons.length; i++) {
        addRemoveListener(removeButtons[i]);
    }

    function getLocalTimeFormat(date) {
        return `${checkAndAddZero(date.getDate())}/${checkAndAddZero(date.getMonth() + 1)}/${date.getFullYear()}`;
        function checkAndAddZero(number) {
            return number < 10 ? `0${number}` : number;
        }
    };

    function addRemoveListener(ele) {
        ele.addEventListener("click", () => {
            socket.emit("remove", {
                id: ele.dataset.id
            });
        });
    }

    for (i = 0; i < updateButtons.length; i++) {
        addUpdateListener(updateButtons[i]);
    }

    function addUpdateListener(ele) {
        var data = JSON.parse(ele.dataset.object);
        ele.addEventListener("click", () => {
            modalTitle.innerHTML = "Update user";
            modalSumbit.innerHTML = "Update";
            inputId.value = data._id;
            inputName.value = data.name;
            inputLastName.value = data.lastName;
            inputBirthday.value = data.birthday;
            inputUsername.value = data.username;
            selectRole.value = data.role.id;
            inputPassword.value = "";
            inputRepeatPassword.value = "";
            inputEmail.value = data.email;
            inputPasswordExpirationDate.value = data.passwordExpirationDate;
            inputPasswordExpirationTime.value = data.passwordExpirationDate;
            checkForceUpdatePassword.checked = data.forceUpdatePassword;
            errorMessage.innerHTML = "";
            M.updateTextFields();
            M.FormSelect.init(selects);
            editing = true;
            modal.open();
        });
    }

    function getForm() {
        var birthdayTokens = inputBirthday.value.split("/");
        var passwordExpirationDateTokens = inputPasswordExpirationDate.value.split("/");
        var passwordExpirationTimeTokens = inputPasswordExpirationTime.value.split(":");
        return {
            id: inputId.value,
            name: inputName.value,
            lastName: inputLastName.value,
            birthday: new Date(birthdayTokens[2], parseInt(birthdayTokens[1]) - 1, birthdayTokens[0]),
            username: inputUsername.value,
            password: inputPassword.value,
            repeatPassword: inputRepeatPassword.value,
            roleId: selectRole.value,
            email: inputEmail.value,
            passwordExpirationDate: new Date(passwordExpirationDateTokens[2], parseInt(passwordExpirationDateTokens[1]) - 1, passwordExpirationDateTokens[0], passwordExpirationTimeTokens[0], passwordExpirationTimeTokens[1], 0, 0),
            forceUpdatePassword: checkForceUpdatePassword.checked
        };
    }

    socket.on("inserted", (object) => {
        if (object.success) {
            table.insertAdjacentHTML("beforeend", object.html);
            addUpdateListener(document.getElementById(`uptadeButton-${object.id}`));
            addRemoveListener(document.getElementById(`removeButton-${object.id}`));
            modal.close();
        } else {
            errorMessage.innerHTML = "";
            object.failedList.forEach((invalid) => {
                var li = document.createElement("li");
                li.innerHTML = invalid;
                errorMessage.appendChild(li);
            });
        }
    });

    socket.on("updated", (object) => {
        document.getElementById(`row-${object.id}`).outerHTML = object.html;
        addUpdateListener(document.getElementById(`uptadeButton-${object.id}`));
        addRemoveListener(document.getElementById(`removeButton-${object.id}`));
    });

    socket.on("removed", (object) => {
        var elem = document.getElementById(`row-${object.id}`);
        elem.parentNode.removeChild(elem);
    });
})();