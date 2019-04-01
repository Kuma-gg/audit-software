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
var errorMessage = document.getElementById("errorMessage");
var table = document.getElementById("table");
var picker = M.Datepicker.getInstance(inputBirthday);
var editing = false;

newButton.addEventListener("click", () => {
    modalTitle.innerHTML = "New user";
    modalSumbit.innerHTML = "Create";
    inputId.value = "";
    inputName.value = "";
    inputLastName.value = "";
    inputBirthday.value = "31/03/2019";
    inputUsername.value = "";
    inputPassword.value = "";
    inputRepeatPassword.value = "";
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
        selectRole.value = data.roleId;
        inputPassword.value = "";
        inputRepeatPassword.value = "";
        errorMessage.innerHTML = "";
        M.updateTextFields();
        editing = true;
        modal.open();
    });
}

function getForm() {
    var birthdayTokens = inputBirthday.value.split("/");
    return {
        id: inputId.value,
        name: inputName.value,
        lastName: inputLastName.value,
        birthday: new Date(birthdayTokens[2], parseInt(birthdayTokens[1]) - 1, birthdayTokens[0]),
        username: inputUsername.value,
        password: inputPassword.value,
        repeatPassword: inputRepeatPassword.value,
        roleId: selectRole.value
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