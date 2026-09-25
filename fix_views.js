const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ejs') && !fullPath.includes('dashboard') && !fullPath.includes('layouts') && !fullPath.includes('auth')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Replace generic header
      content = content.replace(/<div class="flex justify-between items-center mb-4(?: hide-on-print)?">\s*<h1>(.*?)<\/h1>\s*(?:<button.*?onclick="window\.print\(\)".*?>(.*?)<\/button>|<a href="(.*?)" class="btn.*?">(.*?)<\/a>)\s*<\/div>/g, (match, title, printText, href, btnText) => {
        let btnHtml = '';
        let subtitle = 'Gerenciamento de registros';
        if (title.toLowerCase().includes('novo') || title.toLowerCase().includes('editar')) {
          subtitle = 'Preencha as informações abaixo';
        }

        if (printText) {
          btnHtml = `<button onclick="window.print()" class="btn btn-secondary"><i data-feather="printer"></i> ${printText}</button>`;
        } else if (btnText.toLowerCase().includes('voltar')) {
          btnHtml = `<a href="${href}" class="btn btn-secondary"><i data-feather="arrow-left"></i> ${btnText}</a>`;
        } else if (btnText.toLowerCase().includes('novo') || btnText.toLowerCase().includes('abrir')) {
          btnHtml = `<a href="${href}" class="btn btn-primary"><i data-feather="plus-circle"></i> ${btnText}</a>`;
        } else {
          btnHtml = `<a href="${href}" class="btn btn-primary">${btnText}</a>`;
        }

        return `<div class="dashboard-header">\n  <div>\n    <h1>${title}</h1>\n    <p style="color: var(--on-surface-variant); font-size: 0.875rem;">${subtitle}</p>\n  </div>\n  <div class="dashboard-actions">\n    ${btnHtml}\n  </div>\n</div>`;
      });

      // Fix form actions/submit buttons
      content = content.replace(/<button type="submit" class="btn">Salvar<\/button>/g, '<button type="submit" class="btn btn-primary"><i data-feather="save"></i> Salvar</button>');
      content = content.replace(/<button type="submit" class="btn">Buscar<\/button>/g, '<button type="submit" class="btn btn-primary"><i data-feather="search"></i> Buscar</button>');
      
      // Fix table buttons
      content = content.replace(/<a href="(.*?)" class="btn btn-secondary">Editar<\/a>/g, '<a href="$1" class="btn btn-secondary" style="padding: 0.375rem;" title="Editar"><i data-feather="edit"></i></a>');
      content = content.replace(/<a href="(.*?)" class="btn">Editar<\/a>/g, '<a href="$1" class="btn btn-secondary" style="padding: 0.375rem;" title="Editar"><i data-feather="edit"></i></a>');
      content = content.replace(/<button type="submit" class="btn btn-danger"(?: onclick=".*?")?>Excluir<\/button>/g, '<button type="submit" class="btn btn-danger" style="padding: 0.375rem;" title="Excluir"><i data-feather="trash-2"></i></button>');
      content = content.replace(/<a href="(.*?)" class="btn">Detalhes<\/a>/g, '<a href="$1" class="btn btn-secondary" style="padding: 0.375rem;" title="Detalhes"><i data-feather="eye"></i></a>');

      // Table responsive class fix (adding the new styles)
      content = content.replace(/<div class="table-responsive">/g, '<div class="table-responsive" style="border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">');

      // Replace plain `<div class="card">` that wrap tables with padding 0
      content = content.replace(/<div class="card">\s*<div class="table-responsive/g, '<div class="card" style="padding: 0;">\n  <div class="table-responsive" style="border: none; box-shadow: none;');

      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${fullPath}`);
    }
  }
}

processDir(path.join(__dirname, 'src', 'views'));
