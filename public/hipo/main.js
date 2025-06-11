window.onload = () => {
    const hello = document.getElementById("hello");
    const nume = localStorage.getItem("nume");
    if (nume) {
        hello.textContent = `Bun venit ${nume}`;
    }
}