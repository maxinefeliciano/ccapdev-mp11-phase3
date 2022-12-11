$(document).ready(function(){

    // Uploading Document
    const realFileBtn = document.getElementById("real-file");
    const uploadBox = document.getElementById("upload-box");
    const text = document.getElementById("text");
    const icon = document.getElementById("icon");
    const preview = document.getElementById("file-preview");

        // Virtually clicks the real-file button
        uploadBox.addEventListener("click", () => {
            realFileBtn.click();
        })

        // Display File Name when a file is selected
        realFileBtn.onchange = ({target}) => {
            let file = target.files[0];
            let filePath = realFileBtn.value;
            console.log("File Path: " + filePath);

            if (file) {
                let fileName = file.name;
                
                text.innerText = fileName; 
                text.style.color = "rgb(50, 50, 50)";
                text.style.fontWeight = "bold";
                icon.innerHTML = "&#xf1c1";
                icon.style.color = "rgb(227, 63, 63)";
            } 
        }

    // Redirect to add.html Page when 'Add New Document' is clicked
    $("#goBackBtn").click(function() {
        window.location.href = "/uploads";
    });    

    
    // Reload page when reset button is clicked
    $("#resetBtn").click(function() {
        location.reload();
    });

});