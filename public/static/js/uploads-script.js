$(document).ready(function(){

    // Redirect to add.html Page when 'Add New Document' is clicked
    $("#addBtn").click(function() {
        window.location.href = "/add";
    });    

    // Show prompt when Delete Button is clicked
    $(".btn-delete").click(function() {
        window.confirm("Are you sure you want to delete this document?")
    }); 

});

