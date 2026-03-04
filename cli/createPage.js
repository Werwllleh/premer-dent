const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createPage = (pageName) => {
  const dir = path.join(__dirname, '../src', 'pages', pageName);

  // Проверяем, существует ли директория
  if (fs.existsSync(dir)) {
    console.error(`Страница "${pageName}" уже существует!`);
    return false;
  }

  // Создание директории
  fs.mkdirSync(dir, { recursive: true });

  // Содержимое для pug файла
  const pugContent = `extends ../../app/pug/layouts/base.pug\n\nappend vars\n  - title = "${pageName.charAt(0).toUpperCase() + pageName.slice(1)}"\n  - description = "Описание ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}"\n\nappend content\n  +regPage('${pageName}', true, true)\n  //- регистрация\n  //- +regLibrary('lib-name/lib.css', 'lib-name/lib.js')\n  //- +regBlock('block-name', true, true)\n  main.${pageName}\n    .container\n      h1 Страница ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
  
  // Содержимое для scss файла
  const scssContent = `@use '../../app/scss/variables.scss' as *;\n\n// ${pageName}\n.${pageName} {}`;

  // Содержимое для js файла
  const jsContent = `document.addEventListener('DOMContentLoaded', () => {\n  // Скрипты для страницы "${pageName.charAt(0).toUpperCase() + pageName.slice(1)}"\n const page = document.querySelector('.${pageName}')\n  if (page) {}\n});`;

  // Запись файлов
  fs.writeFileSync(path.join(dir, `${pageName}.pug`), pugContent);
  fs.writeFileSync(path.join(dir, `${pageName}.scss`), scssContent);
  fs.writeFileSync(path.join(dir, `${pageName}.js`), jsContent);

  console.log(`Страница "${pageName}" успешно создана!`);
};

// Запрос имени страницы у пользователя
rl.question('Введите название страницы: ', (pageName) => {
  if (!pageName) {
    console.error('Пожалуйста, укажите имя страницы.');
    rl.close();
    return;
  }

  createPage(pageName);
  rl.close();
});