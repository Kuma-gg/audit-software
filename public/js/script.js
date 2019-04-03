var modals = document.querySelectorAll(".modal");
var datepickers = document.querySelectorAll(".datepicker");
var navs = document.querySelectorAll(".sidenav");
var drops = document.querySelectorAll(".dropdown-trigger");
var selects = document.querySelectorAll("select");
var timepickers = document.querySelectorAll(".timepicker");
(function () {
    M.Modal.init(modals);
    M.Sidenav.init(navs, {});
    datepickers.forEach((datepicker) => {
        M.Datepicker.init(datepicker, {
            format: "dd/mm/yyyy",
            minDate: (datepicker.dataset.min) ? new Date(datepicker.dataset.min) : null,
            maxDate: (datepicker.dataset.max) ? new Date(datepicker.dataset.max) : null,
            container: document.body
        });
    });
    //M.Datepicker.init(datepickers, { format: "dd/mm/yyyy", maxDate: new Date(), container: document.body });
    M.Dropdown.init(drops, { constrainWidth: false });
    M.FormSelect.init(selects);
    M.Timepicker.init(timepickers, { twelveHour: false });
})();