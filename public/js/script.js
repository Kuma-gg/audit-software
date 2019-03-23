(function() {
    var modals = document.querySelectorAll('.modal');
    var datepickers = document.querySelectorAll('.datepicker');
    var navs = document.querySelectorAll('.sidenav');
    M.Modal.init(modals);
    M.Sidenav.init(navs, {});
    M.Datepicker.init(datepickers, {format: 'dd/mm/yyyy', maxDate: new Date(), container: document.body});
})();