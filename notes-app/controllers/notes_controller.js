const path = require("path");
const db = require("../config/db");

// exports.upload_note = (req, res) => {
// const title = req.body.title;
// const tags = req.body.tags;
// const user_id = req.user.id;
// const file = req.file;
// const required_tags = tags.split(",");
// if (!file || !title || !tags) {
//   res.json("Missing items");
// }

// try {
//   const insert = db.prepare(
//     `INSERT INTO notes (user_id,title,filename) VALUES(?,?,?)`
//   );

//   const result = insert.run(user_id, title, file.filename);

//   const note_id = result.lastInsertRowid();
//   const tag_id_query = db.prepare(`SELECT * FROM tags WHERE tag_name = ?`);

//   let tag_ids = [];
//   for (const tag of required_tags) {
//     const row = tag_id_query.get(tag.toLowerCase());
//     if (row) {
//       tag_ids.push(row.id);
//     }
//   }

//   const link_tags = db.prepare(
//     `INSERT INTO note_tags (note_id,tag_id) VALUES (?,?)`
//   );
//   for (const tag_id of tag_ids) {
//     link_tags.run(note_id, tag_id);
//   }
//   res.status(201).json({ message: "Note uploaded successfully" });
// } catch (err) {
//   res.json(err);
// }
// };

exports.upload_note = (req, res) => {
  const title = req.body.title;
  const tags = req.body.tags;
  const user_id = req.user.id;
  const file = req.file;

  if (!file || !title || !tags) {
    return res.status(400).json({ message: "Missing file, title, or tags" });
  }

  const required_tags = tags.split(",").map((tag) => tag.trim().toLowerCase());

  try {
    const insert_note = db.prepare(
      `INSERT INTO notes (user_id, title, filename) VALUES (?, ?, ?)`
    );
    const result = insert_note.run(user_id, title, file.filename);

    const note_id = result.lastInsertRowid;

    const insert_tag = db.prepare(`INSERT INTO tags (name) VALUES (?)`);
    const tag_id_query = db.prepare(`SELECT * FROM tags WHERE name = ?`);

    let tag_ids = [];
    for (let tag of required_tags) {
      let row = tag_id_query.get(tag);
      if (!row) {
        insert_tag.run(tag);
        row = tag_id_query.get(tag);
      }
      tag_ids.push(row.id);
    }

    const link_tags = db.prepare(
      `INSERT INTO note_tags (note_id, tag_id) VALUES (?, ?)`
    );

    for (const tag_id of tag_ids) {
      link_tags.run(note_id, tag_id);
    }

    res.status(201).json({ message: "Note uploaded successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error uploading note", error: err.message });
  }
};
exports.get_all_notes = (req, res) => {
  const get_all_query = db.prepare(
    `SELECT notes.id,
      notes.title,
      notes.uploaded_at,
      users.username,
      GROUP_CONCAT(tags.name) AS tags
      FROM notes
      JOIN users ON notes.user_id = users.id
      LEFT JOIN note_tags ON notes.id = note_tags.note_id
      LEFT JOIN tags ON note_tags.tag_id = tags.id
      GROUP BY notes.id
      ORDER BY notes.uploaded_at DESC;
      `
  );
  let rows = get_all_query.all();
  res.json(rows);
};
exports.download_note = (req, res) => {
  const note_id = req.body.id;

  try {
    const note = db.prepare(`SELECT * FROM notes WHERE id = ?`).get(note_id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const filePath = path.join(__dirname, "..", "uploads", note.filename);
    res.download(filePath, note.title + path.extname(note.filename));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error downloading note" });
  }
};
