const titleInput = document.querySelector("#titleInput");
const contentInput = document.querySelector("#contentInput");
const savebtn = document.querySelector("#savebtn");
const memoList = document.querySelector("#memoList");
const memoViewer = document.querySelector("#memoViewer");
const contentSection = memoViewer.parentElement;
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

        const editedMemo = editingMemo;
        editingMemo = null;
        updateSaveButton();
        setItem();
        renderAll();
        renderMemoViewer(editedMemo);
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

function renderMemoViewer(memo){
    contentSection.classList.add("memo-content-open");
    memoViewer.innerHTML = "";

    const viewerTitle = document.createElement("h3");
    viewerTitle.className = "viewer-title";
    viewerTitle.textContent = memo.title;

    const viewerDivider = document.createElement("hr");
    viewerDivider.className = "viewer-divider";

    const viewerContent = document.createElement("div");
    viewerContent.className = "viewer-content";
    viewerContent.textContent = memo.content;

    memoViewer.append(viewerTitle);
    memoViewer.append(viewerDivider);
    memoViewer.append(viewerContent);
}

function renderNoMemo(){
    contentSection.classList.remove("memo-content-open");
    memoViewer.textContent = "NO MEMO";
}

function renderMemo(memo){
    const li = document.createElement("li");
    li.addEventListener("click",()=>{
        renderMemoViewer(memo);
    });

    const memoHeader = document.createElement("div");
    memoHeader.className = "memo-header";

    const memoTitle = document.createElement("div");
    memoTitle.className = "memo-title";
    memoTitle.textContent = memo.title;

    const menuBtn = document.createElement("button");
    menuBtn.className = "memo-menu-btn";
    menuBtn.textContent = "⋮";
    menuBtn.addEventListener("click",(event)=>{
        event.stopPropagation();
        li.classList.toggle("menu-open");
        memoActions.classList.toggle("open");
    });

    const divider = document.createElement("hr");
    divider.className = "memo-divider";

    const memoActions = document.createElement("div");
    memoActions.className = "memo-actions";
    
    const editBtn = document.createElement("button");
    editBtn.textContent = "edit";
    editBtn.addEventListener("click",(event)=>{
        event.stopPropagation();
        
        titleInput.value = memo.title;
        contentInput.value = memo.content;
        modal.classList.remove("hidden");
        editingMemo = memo;
        updateSaveButton();
    })

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.addEventListener("click",(event) =>{
        event.stopPropagation();
        
        memos.splice(memos.indexOf(memo),1);
        setItem();
        li.remove();
        renderNoMemo();
    });
    
    memoActions.append(editBtn);
    memoActions.append(deleteBtn);

    memoHeader.append(memoTitle);
    memoHeader.append(menuBtn);

    li.append(memoHeader);
    li.append(divider);
    li.append(memoActions);
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
