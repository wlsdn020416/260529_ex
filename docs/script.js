const titleInput = document.querySelector("#titleInput");
const contentInput = document.querySelector("#contentInput");
const savebtn = document.querySelector("#savebtn");
const memoList = document.querySelector("#memoList");
const memoViewer = document.querySelector("#memoViewer");
const addBtn = document.querySelector("#addBtn");
const modal = document.querySelector('#modal');
const cancelBtn = document.querySelector("#cancelBtn");

const STORAGE_KEY = "memo-app-v1";
const saved = localStorage.getItem(STORAGE_KEY);

addBtn.addEventListener("click",()=>{
    editingMemo = null;
    titleInput.value = "";
    contentInput.value = "";
    updateSaveButton();
    modal.classList.remove("hidden");
});
cancelBtn.addEventListener("click",()=>{
    modal.classList.add("hidden");
    titleInput.value = "";
    contentInput.value = "";
    editingMemo =null;
    updateSaveButton();
});


let memos = [];
let editingMemo = null;

if(saved){
    memos = JSON.parse(saved);
}
savebtn.addEventListener("click",() => {
    const title = titleInput.value;
    const content = contentInput.value;
    if(title.trim()===""||content.trim()===""){
        return;
    }
    if(editingMemo){
        editingMemo.title = title;
        editingMemo.content = content;

        editingMemo = null;
        updateSaveButton();
        setItem();
        renderAll();
    }else {
        const memo = {
            title : title,
            content : content
        };
        memos.unshift(memo);
        setItem();
        renderAll();
    }

    modal.classList.add("hidden");
    titleInput.value = "";
    contentInput.value = "";
});

function setItem(){
    localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(memos)
        );
}   

function renderMemo(memo){
    const li = document.createElement("li");
    li.textContent = memo.title;

    const openBtn = document.createElement("button");
    openBtn.textContent = "open";
    openBtn.addEventListener("click",()=>{
        memoViewer.textContent = memo.content;
    });
    
    const editBtn = document.createElement("button");
    editBtn.textContent = "edit";
    editBtn.addEventListener("click",()=>{
        
        titleInput.value = memo.title;
        contentInput.value = memo.content;
        modal.classList.remove("hidden");
        editingMemo = memo;
        updateSaveButton();
    })

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.addEventListener("click",() =>{
        
        memos.splice(memos.indexOf(memo),1);
        setItem();
        li.remove();
        memoViewer.textContent = "NO MEMO";
    });
    
    li.append(openBtn);
    li.append(editBtn);
    li.append(deleteBtn);
    memoList.append(li);
}

renderAll();

function renderAll(){
    memoList.innerHTML = "";
    memos.forEach((memo) => {
    renderMemo(memo);
});
}
function updateSaveButton(){
    if(editingMemo){
            savebtn.textContent = "edit";
        }else{
            savebtn.textContent = "save";
        }
}

