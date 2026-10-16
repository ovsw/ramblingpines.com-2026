"""Convert the exported policy HTML to Portable Text without executable markup."""
import json
import re
import sys
from html.parser import HTMLParser


class PolicyParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        self.current = None
        self.stack = []
        self.skip = 0
        self.lists = []
        self.marks = []

    def flush(self):
        if self.current and any(c['text'].strip() for c in self.current['children']):
            self.blocks.append(self.current)
        self.current = None

    def start_block(self, style='normal', item=None):
        self.flush()
        self.current = {'_type': 'block', '_key': f'html-{len(self.blocks)}',
                        'style': style, 'markDefs': [], 'children': []}
        if item:
            self.current.update(listItem=item, level=max(1, len(self.lists)))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style'):
            self.skip += 1
        if self.skip:
            return
        if tag in ('ul', 'ol'):
            self.flush()
            self.lists.append('number' if tag == 'ol' else 'bullet')
        if tag in ('p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.start_block('h2' if tag == 'h1' else tag if tag.startswith('h') else 'normal',
                             self.lists[-1] if tag == 'li' and self.lists else None)
        heading = {'title': 'h2', 'heading_1': 'h2', 'heading_2': 'h3'}.get(attrs.get('data-custom-class'))
        if heading:
            if self.current is None:
                self.start_block(heading)
            else:
                self.current['style'] = heading
        mark = 'strong' if tag in ('b', 'strong') else 'em' if tag in ('i', 'em') else None
        if tag == 'a' and re.match(r'^(https?://|mailto:|tel:|/|#)', attrs.get('href', '')):
            if self.current is None:
                self.start_block()
            mark = f"link-{len(self.current['markDefs'])}"
            self.current['markDefs'].append({'_key': mark, '_type': 'customLink', 'customLink':
                {'_type': 'customUrl', 'type': 'external', 'external': attrs['href'], 'openInNewTab': attrs.get('target') == '_blank'}})
        if mark:
            self.marks.append((tag, mark))
        if tag == 'br':
            self.handle_data('\n')

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip = max(0, self.skip - 1)
            return
        if self.skip:
            return
        self.marks = [(t, m) for t, m in self.marks if t != tag]
        if tag in ('p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            self.flush()
        if tag in ('ul', 'ol') and self.lists:
            self.lists.pop()

    def handle_data(self, text):
        if self.skip or (self.current is None and not text.strip()):
            return
        if self.current is None:
            self.start_block()
        self.current['children'].append({'_key': f"span-{len(self.current['children'])}",
            '_type': 'span', 'marks': [m for _, m in self.marks], 'text': text})


parser = PolicyParser()
parser.feed(sys.stdin.read())
parser.flush()
print(json.dumps(parser.blocks, ensure_ascii=False))
