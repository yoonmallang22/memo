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

    memo.setAttribute("class", allMemo[i - 1].len);
    memo.setAttribute("onclick", "modify()");
    saveContent.innerHTML = allMemo[i - 1].content;
    saveContent.setAttribute("class", "content");
    saveTime.textContent = allMemo[i - 1].time.slice(0, -3);
    saveTime.setAttribute("class", "time");

    display.appendChild(memo);
    memo.appendChild(saveTime);
    memo.appendChild(saveContent);
  }
}

// 선택한 글 수정하기
function modify() {
  document.querySelector("#display").addEventListener("click", (event) => {
    // console.log(event.target);

    // 선택한 글 불러오기
    if (allMemo !== []) {
      editor.setHTML(event.target.querySelector(".content").innerHTML);
    }

    // 선택한 글 배경색 주기
    // 수정 필요: 선택한 것만 색상 바뀌게
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

// 선택한 글 삭제하기
document.getElementById("delete").addEventListener("click", remove);

function remove() {
  if (confirm("삭제하시겠습니까?")) {
    modify();
  }

  localStorage.setItem("allMemo", JSON.stringify(allMemo));

  render();

  // 삭제 버튼 누를 때마다 +1
  // 추가한 글 len 겹치지 않게 하기 위해
  num++;
}

// 에디터 초기화
document.getElementById("reset").addEventListener("click", () => {
  editor.setHTML("");
});
