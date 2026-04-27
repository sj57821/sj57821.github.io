let map;
let pieces = [];
let boardPieces = new Array(16).fill(null);
const gridSize = 4;
 
window.addEventListener('load', () => {
    initMap();
    setupButtons();
    requestNotificationPermission();
});
 
function initMap() {
    map = L.map('map').setView([52.2297, 21.0122], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}
 
function setupButtons() {
    document.getElementById('getLocationBtn').onclick = getMyLocation;
    document.getElementById('exportMapBtn').onclick = exportMap;
    document.getElementById('resetBtn').onclick = resetGame;
}
 
function getMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 14);
        L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map);
    });
}
 
function exportMap() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const url = `https://tile.openstreetmap.org/${zoom}/${Math.floor((center.lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png`;
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 400, 400);
        
        // Podgląd
        let preview = document.getElementById('previewCanvas');
        if (!preview) {
            const previewDiv = document.createElement('div');
            previewDiv.innerHTML = '<h3>🖼️ Podgląd oryginalnej mapy</h3><canvas id="previewCanvas" width="200" height="200" style="border:1px solid green; margin-bottom:10px;"></canvas>';
            document.getElementById('board-area').before(previewDiv);
            preview = document.getElementById('previewCanvas');
        }
        const previewCtx = preview.getContext('2d');
        previewCtx.drawImage(img, 0, 0, 200, 200);
        
        splitIntoTiles(canvas);
    };
    img.onerror = function() {
        alert("Nie udało się pobrać mapy. Spróbuj ponownie.");
    };
    img.src = url;
}
 
function splitIntoTiles(imageCanvas) {
    const tileSize = 100;
    pieces = [];
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const tileCanvas = document.createElement('canvas');
            tileCanvas.width = tileSize;
            tileCanvas.height = tileSize;
            const tileCtx = tileCanvas.getContext('2d');
            tileCtx.drawImage(imageCanvas, col * tileSize, row * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);
            
            // Numerki pomocnicze
            tileCtx.fillStyle = 'rgba(0,0,0,0.7)';
            tileCtx.fillRect(0, 0, 40, 25);
            tileCtx.fillStyle = 'white';
            tileCtx.font = 'bold 14px Arial';
            tileCtx.fillText(`${row},${col}`, 5, 18);
            
            pieces.push({
                id: row * 4 + col,
                correctRow: row,
                correctCol: col,
                img: tileCanvas
            });
        }
    }
    
    // Mieszanie
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    
    boardPieces = new Array(16).fill(null);
    render();
}
 
function render() {
    const puzzleContainer = document.getElementById('puzzle-pieces');
    const boardContainer = document.getElementById('board');
    puzzleContainer.innerHTML = '';
    boardContainer.innerHTML = '';
    
    // Lewa strona - rozsypane puzzle
    pieces.forEach(piece => {
        const div = document.createElement('div');
        div.className = 'puzzle-piece';
        div.draggable = true;
        div.appendChild(piece.img);
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', piece.id);
        });
        puzzleContainer.appendChild(div);
    });
    
    // Prawa strona - plansza z możliwością wyjęcia puzzla
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'puzzle-piece';
        cell.setAttribute('data-index', i);
        
        if (boardPieces[i] !== null) {
            cell.appendChild(boardPieces[i].img);
            // DODANE: kliknięcie prawym przyciskiem = usuń puzzla z planszy
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const index = parseInt(cell.getAttribute('data-index'));
                const piece = boardPieces[index];
                if (piece) {
                    // Usuń z planszy i wróć do rozsypanych
                    boardPieces[index] = null;
                    pieces.push(piece);
                    render();
                    checkWin();
                }
            });
        } else {
            cell.innerHTML = '⬜';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontSize = '40px';
        }
        
        cell.addEventListener('dragover', (e) => e.preventDefault());
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetIndex = parseInt(cell.getAttribute('data-index'));
            const pieceId = parseInt(e.dataTransfer.getData('text/plain'));
            const piece = pieces.find(p => p.id === pieceId);
            
            if (!piece || boardPieces[targetIndex] !== null) return;
            
            boardPieces[targetIndex] = piece;
            pieces = pieces.filter(p => p.id !== pieceId);
            render();
            checkWin();
        });
        
        boardContainer.appendChild(cell);
    }
}
 
function checkWin() {
    let allCorrect = true;
    for (let i = 0; i < 16; i++) {
        if (boardPieces[i] === null) {
            allCorrect = false;
            break;
        }
        const expectedId = boardPieces[i].correctRow * 4 + boardPieces[i].correctCol;
        if (expectedId !== i) {
            allCorrect = false;
        }
    }
    
    const msgDiv = document.getElementById('message');
    if (allCorrect && boardPieces.every(p => p !== null)) {
        msgDiv.innerHTML = '🎉 GRATULACJE! Ułożyłeś wszystkie puzzle! 🎉';
        showNotification();
    } else {
        msgDiv.innerHTML = '';
    }
}
 
function showNotification() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
        new Notification("🎉 Gratulacje!", { body: "Ułożyłeś wszystkie puzzle!" });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}
 
function requestNotificationPermission() {
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
}
 
function resetGame() {
    exportMap();
    const msgDiv = document.getElementById('message');
    if (msgDiv) msgDiv.innerHTML = '';
}