const csvFile = process.argv[2];

fs = require("fs");

fs.readFile(csvFile, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }

  //console.log(data);
  const unpivotted = unpivot(parseTable(data));
  unpivotted
    .sort((x, y) => {
      const r0 = cmp(x[0],y[0]);
      const numCell = (c) => Number(c.replace(",", "."));
      const r1 = cmp(numCell(x[1]),numCell(y[1]));
      return r0 || r1;
    })
    .map((a) => a.join("\t"))
    .forEach((x) => console.log(x));
});

function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function parseTable(dataStr) {
  const lines = dataStr
    .replace(/\./g, ",")
    .split(/\r?\n/)
    .map((line) => line.split(";"));
  const [headerWithCorner, ...dataLines] = lines;
  const [cornerCell, ...headerX] = headerWithCorner;
  const headerY = dataLines.map((dataLine) => dataLine[0]);
  const data = dataLines.map((dataLine) => dataLine.slice(1));
  return { headerX, headerY, data };
}
function unpivot({ headerX, headerY, data }) {
  return map2D(data, function (cell, rowIdx, colIdx) {
    return cell ? [headerX[colIdx], headerY[rowIdx], cell] : null;
  }).filter(Boolean);
}
function map2D(a, fn) {
  const res = [];
  a.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      res.push(fn(cell, rowIdx, colIdx));
    });
  });
  return res;
}
