module.exports = function (application) {

    const tarefasModel = {
        findAll: async () => {
            try {
                const [resultados] = await application.config.pool_conexoes.query('SELECT * FROM tarefas WHERE status_tarefa = 1')
                return resultados;
            } catch (error) {
                return error;
            }
        },

        findId: async (id) => {
            try {
                const [resultados] = await application.config.pool_conexoes.query('SELECT * FROM tarefas WHERE status_tarefa = 1 and id_tarefa = ?',[id] )
                return resultados;
            } catch (error) {
                return error;
            }
        },

        findPage: async (pagina, total) => {
            try {
                const [resultados] = await application.config.pool_conexoes.query('SELECT * FROM tarefas  WHERE status_tarefa = 1 limit ?, ?', [pagina,total])
                return resultados;
            } catch (error) {
                return error;
            }  
        },

        create: async (dadosForm) => {
            try {
                const [resultados] = await application.config.pool_conexoes.query('INSERT INTO tarefas SET ?', [dadosForm])
                return resultados;
            } catch (error) {
                console.log(error);
                return null;
            }  
        },

        update: async (dadosForm, id) => {
            try {
                const [resultados] = await application.config.pool_conexoes.query('UPDATE tarefas SET ? WHERE id_tarefa = ?', [dadosForm, id])
                return resultados;
            } catch (error) {
                return error;
            }  
        },

        delete: async (id) => {
            try {
                const [resultados] = await application.config.pool_conexoes.query('UPDATE tarefas SET status_tarefa = 0  WHERE id_tarefa = ?', [id])
                return resultados;
            } catch (error) {
                return error;
            }  
        },

        sistuacaoTarefa: async (situacao, id) => {
            try {
                const [resultados] = await application.config.pool_conexoes.query('UPDATE tarefas SET situacao_tarefa = ? WHERE id_tarefa = ?', [situacao, id])
                return resultados;
            } catch (error) {
                return error;
            }  
        },

        totalReg: async ()=>{
            try {
                const [resultados] = await application.config.pool_conexoes.query('SELECT count(*) total FROM tarefas  WHERE status_tarefa = 1')
                return resultados;
            } catch (error) {
                return error;
            }  
        },
        
        posicaoReg: async(id) =>{
            try {
                const [resultados] = await application.config.pool_conexoes.query('SELECT *, ' + 
                '(SELECT COUNT(*) + 1 FROM tarefas AS t2 WHERE t2.id_tarefa < t1.id_tarefa and status_tarefa = 1)  numero_ordem '+ 
                'FROM tarefas AS t1 WHERE t1.id_tarefa = ? and status_tarefa = 1 ;',[id])
                return resultados;
            } catch (error) {
                return error;
            }  
        }
    };

    return tarefasModel;

}