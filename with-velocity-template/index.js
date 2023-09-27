var editor = grapesjs.init({
  container: '#gjs',
  storageManager: false,
});

const getSvgHtml = (svg) => {
  if (typeof window === 'undefined') return '';
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  return svg.outerHTML;
};

editor.Blocks.add('blog-block-1', {
  label: getSvgHtml(
    editor
      .$(
        '<svg viewBox="0 0 266 150" fill="none" width="266"  height="150" ><path fill="#FFFFFF" d="M0 0h266v150H0z"></path><rect x="20" y="43" width="68" height="63" rx="2" fill="#E2E8F0"></rect><path d="M29 73a1 1 0 011-1h48a1 1 0 110 2H30a1 1 0 01-1-1zM33 78a1 1 0 011-1h40a1 1 0 110 2H34a1 1 0 01-1-1z" fill="#A0AEC0"></path><path d="M48 83a1 1 0 011-1h11a1 1 0 110 2H49a1 1 0 01-1-1z" fill="#6366F1"></path><path d="M37 67.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z" fill="#4A5568"></path><rect x="99" y="43" width="68" height="63" rx="2" fill="#E2E8F0"></rect><path d="M108 73a1 1 0 011-1h48a1 1 0 010 2h-48a1 1 0 01-1-1zM112 78a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z" fill="#A0AEC0"></path><path d="M127 83a1 1 0 011-1h11a1 1 0 010 2h-11a1 1 0 01-1-1z" fill="#6366F1"></path><path d="M116 67.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z" fill="#4A5568"></path><rect x="178" y="43" width="68" height="63" rx="2" fill="#E2E8F0"></rect><path d="M187 73a1 1 0 011-1h48a1 1 0 010 2h-48a1 1 0 01-1-1zM191 78a1 1 0 011-1h40a1 1 0 010 2h-40a1 1 0 01-1-1z" fill="#A0AEC0"></path><path d="M206 83a1 1 0 011-1h11a1 1 0 010 2h-11a1 1 0 01-1-1z" fill="#6366F1"></path><path d="M195 67.5a1.5 1.5 0 011.5-1.5h32a1.5 1.5 0 010 3h-32a1.5 1.5 0 01-1.5-1.5z" fill="#4A5568"></path></svg>'
      )
      .get(0)
  ),
  // attributes: { class: `block-full-width` },
  content: `
        <style>
        #content {
        background-color:#ffffff;
        width:150px;
        height:50px;
        }
        #title {
        text-align:center;
        color:#000000;
        font-family:Arial;
        font-weight:bold;
        font-size:12px;
        display:block;
        clear:both;
        }
        #price {
        text-align:center;
        color:#000000;
        font-family:Arial;
        font-size:12px;
        display:block;
        clear:both;
        }
        </style>
        <span id='title'>$title</span>
        <span id='price'>£ $lib.simpleFormatPrice($salePriceGBP,2)</span>
  `,
  category: { label: 'Blog', open: true }
});
let prevContent = '';
let prevCss = '';
editor.on('stop:preview', opts => {
    editor.setComponents(prevContent)
    editor.setStyle(prevCss)
})

editor.on('run:preview', opts => {
    prevContent = editor.getHtml();
    prevCss = editor.getCss();
    editor.setComponents(renderHtml(prevContent, {title: 'Test Title', salePriceGBP: 1233.45678}))
    editor.setStyle(prevCss)
})