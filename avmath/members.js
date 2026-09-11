const MEMBERS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMzYMdtslaUeBRLxrzhV-OeutQSks9rDng5jLJIyeXcWvomhOCJXdWMOM6udSP8aWFZ3oyq0z9W062/pub?gid=1618514603&single=true&output=csv";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows;
}

async function loadMembers() {
  const list = document.querySelector("#member-list");
  const status = document.querySelector("#members-status");

  try {
    const response = await fetch(MEMBERS_CSV_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Member data request failed with status ${response.status}`);
    }

    const rows = parseCsv(await response.text())
      .slice(1)
      .filter(([name]) => name && name.trim());

    if (rows.length === 0) {
      status.textContent = "No members have joined yet.";
      return;
    }

    for (const [name, affiliation] of rows) {
      const item = document.createElement("li");
      item.textContent = affiliation?.trim()
        ? `${name.trim()}, ${affiliation.trim()}`
        : name.trim();
      list.append(item);
    }

    list.hidden = false;
    status.remove();
  } catch (error) {
    console.error(error);
    status.textContent = "The member list is temporarily unavailable.";
  }
}

loadMembers();
