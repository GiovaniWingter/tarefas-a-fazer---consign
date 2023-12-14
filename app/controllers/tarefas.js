module.exports = function (application) {

    const tarefasController = {

        regrasValidacao: [
            application.config.middlewares.body("tarefa").isLength({ min: 5, max: 45 }).withMessage("Nome da Tarefa deve conter de 5 a 45 letras!"),
            application.config.middlewares.body("prazo").isISO8601(),
            application.config.middlewares.body("situacao").isNumeric()
        ],

        listarTarefasPaginadas: async (application, req, res) => {
            res.locals.moment = application.config.middlewares.moment;
            try {
                let pagina = req.query.pagina == undefined ? 1 : req.query.pagina;
                var results = null
                inicio = parseInt(pagina - 1) * 5
                results = await application.app.models.tarefas.findPage(inicio, 5);
                totReg = await application.app.models.tarefas.totalReg();
                console.log(totReg);
                totPaginas = Math.ceil(totReg[0].total / 5);
                var paginador = totReg[0].total <= 5 ? null : { "pagina_atual": pagina, "total_reg": totReg[0].total, "total_paginas": totPaginas };
                res.render("pages/index", { tarefas: results, paginador: paginador });
            } catch (e) {
                console.log(e); // exibir os erros no console do vs code
                res.json({ erro: "Falha ao acessar dados" });
            }
        },

        adicionarTarefa: async (application, req, res) => {
            res.locals.moment = application.config.middlewares.moment;
            const errors = application.config.middlewares.validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res.render("pages/adicionar", { dados: req.body, listaErros: errors });
            }
            var dadosForm = {
                nome_tarefa: req.body.tarefa,
                prazo_tarefa: req.body.prazo,
                situacao_tarefa: req.body.situacao,
            };
            let id_tarefa = req.body.id_tarefa;
            try {
                if (id_tarefa == "") {
                    results = await application.app.models.tarefas.create(dadosForm);
                    totReg = await application.app.models.tarefas.totalReg();
                    paginaAtual = Math.ceil(totReg[0].total / 5)
                    res.redirect("/?pagina=" + paginaAtual);
                } else {
                    results = await application.app.models.tarefas.update(dadosForm, id_tarefa);
                    let posicao = await application.app.models.tarefas.posicaoReg(id_tarefa);
                    let url = "/?pagina=" + Math.ceil(posicao[0].numero_ordem / 5);
                    res.redirect(url);
                }
            } catch (e) {
                console.log(e);
                res.json({ erro: "Falha ao acessar dados" });
            }
        },

        excluirTarefa: async (application, req, res) => {
            let { id } = req.query;
            try {
                results = await application.app.models.tarefas.delete(id);
                totReg = await application.app.models.tarefas.totalReg();
                paginaAtual = Math.ceil(totReg[0].total / 5)
                res.redirect("/?pagina=" + paginaAtual);
            } catch (e) {
                console.log(e);
                res.json({ erro: "Falha ao acessar dados" });
            }
        },

        finalizarTarefa: async (application, req, res) => {
            let { id } = req.query;
            try {
                results = await application.app.models.tarefas.sistuacaoTarefa(2, id);
                let posicao = await application.app.models.tarefas.posicaoReg(id);
                console.log(id);
                let url = "/?pagina=" + Math.ceil(posicao[0].numero_ordem / 5);
                res.redirect(url);
                // let url = req.rawHeaders[25];
                // let urlChamadora = url.replace(process.env.URL_BASE, "");
                // res.redirect(urlChamadora);
            } catch (e) {
                console.log(e);
                res.json({ erro: "Falha ao acessar dados" });
            }
        },

        iniciarTarefa: async (application, req, res) => {
            let { id } = req.query;
            try {
                results = await application.app.models.tarefas.sistuacaoTarefa(1, id);
                let posicao = await application.app.models.tarefas.posicaoReg(id);
                let url = "/?pagina=" + Math.ceil(posicao[0].numero_ordem / 5);
                res.redirect(url);
                // let url = req.rawHeaders[25];
                // let urlChamadora = url.replace(process.env.URL_BASE, "");
                // res.redirect(urlChamadora);
            } catch (e) {
                console.log(e);
                res.json({ erro: "Falha ao acessar dados" });
            }
        },

        exibirTarefaId: async (application, req, res) => {
            res.locals.moment = application.config.middlewares.moment;
            let { id } = req.query;
            console.log(id);
            try {
                let tarefa = await application.app.models.tarefas.findId(id)
                res.render("pages/adicionar", {
                    dados: {
                        id_tarefa: id, tarefa: tarefa[0].nome_tarefa,
                        prazo: tarefa[0].prazo_tarefa, situacao: tarefa[0].situacao_tarefa
                    }, listaErros: null
                });
            } catch (e) {
                console.log(e);
                res.json({ erro: "Falha ao acessar dados" });
            }
        }
    }
    return tarefasController
}