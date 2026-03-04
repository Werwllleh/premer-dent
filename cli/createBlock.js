const fs = require('fs');
const path = require('path');
const readline = require('readline');
const utils = require('./utils.js')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createBlock = (blockName) => {
  const dir = path.join(__dirname, '../src', 'blocks', blockName);

  // Проверяем, существует ли директория
  if (fs.existsSync(dir)) {
    console.error(`Блок "${blockName}" уже существует!`);
    return false;
  }

  // Создание директории
  fs.mkdirSync(dir, { recursive: true });

  // Содержимое для pug файла
  const pugContent = `mixin ${utils.kebabToCamel(blockName)}()\n  //- регистрация\n  //- +regLibrary('lib-name/lib.css', 'lib-name/lib.js')\n  //- +regComponent('component-name', true, true)\n\n  //${blockName}\n  .${blockName}&attributes(attributes)\n    h2 Блок ${blockName}`;
  
  // Содержимое для scss файла
  const scssContent = `@use '../../app/scss/variables.scss' as *;\n\n// ${blockName}\n.${blockName} {}`;

  // Содержимое для js файла
  const jsContent = `document.addEventListener('DOMContentLoaded', () => {\n  // Скрипты для блока "${blockName}"\n  const block = document.querySelector('.${blockName}')\n  if (block) {}\n});`;

  // Запись файлов
  fs.writeFileSync(path.join(dir, `${blockName}.pug`), pugContent);
  fs.writeFileSync(path.join(dir, `${blockName}.scss`), scssContent);
  fs.writeFileSync(path.join(dir, `${blockName}.js`), jsContent);

  // Добавляем импорт в index.pug
  fs.appendFileSync(path.join(__dirname, '../src', 'blocks', 'index.pug'), `\ninclude ${blockName}/${blockName}`);

  console.log(`Блок "${blockName}" успешно создан!`);
};

// Запрос имени страницы у пользователя
rl.question('Введите название блока: ', (blockName) => {
  if (!blockName) {
    console.error('Пожалуйста, укажите имя блока.');
    rl.close();
    return;
  }

  createBlock(blockName);
  rl.close();
});