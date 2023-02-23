const fileLinks = document.getElementsByClassName("js-button-file-download");
for (const fileLink of fileLinks) {
    fileLink.addEventListener("click", function() {
        fileLink.parentNode.submit();
    });
}