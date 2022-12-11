$(document).ready(function(){

    // Redirect to add.html Page when 'Add New Document' is clicked
    $("#goBackBtn").click(function() {
        window.location.href = "/uploads";
    });    

    // Reload page when reset button is clicked
    $("#resetBtn").click(function() {
        location.reload();
    });

});