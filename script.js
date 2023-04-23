let allMemo = JSON.parse(localStorage.getItem("allMemo"));
allMemo = allMemo ?? [];

// Toast UI Editor
const Editor = toastui.Editor;

const editor = new Editor({
  el: document.querySelector("#editor"),
  height: "90vh",
  initialEditType: "markdown",
  previewStyle: "vertical",
  placeholder: "새로운 메모",
  toolbarItems: [
    ["heading", "bold", "italic", "strike"],
    ["hr", "quote"],
    ["ul", "ol", "task", "indent", "outdent"],
    ["table", "image", "link"],
    ["code", "codeblock"],
  ],
});

render();

let num = 0;
document.getElementById("save").addEventListener("click", saveNote);

function saveNote() {
  const content = editor.getHTML();
  const d = new Date();

  allMemo.push({ content, time: d.toLocaleString("ko-KR"), len: num + 1 });

  localStorage.setItem("allMemo", JSON.stringify(allMemo));

  render();

  // 메모 버튼 누를 때마다 +1
  // 수정한 글 len 겹치지 않게 하기 위해
  num++;
}

function render() {
  const display = document.getElementById("display");
  display.innerHTML = "";

  // 최신 게시물이 위로 올라오도록
  for (let i = allMemo.length; i > 0; i--) {
    const memo = document.createElement("article");
    const saveContent = document.createElement("div");
    const saveTime = document.createElement("p");
    const deleteMemoBtn = document.createElement("button");

    memo.setAttribute("class", allMemo[i - 1].len);
    memo.setAttribute("onclick", "modify()");
    saveContent.innerHTML = allMemo[i - 1].content;
    saveContent.setAttribute("class", "content");
    saveTime.textContent = allMemo[i - 1].time.slice(0, -3);
    saveTime.setAttribute("class", "time");
    deleteMemoBtn.textContent = "삭제";
    deleteMemoBtn.setAttribute("class", allMemo[i - 1].len);
    deleteMemoBtn.setAttribute("onclick", "remove()");

    display.appendChild(memo);
    memo.appendChild(saveTime);
    memo.appendChild(saveContent);
    display.appendChild(deleteMemoBtn);
  }
}

function remove() {
  // 없으면 undefined
  const idx = allMemo.find((item) => event.target.classList.contains(item.len));

  if (idx) {
    if (confirm("삭제하시겠습니까?")) {
      allMemo.splice(
        allMemo.findIndex((item) => item.len == idx.len),
        1
      );
    }
  }

  localStorage.setItem("allMemo", JSON.stringify(allMemo));

  render();
}

// 글 선택해서 수정 가능하게
function modify() {
  document.querySelector("#display").addEventListener("click", (event) => {
    // console.log(event.target);

    // 선택한 글 불러오기
    editor.setHTML(event.target.querySelector(".content").innerHTML);

    // 선택한 글 배경색 주기
    document.querySelectorAll("article").forEach((item) => (item.style.background = "none"));
    event.target.style.background = "#fbe49b";
    document.querySelector("#display").style.background = "none";

    const idx = allMemo.find((item) => event.target.classList.contains(item.len));

    // 삭제하고 saveNote()로 추가해서 위로 올라가게
    if (idx) {
      allMemo.splice(
        allMemo.findIndex((item) => item.len == idx.len),
        1
      );
    }
  });
}

// 에디터 초기화
document.getElementById("reset").addEventListener("click", () => {
  editor.setHTML("");
});
