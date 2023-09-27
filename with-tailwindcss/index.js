const getHtmlWithoutBody = (html) => {
  var reg = /\<body[^>]*\>([^]*)\<\/body/m;
  return html.match(reg)[1];
}

// Handle tailwind's use of slashes in css names
const escapeName = (name) => `${name}`.trim().replace(/([^a-z0-9\w-:/]+)/gi, '-');

// let css = '';
// setInterval(() => {
//   ed.runCommand('get-tailwindCss', (tlCss) => {
//     css = tlCss;
//   })
// }, 1000)

window.onload = function () {
  window.editor = grapesjs.init({
    height: '100%',
    container: '#gjs',
    showOffsets: true,
    fromElement: true,
    noticeOnUnload: false,
    storageManager: false,
    selectorManager: { escapeName },
    plugins: ['grapesjs-plugin-forms', 'grapesjs-tailwind', 'grapesjs-plugin-export'],
    pluginsOpts: {
      'grapesjs-tailwind': {
        /* options */
      },
      'grapesjs-plugin-export': {
        root: {
          css: {
            'style.css': ed => ed.runCommand('get-tailwindCss')
          },
          'index.html': ed => {
            let css = '';
            ed.runCommand('get-tailwindCss', {callback: (tlCss) => {
              css = tlCss;
              console.log('css', tlCss, css);
            }})
            console.log('return')
            return `${getHtmlWithoutBody(ed.getHtml())}<style>${css}</style>`;
          }
        }
      }
    }
  });
};
