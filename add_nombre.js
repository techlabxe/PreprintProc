const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fontKit = require('@pdf-lib/fontkit')
const fs = require('fs');

const sourcePdf = process.argv[2];
const outputPdf = process.argv[3];

run(sourcePdf, outputPdf).catch(err => console.log(err));

//隠しノンブル開始番号
const PAGE_START=3;
// 用紙サイズは自動判定.
// もしトンボデータ、裁ち落としなど使用時には、その分をMARGINに指定のこと.
const MARGIN = 0.5;

function mmToPt(mm) {
  return mm * 2.83465;
}

async function run(sourcePdf, outputPdf) {
  const base = await PDFDocument.load(fs.readFileSync(sourcePdf));
  const doc = await PDFDocument.create();

  doc.registerFontkit(fontKit);
  const font = await doc.embedFont(StandardFonts.Helvetica);

  const pages = await doc.copyPages(base, base.getPageIndices());
  const color = rgb(0.5,0.5,0.5);

  pages.forEach( (page, i)=> {
    const pageWidth = page.getWidth();
    const num = i + PAGE_START;
    const nombre = (num + "").split("").join("\n");
    const px = [mmToPt(MARGIN), pageWidth - mmToPt(MARGIN+1.3)][i % 2];
    const py = mmToPt(50);
    const editPage = doc.addPage(page);
    editPage.drawText(nombre, { x: px, y: py, size: 7, lineHeight: 7, font: font, color: color });
  });

  // Write the PDF to a file
  fs.writeFileSync(outputPdf, await doc.save());
}