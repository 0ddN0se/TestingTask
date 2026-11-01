// Дерево папок: ключ — имя папки, значение — либо вложенные папки (объект), либо файлы (массив)
const tree = {
  A: {
    "A1-1": {
      "A2-1": ["file1.txt", "file2.js"]
    },
    "A1-2": ["file3.js", "file4.js", "file5.js"],
    "A1-3": ["readme.txt"]
  },
  B: {
    "B1-2": ["file11.js", "file12.js", "file13.js"],
    "B1-3": ["file15.js"],
    "B1-4": ["file8.js", "readme.txt"]
  }
};

// На сколько групп делить результат
const N = 2;

// Рекурсивно обходим дерево и собираем папки, где есть хотя бы один .js
// currentPath копит путь от корня, result — общий массив на все вызовы
function collectJsFolders(node, currentPath = "", result = []) {
  for (const key in node) {
    const value = node[key];
    // на верхнем уровне просто 'A', дальше 'A/A1-1' и т.д.
    const newPath = currentPath ? `${currentPath}/${key}` : key;

    if (Array.isArray(value)) {
      // дошли до листа — это массив файлов, считаем .js
      const jsCount = value.filter(file => file.endsWith(".js")).length;
      // папки без .js не нужны
      if (jsCount > 0) {
        result.push({ path: newPath, jsCount });
      }
    } else {
      // не массив — значит папка, идём глубже
      collectJsFolders(value, newPath, result);
    }
  }
  return result;
}

// Делим массив на n групп, разница в размере максимум 1
function splitIntoGroups(items, n) {
  const groups = [];
  const base = Math.floor(items.length / n); // всем поровну
  const remainder = items.length % n;        // эти группы получат +1

  let index = 0;
  for (let i = 0; i < n; i++) {
    // первым remainder группам достаётся лишний элемент
    const size = base + (i < remainder ? 1 : 0);
    groups.push(items.slice(index, index + size));
    index += size;
  }
  return groups;
}

const folders = collectJsFolders(tree);
const groups = splitIntoGroups(folders, N);

console.log(groups);