var modals = document.querySelectorAll(".modal");
var datepickers = document.querySelectorAll(".datepicker");
var navs = document.querySelectorAll(".sidenav");
var drops = document.querySelectorAll(".dropdown-trigger");
var selects = document.querySelectorAll("select");
(function () {
    M.Modal.init(modals);
    M.Sidenav.init(navs, {});
    M.Datepicker.init(datepickers, { format: "dd/mm/yyyy", maxDate: new Date(), container: document.body });
    M.Dropdown.init(drops, { constrainWidth: false });
    M.FormSelect.init(selects);
})();