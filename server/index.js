const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // To serve the generated PDF

app.post('/generate', (req, res) => {
  const data = req.body;

  const doc = new PDFDocument();
  const filename = 'Resume_${Date.now()}.pdf';
  const filePath = path.join(__dirname, filename);

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // ===== Resume Content =====
  doc.fontSize(22).text(data.name, { underline: true });
  doc.fontSize(14).text(data.email);
  doc.moveDown();

  doc.fontSize(16).text("Summary", { underline: true });
  doc.fontSize(12).text(data.summary);
  doc.moveDown();

  doc.fontSize(16).text("Education", { underline: true });
  doc.fontSize(12).text(data.education);
  doc.moveDown();

  doc.fontSize(16).text("Experience", { underline: true });
  doc.fontSize(12).text(data.experience);
  doc.moveDown();

  doc.fontSize(16).text("Skills", { underline: true });
  doc.fontSize(12).text(data.skills);
  doc.end();

  writeStream.on('finish', () => {
    res.json({ message: '✅ Resume created successfully!', file: filename });
  });

  writeStream.on('error', (err) => {
    console.error(err);
    res.status(500).json({ message: '❌ Error creating resume.' });
  });
});

app.listen(PORT, () => {
  console.log(🚀 Server is running on http://localhost:${PORT});
});