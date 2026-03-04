const fs = require('fs');
const path = require('path');
const readline = require('readline');
const utils = require('./utils.js')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const createComponent = (componentName) => {
  const dir = path.join(__dirname, '../src', 'components', componentName);

  // Проверяем, существует ли директория
  if (fs.existsSync(dir)) {
    console.error(`Компонент "${componentName}" уже существует!`);
    return false;
  }

  // Создание директории
  fs.mkdirSync(dir, { recursive: true });

  // Содержимое для pug файла
  const pugContent = `mixin ${utils.kebabToCamel(componentName)}()\n  //- регистрация\n  //- +regLibrary('lib-name/lib.css', 'lib-name/lib.js')\n  //- +regComponent('component-name', true, true)\n\n  //${componentName}\n  .${componentName}&attributes(attributes)\n    p Компонент ${componentName}`;
  
  // Содержимое для scss файла
  const scssContent = `@use '../../app/scss/variables.scss' as *;\n\n// ${componentName}\n.${componentName} {}`;

  // Содержимое для js файла
  const jsContent = `document.addEventListener('DOMContentLoaded', () => {\n  // Скрипты для компонента "${componentName}"\n  const component = document.querySelector('.${componentName}')\n  if (component) {}\n});`;

  // Запись файлов
  fs.writeFileSync(path.join(dir, `${componentName}.pug`), pugContent);
  fs.writeFileSync(path.join(dir, `${componentName}.scss`), scssContent);
  fs.writeFileSync(path.join(dir, `${componentName}.js`), jsContent);

  // Добавляем импорт в index.pug
  fs.appendFileSync(path.join(__dirname, '../src', 'components', 'index.pug'), `\ninclude ${componentName}/${componentName}`);

  console.log(`Компонент "${componentName}" успешно создан!`);
};

// Запрос имени страницы у пользователя
rl.question('Введите название компонента: ', (componentName) => {
  if (!componentName) {
    console.error('Пожалуйста, укажите имя компонента.');
    rl.close();
    return;
  }

  createComponent(componentName);
  rl.close();
});