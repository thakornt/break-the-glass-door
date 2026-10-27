#!/usr/bin/env python3
"""Inline src/core.js and src/objects.js into src/page.html -> index.html (standalone)."""
from pathlib import Path
root = Path(__file__).parent
page = (root / 'src/page.html').read_text(encoding='utf-8')
page = page.replace('/*CORE*/', (root / 'src/core.js').read_text(encoding='utf-8'))
page = page.replace('/*OBJECTS*/', (root / 'src/objects.js').read_text(encoding='utf-8'))
html = ('<!doctype html>\n<html lang="th">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '</head>\n<body>\n' + page + '\n</body>\n</html>\n')
(root / 'index.html').write_text(html, encoding='utf-8')
print('built index.html', len(html), 'bytes')
