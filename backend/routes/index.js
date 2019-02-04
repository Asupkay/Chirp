const constructorMethod = (app) => {
  app.get('/',(req, res) => {
    res.json('Hello World');
  });

  app.use('*', (req, res) => {
    res.status(404).json("Page not found");
  });
  
}

module.exports = constructorMethod;
