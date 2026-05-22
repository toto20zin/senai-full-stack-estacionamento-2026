const url = 'http://localhost:3000/estadias';

let estadias = [];
let estadiaAtual = null;

carregarEstadias();

function carregarEstadias() {

    fetch(url + '/listar')

        .then(response => response.json())

        .then(data => {

            estadias = data;

            listarCards();
        })

        .catch(() => {

            alert("Erro ao carregar estadias");
        });
}

function listarCards() {

    const container = document.querySelector('#cards');

    container.innerHTML = '';

    estadias.forEach(estadia => {

        const card = document.createElement('div');

        card.classList.add('box');

        card.innerHTML = `

        <i class="fa-solid fa-square-parking"></i>

        <p class="nome">${estadia.placa}</p>

        <p><b>Entrada:</b></p>

        <p>${new Date(estadia.entrada).toLocaleString()}</p>

        <p><b>Valor/Hora:</b> R$ ${estadia.valorHora}</p>

        <p>
            <b>Status:</b>
            ${estadia.saida ? 'Finalizado' : 'Em aberto'}
        </p>

        <button onclick="abrirDetalhes(${estadia.id})">
            Ver
        </button>
        `;

        container.appendChild(card);
    });
}

function abrirDetalhes(id) {

    estadiaAtual = estadias.find(e => e.id == id);

    tituloEstadia.innerHTML =
        "Estadia #" + estadiaAtual.id;

    placaEdit.value = estadiaAtual.placa;

    entradaEdit.value =
        new Date(estadiaAtual.entrada).toLocaleString();

    saidaEdit.value = estadiaAtual.saida
        ? estadiaAtual.saida.slice(0, 16)
        : '';

    valorHoraEdit.value = estadiaAtual.valorHora;

    valorTotalEdit.value =
        estadiaAtual.valorTotal || '';

    detalhes.classList.remove('oculto');
}

document.querySelector('#formCad')
    .addEventListener('submit', function (e) {

        e.preventDefault();

        const novaEstadia = {

            placa: placa.value,

            valorHora: Number(valorHora.value)
        };

        fetch(url + '/cadastrar', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json'
            },

            body: JSON.stringify(novaEstadia)
        })

            .then(response => {

                if (!response.ok) {

                    throw new Error();
                }

                return response.json();
            })

            .then(() => {

                alert("Estadia cadastrada com sucesso!");

                cadastro.classList.add('oculto');

                document.querySelector('#formCad').reset();

                carregarEstadias();
            })

            .catch(() => {

                alert("Erro ao cadastrar estadia");
            });
    });

function salvarEdicao() {

    const estadiaEditada = {

        saida: saidaEdit.value
    };

    fetch(url + '/editar/' + estadiaAtual.id, {

        method: 'PUT',

        headers: {

            'Content-Type': 'application/json'
        },

        body: JSON.stringify(estadiaEditada)
    })

        .then(response => {

            if (!response.ok) {

                throw new Error();
            }

            return response.json();
        })

        .then(() => {

            alert("Estadia finalizada!");

            detalhes.classList.add('oculto');

            carregarEstadias();
        })

        .catch(() => {

            alert("Erro ao finalizar estadia");
        });
}

function excluirEstadiaAtual() {

    if (!confirm("Deseja excluir esta estadia?")) return;

    fetch(url + '/excluir/' + estadiaAtual.id, {

        method: 'DELETE'
    })

        .then(response => {

            if (!response.ok) {

                throw new Error();
            }

            return response.json();
        })

        .then(() => {

            alert("Estadia excluída!");

            detalhes.classList.add('oculto');

            carregarEstadias();
        })

        .catch(() => {

            alert("Erro ao excluir estadia");
        });
}