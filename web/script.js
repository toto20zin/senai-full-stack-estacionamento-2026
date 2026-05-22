const url = 'http://localhost:3000/automoveis';

let veiculos = [];
let veiculoAtual = null;

carregarVeiculos();

function carregarVeiculos() {

    fetch(url + '/listar')

        .then(response => response.json())

        .then(data => {

            veiculos = data;

            listarCards();
        })

        .catch(() => {

            alert("Erro ao carregar veículos");
        });
}

function pesquisarVeiculo() {

    const placaPesquisa = document
        .querySelector('#buscarPlaca')
        .value
        .trim()
        .toUpperCase();

    if (!placaPesquisa) {

        carregarVeiculos();

        return;
    }

    fetch(url + '/buscar/' + placaPesquisa)

        .then(response => {

            if (!response.ok) {

                throw new Error();
            }

            return response.json();
        })

        .then(veiculo => {

            veiculos = [veiculo];

            listarCards();
        })

        .catch(() => {

            alert("Veículo não encontrado");
        });
}

function listarCards() {

    const container = document.querySelector('#cards');

    container.innerHTML = '';

    veiculos.forEach(veiculo => {

        const card = document.createElement('div');

        card.classList.add('box');

        card.innerHTML = `
        
        <i class="fa-solid fa-car"></i>

        <p class="nome">${veiculo.modelo}</p>

        <p><b>Placa:</b> ${veiculo.placa}</p>

        <p><b>Marca:</b> ${veiculo.marca}</p>

        <p><b>Tipo:</b> ${veiculo.tipo}</p>

        <button onclick="abrirDetalhes('${veiculo.placa}')">
            Ver
        </button>
        `;

        container.appendChild(card);
    });
}

function abrirDetalhes(placa) {

    veiculoAtual = veiculos.find(v => v.placa == placa);

    tituloVeiculo.innerHTML = veiculoAtual.modelo;

    placaEdit.value = veiculoAtual.placa;

    proprietarioEdit.value = veiculoAtual.proprietario;

    modeloEdit.value = veiculoAtual.modelo;

    tipoEdit.value = veiculoAtual.tipo;

    marcaEdit.value = veiculoAtual.marca;

    corEdit.value = veiculoAtual.cor || '';

    anoEdit.value = veiculoAtual.ano || '';

    telefoneEdit.value = veiculoAtual.telefone || '';

    detalhes.classList.remove('oculto');
}

document.querySelector('#formCad').addEventListener('submit', function (e) {

    e.preventDefault();

    const novoVeiculo = {

        placa: placa.value.toUpperCase(),

        proprietario: proprietario.value,

        modelo: modelo.value,

        tipo: tipo.value,

        marca: marca.value,

        cor: cor.value,

        ano: ano.value ? Number(ano.value) : null,

        telefone: telefone.value
    };

    fetch(url + '/cadastrar', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json'
        },

        body: JSON.stringify(novoVeiculo)
    })

        .then(response => {

            if (!response.ok) {

                throw new Error();
            }

            return response.json();
        })

        .then(() => {

            alert("Veículo cadastrado com sucesso!");

            cadastro.classList.add('oculto');

            document.querySelector('#formCad').reset();

            carregarVeiculos();
        })

        .catch(() => {

            alert("Erro ao cadastrar veículo");
        });
});

function salvarEdicao() {

    const veiculoEditado = {

        proprietario: proprietarioEdit.value,

        modelo: modeloEdit.value,

        tipo: tipoEdit.value,

        marca: marcaEdit.value,

        cor: corEdit.value,

        ano: anoEdit.value ? Number(anoEdit.value) : null,

        telefone: telefoneEdit.value
    };

    fetch(url + '/editar/' + veiculoAtual.placa, {

        method: 'PUT',

        headers: {

            'Content-Type': 'application/json'
        },

        body: JSON.stringify(veiculoEditado)
    })

        .then(response => {

            if (!response.ok) {

                throw new Error();
            }

            return response.json();
        })

        .then(() => {

            alert("Veículo atualizado com sucesso!");

            detalhes.classList.add('oculto');

            carregarVeiculos();
        })

        .catch(() => {

            alert("Erro ao editar veículo");
        });
}

function excluirVeiculoAtual() {

    if (!confirm("Deseja excluir este veículo?")) return;

    fetch(url + '/excluir/' + veiculoAtual.placa, {

        method: 'DELETE'

    })

    .then(response => {

        if (!response.ok) {

            throw new Error();
        }

        return response.json();
    })

    .then(() => {

        alert("Veículo excluído com sucesso!");

        detalhes.classList.add('oculto');

        carregarVeiculos();
    })

    .catch(() => {

        alert("Erro ao excluir veículo");
    });
}