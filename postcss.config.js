export default {
  plugins: [
    {
      postcssPlugin: 'internal:charset-removal',
      AtRule: {
        charset: (atRule) => {
          if (atRule.name === 'charset') {
            atRule.remove();
          }
        }
      }
    },
    {
      postcssPlugin: 'internal:null-byte-removal',
      Once: (root) => {
        root.walkDecls((decl) => {
          if (decl.value && decl.value.includes('\x00')) {
            decl.value = decl.value.replace(/\x00/g, '');
          }
        });
        root.walkAtRules((atRule) => {
          if (atRule.params && atRule.params.includes('\x00')) {
            atRule.params = atRule.params.replace(/\x00/g, '');
          }
        });
      }
    }
  ]
} 