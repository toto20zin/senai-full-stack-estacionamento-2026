
const router = require("express").Router();

const {
    listar,
    buscarPorPlaca,
    cadastrar,
    editar,
    excluir
} = require("../controllers/automovel.controller");

router.get("/listar", listar);
router.get("/buscar/:placa", buscarPorPlaca);
router.post("/cadastrar", cadastrar);
router.put("/editar/:placa", editar);
router.delete("/excluir/:placa", excluir);

module.exports = router;

