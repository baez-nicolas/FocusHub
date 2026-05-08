const fs = require('fs');
const path = require('path');

const BASE = 'c:/Users/bolas/OneDrive/Escritorio/Proyectos/FocusHub/src/app';

const COMPONENTS = [
  'components/calculator.component.ts',
  'components/dashboard.component.ts',
  'components/planner.component.ts',
  'components/gym.component.ts',
  'components/more.component.ts',
  'components/notes.component.ts',
  'components/news.component.ts',
  'components/stats.component.ts',
  'components/music.component.ts',
  'components/spotify-callback.component.ts',
  'services/stats.service.ts',
  'services/lang.service.ts',
  'services/notes.service.ts',
  'services/planner.service.ts',
  'services/gym.service.ts',
  'services/storage.service.ts',
  'services/theme.service.ts',
  'services/weather.service.ts',
  'services/news.service.ts',
  'services/spotify-auth.service.ts',
  'services/spotify.service.ts',
  'app.routes.ts',
  'app.ts',
  'app.config.ts',
  'app.spec.ts',
];

function stripComments(content) {
  let result = '';
  let i = 0;
  const len = content.length;

  function cur(offset = 0) { return i + offset < len ? content[i + offset] : ''; }

  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplateLiteral = false;

  while (i < len) {
    if (!inSingleQuote && !inDoubleQuote && !inTemplateLiteral) {
      if (cur() === '/' && cur(1) === '/') {
        while (i < len && cur() !== '\n') i++;
        continue;
      }
      if (cur() === '/' && cur(1) === '*') {
        i += 2;
        while (i < len && !(cur() === '*' && cur(1) === '/')) i++;
        i += 2;
        continue;
      }
      if (cur() === "'") { inSingleQuote = true; result += content[i++]; continue; }
      if (cur() === '"') { inDoubleQuote = true; result += content[i++]; continue; }
      if (cur() === '`') { inTemplateLiteral = true; result += content[i++]; continue; }
    } else if (inSingleQuote) {
      if (cur() === '\\') { result += content[i++]; result += content[i++]; continue; }
      if (cur() === "'") inSingleQuote = false;
      result += content[i++]; continue;
    } else if (inDoubleQuote) {
      if (cur() === '\\') { result += content[i++]; result += content[i++]; continue; }
      if (cur() === '"') inDoubleQuote = false;
      result += content[i++]; continue;
    } else if (inTemplateLiteral) {
      if (cur() === '\\') { result += content[i++]; result += content[i++]; continue; }
      if (cur() === '`') { inTemplateLiteral = false; result += content[i++]; continue; }
      if (cur() === '/' && cur(1) === '*') {
        i += 2;
        while (i < len && !(cur() === '*' && cur(1) === '/')) i++;
        i += 2; continue;
      }
      if (cur() === '<' && cur(1) === '!' && cur(2) === '-' && cur(3) === '-') {
        i += 4;
        while (i < len && !(cur() === '-' && cur(1) === '-' && cur(2) === '>')) i++;
        i += 3; continue;
      }
      result += content[i++]; continue;
    }
    result += content[i++];
  }

  return result.replace(/\n{3,}/g, '\n\n');
}

function removePomodoroImports(content) {
  return content
    .replace(/\nimport \{ PomodoroService \} from '\.\.\/services\/pomodoro\.service';\n/g, '\n')
    .replace(/\nimport \{ PomodoroService \} from '\.\/pomodoro\.service';\n/g, '\n');
}

function removePomodoroWidget(content) {
  return content.replace(
    /\n\s*@if \(pomodoroService\.state\(\) !== 'IDLE' && pomodoroService\.state\(\) !== 'PAUSED'\) \{\s*<div class="pomodoro-widget"[\s\S]*?<\/div>\s*\}\n/g,
    '\n'
  );
}

function removePomodoroCSS(content) {
  return content.replace(
    /\n\s*\.pomodoro-widget[\s\S]*?:host-context\(\.dark\) \.pomodoro-widget:hover \{[\s\S]*?\}\n/g,
    '\n'
  );
}

function removePomodoroClassMembers(content) {
  return content
    .replace(/\n\s*pomodoroService = inject\(PomodoroService\);\n/g, '\n')
    .replace(/\n\s*focusLabel: es \? 'Enfoque' : 'Focus',\n/g, '\n')
    .replace(/\n\s*breakLabel: es \? 'Descanso' : 'Break',\n/g, '\n')
    .replace(/\n\s*formatTime = computed\(\(\) => \{[\s\S]*?const sec = this\.pomodoroService\.secondsLeft\(\);[\s\S]*?\}\);\n/g, '\n')
    .replace(/\n\s*getPhaseLabel\(\): string \{[\s\S]*?return '';\s*\}\n/g, '\n')
    .replace(/\n\s*goToPomodoro\(\): void \{\s*this\.router\.navigate\(\['\/pomodoro'\]\);\s*\}\n/g, '\n');
}

function removeRouterIfOnlyPomodoro(content, filename) {
  const noMoreRouterUsage = !content.includes('this.router.navigate') && !content.includes('this.router.createUrlTree');
  if (noMoreRouterUsage && content.includes("import { Router } from '@angular/router'")) {
    content = content.replace(/\nimport \{ Router \} from '@angular\/router';\n/g, '\n');
    content = content.replace(/\n\s*private router = inject\(Router\);\n/g, '\n');
  }
  return content;
}

for (const rel of COMPONENTS) {
  const filePath = path.join(BASE, rel);
  if (!fs.existsSync(filePath)) { console.log('SKIP (not found):', rel); continue; }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  content = removePomodoroImports(content);
  content = removePomodoroWidget(content);
  content = removePomodoroCSS(content);
  content = removePomodoroClassMembers(content);
  content = removeRouterIfOnlyPomodoro(content, rel);
  content = stripComments(content);
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('UPDATED:', rel);
  } else {
    console.log('NO CHANGE:', rel);
  }
}

console.log('\nDone!');
