(function () {
    var modals = document.querySelectorAll('.modal');
    var datepickers = document.querySelectorAll('.datepicker');
    var navs = document.querySelectorAll('.sidenav');
    var drops = document.querySelectorAll('.dropdown-trigger');
    M.Modal.init(modals);
    M.Sidenav.init(navs, {});
    M.Datepicker.init(datepickers, { format: 'dd/mm/yyyy', maxDate: new Date(), container: document.body });
    M.Dropdown.init(drops, { constrainWidth: false });
})();