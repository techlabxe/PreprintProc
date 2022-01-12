const { PDFDocument, StandardFonts, rgb, PageSizes } = require('pdf-lib');
const fontKit = require('@pdf-lib/fontkit')
const fs = require('fs');

const frontCover = process.argv[2];
const body = process.argv[3];
const backCover = process.argv[4];
const output = process.argv[5];

run(frontCover, body, backCover, output).catch(err => console.log(err));

//隠しノンブル開始番号
const PAGE_START=3;
// 用紙サイズは自動判定.
// もしトンボデータ、裁ち落としなど使用時には、その分をMARGINに指定のこと.
const MARGIN = 0.5;

function mmToPt(mm) {
  return mm * 2.83465;
}

function DetectSize(width, height) {
  if ( PageSizes.A5[0] == width && PageSizes.A5[1] == height ) {
    return { width: PageSizes.A5[0], height: PageSizes.A5[1] };
  }
  // B5 の規定は日本と海外で違うため、既に定義されているものは使えない.
  const B5jp = { width: 515.91, height: 728.50 };
  if ( B5jp.width == width && B5jp.height == height ) {
    return { width: B5jp.width, height: B5jp.height };
  }
  console.error("cannot detect.");
  return { width: width, height: height };
}

async function setImageIntoPage(doc, page, fileName, size) {
  const imagePng = await doc.embedPng(fs.readFileSync(fileName));
  page.drawImage(
    imagePng, {
      x: 0,
      y: 0,
      width: size[0],
      height: size[1]
    }
  );
}

async function run(frontCover, body, backCover, outputPdf) {
  const base = await PDFDocument.load(fs.readFileSync(body));
  const doc = await PDFDocument.create();

  doc.registerFontkit(fontKit);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const firstPage = await base.getPages()[0];
  const { width, height } = firstPage.getSize();
  const pageSize = DetectSize(width, height);

  // 前後に表紙ページを追加.
  const size = [pageSize.width, pageSize.height];
  const frontPage = base.insertPage(0, [pageSize.width, pageSize.height]);
  const backPage = base.insertPage(base.getPageCount(), [pageSize.width, pageSize.height]);
  setImageIntoPage(base, frontPage, frontCover, size);
  setImageIntoPage(base, backPage, backCover, size);

  // Write the PDF to a file
  fs.writeFileSync(outputPdf, await base.save());
}