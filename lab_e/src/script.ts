const styles: { [key: string]: string } = {
    "Styl 1": "/style-1.css",
    "Styl 2": "/style-2.css",
    "Styl 3": "/style-3.css"
    
};

function loadStyle(styleName: string) {
    const oldLink = document.querySelector("head link[rel='stylesheet']");
    if (oldLink) oldLink.remove();
    
    const newLink = document.createElement("link");
    newLink.rel = "stylesheet";
    newLink.href = styles[styleName];
    document.head.appendChild(newLink);
}

// AUTOMATYCZNIE PODŁĄCZ PIERWSZY STYL
loadStyle("Styl 1");

function createButtons() {
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.backgroundColor = "white";
    panel.style.padding = "10px";
    panel.style.border = "2px solid black";
    panel.style.borderRadius = "8px";
    panel.style.zIndex = "9999";
    
    panel.innerHTML = "<strong>Wybierz styl:</strong><br>";
    
    for (const name in styles) {
        const btn = document.createElement("button");
        btn.textContent = name;
        btn.style.margin = "5px";
        btn.style.padding = "5px 10px";
        btn.onclick = () => loadStyle(name);
        panel.appendChild(btn);
    }
    
    document.body.appendChild(panel);
}

createButtons();