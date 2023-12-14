module.exports = function (application) {
  const router = application.config.middlewares.express.Router();
  
  router.get("/",  function (req, res) {
     application.app.controllers.tarefas.listarTarefasPaginadas(application, req, res);
  });
  
  router.get("/adicionar", function (req, res) {
    res.locals.moment = application.config.middlewares.moment;
    res.render("pages/adicionar", { dados: null, listaErros: null })
  });
  
  router.post(
    "/adicionar",
    application.app.controllers.tarefas.regrasValidacao,
    async function (req, res) {
      await application.app.controllers.tarefas.adicionarTarefa(application, req, res);
    }
  );
  
  router.get("/editar", async function (req, res) {
    await application.app.controllers.tarefas.exibirTarefaId(application, req, res);
  });
  
  router.get("/excluir", async function (req, res) {
    await application.app.controllers.tarefas.excluirTarefa(application, req, res);
  });
  
  router.get("/finalizar", async function (req, res) {
    await application.app.controllers.tarefas.finalizarTarefa(application, req, res);
  });
  
  router.get("/iniciar", async function (req, res) {
    await application.app.controllers.tarefas.iniciarTarefa(application,req, res);
  });


  application.use("/", router);
}
