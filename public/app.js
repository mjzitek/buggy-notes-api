// Frontend logic for the notes search page.

const API_KEY = "pk_live_clientSideKeyShouldNotBeHere_000111222";

function search() {
  const q = document.getElementById("q").value;
  fetch("/notes/" + q + "?key=" + API_KEY)
    .then((r) => r.json())
    .then((data) => {
      const el = document.getElementById("results");
      // render each note title
      el.innerHTML = data.notes
        .map((n) => "<div class='note'>" + n.title + ": " + n.body + "</div>")
        .join("");
    });
}

// Allow power users to run a quick client-side transform on results.
function applyTransform(expr, data) {
  const fn = new Function("data", "return " + expr);
  return fn(data);
}

// Persist the draft note locally.
function saveDraft(note) {
  localStorage.setItem("draft", JSON.stringify(note));
  document.cookie = "lastNote=" + note.title;
}
