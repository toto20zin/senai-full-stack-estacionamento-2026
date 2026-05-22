
const prisma = require("../data/prisma");

const listar = async (req, res) => {

    try {

        const estadias = await prisma.estadia.findMany({

            include: {
                veiculo: true
            }
        });

        res.status(200).json(estadias);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);
    }
};

const buscar = async (req, res) => {

    try {

        const { id } = req.params;

        const estadia = await prisma.estadia.findUnique({

            where: {
                id: Number(id)
            },

            include: {
                veiculo: true
            }
        });

        if (!estadia) {

            return res.status(404).json({
                erro: "Estadia não encontrada"
            });
        }

        res.status(200).json(estadia);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);
    }
};

const cadastrar = async (req, res) => {

    try {

        const estadia = req.body;

        const nova = await prisma.estadia.create({

            data: {

                placa: estadia.placa,

                valorHora: Number(estadia.valorHora)
            }
        });

        res.status(201).json(nova);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);
    }
};

const editar = async (req, res) => {

    try {

        const { id } = req.params;

        const dados = req.body;

        const estadiaAtual = await prisma.estadia.findUnique({

            where: {
                id: Number(id)
            }
        });

        if (!estadiaAtual) {

            return res.status(404).json({
                erro: "Estadia não encontrada"
            });
        }

        let valorTotal = estadiaAtual.valorTotal;

        let saida = estadiaAtual.saida;

        if (dados.saida) {

            saida = new Date(dados.saida);

            const entrada = new Date(estadiaAtual.entrada);

            const diferencaMs = saida - entrada;

            const horas = diferencaMs / (1000 * 60 * 60);

            valorTotal = horas * estadiaAtual.valorHora;
        }

        const atualizado = await prisma.estadia.update({

            where: {
                id: Number(id)
            },

            data: {

                saida: saida,

                valorHora: dados.valorHora
                    ? Number(dados.valorHora)
                    : estadiaAtual.valorHora,

                valorTotal: valorTotal
                    ? Number(valorTotal.toFixed(2))
                    : null
            }
        });

        res.status(200).json(atualizado);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);
    }
};

const excluir = async (req, res) => {

    try {

        const { id } = req.params;

        const removido = await prisma.estadia.delete({

            where: {
                id: Number(id)
            }
        });

        res.status(200).json(removido);

    } catch (err) {

        console.log(err);

        res.status(500).json(err);
    }
};

module.exports = {

    listar,
    buscar,
    cadastrar,
    editar,
    excluir
};

