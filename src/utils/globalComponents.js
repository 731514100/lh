const globalComponents = (app) => {
  const files = require.context('@/components', true, /\.vue$/);
  files.keys().forEach((key) => {
    // console.log(files(key), '-');
    app.component(files(key).default.name, files(key).default);
  });
};
export default globalComponents;
