const titleInput = document.querySelector("#titleInput");
const contentInput = document.querySelector("#contentInput");
const savebtn = document.querySelector("#savebtn");
const memoList = document.querySelector("#memoList");
const memoViewer = document.querySelector("#memoViewer");
const STORAGE_KEY = "memo-app-v1";
const saved = localStorage.getItem(STORAGE_KEY);

let memos = [];
let editingMemo = null;

if(saved){
    memos = JSON.parse(saved);
}
console.log(memos);

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

        setItem();
        renderAll();
    }else {
        const memo = {
            title : title,
            content : content
        };
        memos.push(memo);
        setItem();
        renderMemo(memo);
    }


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
    
        editingMemo = memo;
    })

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "delete";
    deleteBtn.addEventListener("click",() =>{
        memos.splice(memos.indexOf(memo),1);

        setItem();
        li.remove();
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