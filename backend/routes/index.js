const constructorMethod = (app) => {
  app.use('*', (req, res) => {
    res.status(404).json("Page not found");
  });
  
}

module.exports = constructorMethod;
