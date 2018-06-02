/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: HoGyeong Leo Cho    Student ID: 144561164    Date: May 31st, 2018
*
*
********************************************************************************/

$(function () {

let employeesModel = [];

function initializeEmployeesModel() {
    $.ajax({
        url: "https://afternoon-mesa-10925.herokuapp.com/employees",
        type: "GET",
        contentType: "application/json"
    })
        .done(function (data) {
            employeesModel = _.take(data, 300);
            refreshEmployeeRows(employeesModel);
            //console.log("done");
        })
        .fail(function () {
            showGenericModal('Error', 'Unable to get Employees');
        });

};

function showGenericModal(title, msg) {
    $(".modal-title").empty().html(title);
    $(".modal-body").empty().html(msg);
    $('#genericModal').modal("show");
};

function refreshEmployeeRows(employees) {
    let lodashplate = _.template(
        '<% _.forEach(employees, function(employee) { %>' +
        '<div class="row body-row" data-id=<%- employee._id %>>' +
        '<div class="col-xs-4 body-column"><%- employee.FirstName %></div>' +
        '<div class="col-xs-4 body-column"><%- employee.LastName %></div>' +
        '<div class="col-xs-4 body-column"><%- employee.Position.PositionName %></div>' +
        '</div>' +
        '<% }); %>');
    $("#employees-table").empty();
    $("#employees-table").html(lodashplate({'employees': employees}));

};

function getFilteredEmployeesModel(filterString) {
    let filteredEmployees = _.filter(employeesModel, function (emp) {
        if (emp.FirstName.toLowerCase().includes(filterString.toLowerCase())
            || emp.LastName.toLowerCase().includes(filterString.toLowerCase())
            || emp.Position.PositionName.toLowerCase().includes(filterString.toLowerCase())) {
            return employeesModel;
        };
    });
    return filteredEmployees;
};

function getEmployeeModelById(id) {
    let index = _.findIndex(employeesModel,function(e){
         return e._id === id;
    });

    if (index != -1) {
        return _.cloneDeep(employeesModel[index]);
    } else {
        return null;
    }
 };




    initializeEmployeesModel();

    $('#employee-search').keyup(function () {
        let filteredData = getFilteredEmployeesModel($('#employee-search').val());
        refreshEmployeeRows(filteredData);
    });


    $(".bootstrap-header-table").on("click", ".body-row", function (){
        //let copy = _.cloneDeep(employeesModel[3]);
        let selected = getEmployeeModelById($(this).attr("data-id"));
        let modalplate = _.template(
            '<strong>Address:</strong> <%- employee.AddressStreet %> <%- employee.AddressCity %> <%- employee.AddressState %> <%- employee.AddressZip %><br>' +
            '<strong>Phone Number:</strong> <%-employee.PhoneNum %><br>' +
            '<strong>Hire Date:</strong> <%- employee.HireDate %>');
        formatdate = moment(selected.HireDate).format("LL");
        selected.HireDate = formatdate;
        showGenericModal(selected.FirstName + " " + selected.LastName, modalplate({ 'employee': selected }));
    });

    $("#teams-menu").on("click", function (event) {
        event.preventDefault();

        $.ajax({
            url: "https://afternoon-mesa-10925.herokuapp.com/teams",
            type: "GET",
            contentType: "application/json"
        })
            .done(function (data) {
                $("#data").empty().html("<h3>Teams</h3>").append(JSON.stringify(data));
            });
    });

    $("#employees-menu").on("click", function (event) {
        event.preventDefault();

        $.ajax({
            url: "https://afternoon-mesa-10925.herokuapp.com/employees",
            type: "GET",
            contentType: "application/json"
        })
            .done(function (data) {
                $("#data").empty().html("<h3>Employees</h3>").append(JSON.stringify(data));
            });
    });

    $("#projects-menu").on("click", function (event) {
        event.preventDefault();

        $.ajax({
            url: "https://afternoon-mesa-10925.herokuapp.com/projects",
            type: "GET",
            contentType: "application/json"
        })
            .done(function (data) {
                $("#data").empty().html("<h3>Projects</h3>").append(JSON.stringify(data));
            });
    });

    $("#positions-menu").on("click", function (event) {
        event.preventDefault();

        $.ajax({
            url: "https://afternoon-mesa-10925.herokuapp.com/positions",
            type: "GET",
            contentType: "application/json"
        })
            .done(function (data) {
                $("#data").empty().html("<h3>Positions</h3>").append(JSON.stringify(data));
            });
    });


});
