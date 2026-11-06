const fs = require("fs");
const path = require("path");

const ROOT_DIRS = ["./case1/A", "./case1/B"];
//const ROOT_DIRS = ["./case2/A", "./case2/B"];
//const ROOT_DIRS = ["./case3/A", "./case3/B"];
//const ROOT_DIRS = ["./case4/A", "./case4/B"];
//const ROOT_DIRS = ["./case5/A", "./case5/B"]; // пути 1-го уровня
//const ROOT_DIRS = ["./case6/A"];
const N = 2;

// Шаг 1+2: рекурсивно читаем диск, собираем листовые папки с .js
function collect(dir, result = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const subdirs = entries.filter(e => e.isDirectory());
  const files = entries.filter(e => e.isFile());

  if (subdirs.length > 0) {
    // не лист — идём глубже
    for (const d of subdirs) collect(path.join(dir, d.name), result);
  } else {
    // лист — считаем .js
    const jsCount = files.filter(f => f.name.toLowerCase().endsWith(".js")).length;
    if (jsCount > 0) {
      result.push({
        path: dir.replace(/^\.\//, "").split("/").join(" \\ "),
        jsCount,
      });
    }
  }
  return result;
}

// Шаг 3: деление по сумме .js
function split(folders, n) {
  const groups = Array.from({ length: n }, () => []);
  const sums = new Array(n).fill(0);
  // сначала сортируем по количеству js файлов, 
  // затем кладем каждый по очереди в папку с наименьшим общим количеством
  [...folders].sort((a, b) => b.jsCount - a.jsCount).forEach(f => {
    const i = sums.indexOf(Math.min(...sums));
    groups[i].push(f);
    sums[i] += f.jsCount;
  });
  return groups;
}

// main
const folders = ROOT_DIRS.flatMap(d => collect(d));

console.log("=== Задачи 1 и 2 ===");
for (const f of folders) console.log(`  ${f.path} (${f.jsCount})`);

console.log(`\n=== Задача 3 (N=${N}) ===`);
split(folders, N).forEach((g, i) => {
  const sum = g.reduce((s, f) => s + f.jsCount, 0);
  console.log(`[${i + 1}] сумма .js = ${sum}`);
  for (const f of g) console.log(`  ${f.path} (${f.jsCount})`);
});