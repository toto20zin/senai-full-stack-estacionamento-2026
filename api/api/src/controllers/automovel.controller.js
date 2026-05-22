const prisma = require("../data/prisma");

const listar = async (req, res) => {
    try {
        const automoveis = await prisma.automovel.findMany({
            include: {
                estadias: true
            }
        });

        res.status(200).json(automoveis);
    } catch (err) {
        res.status(500).json(err);
    }
};

const buscarPorPlaca = async (req, res) => {
    try {
        const { placa } = req.params;

        const automovel = await prisma.automovel.findUnique({
            where: { placa },
            include: {
                estadias: true
            }
        });

        res.status(200).json(automovel);
    } catch (err) {
        res.status(500).json(err);
    }
};

const cadastrar = async (req, res) => {
    try {
        const automovel = req.body;

        const novo = await prisma.automovel.create({
            data: automovel
        });

        res.status(201).json(novo);
    } catch (err) {
        res.status(500).json(err);
    }
};

const editar = async (req, res) => {
    try {
        const { placa } = req.params;

        const atualizado = await prisma.automovel.update({
            where: { placa },
            data: req.body
        });

        res.status(200).json(atualizado);
    } catch (err) {
        res.status(500).json(err);
    }
};

const excluir = async (req, res) => {
    try {
        const { placa } = req.params;

        const removido = await prisma.automovel.delete({
            where: { placa }
        });

        res.status(200).json(removido);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    listar,
    buscarPorPlaca,
    cadastrar,
    editar,
    excluir
};