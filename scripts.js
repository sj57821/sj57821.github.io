class Todo {
    constructor() {
        this.tasks = [];
        this.searchTerm = "";
        
        this.list = document.getElementById("todoList");
        this.searchInput = document.getElementById("searchInput");
        this.nameInput = document.getElementById("taskName");
        this.dateInput = document.getElementById("taskDeadline");
        
        document.getElementById("addBtn").onclick = () => this.add();
        
        this.searchInput.oninput = (e) => {
            this.searchTerm = e.target.value;
            this.draw();
        };
        
        const saved = localStorage.getItem("todoTasks");
        if (saved) {
            this.tasks = JSON.parse(saved);
        }
        
        this.draw();
    }
    
    saveToLocal() {
        localStorage.setItem("todoTasks", JSON.stringify(this.tasks));
    }
    
    add() {
        let name = this.nameInput.value.trim();
        let deadline = this.dateInput.value;
        
        if (name.length < 3 || name.length > 255) {
            alert("Zadanie musi mieć 3-255 znaków");
            return;
        }
        
        if (deadline && new Date(deadline) <= new Date()) {
            alert("Data musi być w przyszłości");
            return;
        }
        
        this.tasks.push({
            id: Date.now(),
            name: name,
            deadline: deadline
        });
        
        this.nameInput.value = "";
        this.dateInput.value = "";
        
        this.saveToLocal();
        this.draw();
    }
    
    delete(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocal();
        this.draw();
    }
    
    draw() {
        this.list.innerHTML = "";
        
        let filtered = this.tasks;
        if (this.searchTerm.length >= 2) {
            filtered = this.tasks.filter(task => 
                task.name.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
        
        filtered.forEach(task => {
            let li = document.createElement("li");
            
            let text = task.name;
            if (this.searchTerm.length >= 2) {
                let regex = new RegExp(this.searchTerm, "gi");
                text = text.replace(regex, match => `<mark>${match}</mark>`);
            }
            
            if (task.deadline) {
                text += ` (do: ${task.deadline.replace("T", " ")})`;
            }
            
            li.innerHTML = text;
            
            let delBtn = document.createElement("button");
            delBtn.textContent = "Usuń";
            delBtn.className = "deleteBtn";
            delBtn.onclick = (e) => {
                e.stopPropagation();
                this.delete(task.id);
            };
            li.appendChild(delBtn);
            
            li.onclick = (e) => {
                if (e.target === delBtn) return;
                this.edit(task.id, li);
            };
            
            this.list.appendChild(li);
        });
    }
    
    edit(id, liElement) {
        let task = this.tasks.find(t => t.id === id);
        if (!task) return;
        
        let nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = task.name;
        nameInput.style.width = "200px";
        
        let dateInput = document.createElement("input");
        dateInput.type = "datetime-local";
        dateInput.value = task.deadline || "";
        
        let saveBtn = document.createElement("button");
        saveBtn.textContent = "Zapisz";
        
        let saveChanges = () => {
            let newName = nameInput.value.trim();
            let newDate = dateInput.value;
            
            if (newName.length < 3 || newName.length > 255) {
                alert("Zadanie musi mieć 3-255 znaków");
                return;
            }
            
            if (newDate && new Date(newDate) <= new Date()) {
                alert("Data musi być w przyszłości");
                return;
            }
            
            task.name = newName;
            task.deadline = newDate;
            
            this.saveToLocal();
            this.draw();
        };
        
        saveBtn.onclick = (e) => {
            e.stopPropagation();
            saveChanges();
        };
        
        liElement.innerHTML = "";
        liElement.appendChild(nameInput);
        liElement.appendChild(document.createTextNode(" "));
        liElement.appendChild(dateInput);
        liElement.appendChild(document.createTextNode(" "));
        liElement.appendChild(saveBtn);
        
        nameInput.focus();
    }
}

new Todo();