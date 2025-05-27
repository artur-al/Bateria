var alertas = [];

function obterDadosLevada(idLevada) {
    fetch(`/levadas/status/${idLevada}`)
        .then(resposta => {
            if (resposta.status == 200) {
                resposta.json().then(resposta => {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    verificarStatus(resposta, idLevada);
                });
            } else {
                console.error(`Nenhum dado encontrado para a levada ${idLevada} ou erro na API`);
            }
        })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados da levada: ${error.message}`);
        });
}

function verificarStatus(resposta, idLevada) {
    const progresso = resposta.progresso;
    const prazo = new Date(resposta.prazo);
    const hoje = new Date();
    const diasRestantes = Math.ceil((prazo - hoje) / (1000 * 60 * 60 * 24));
    
    let status = '';
    let statusClass = '';
    
    if (progresso < 50 && diasRestantes < 3) {
        status = 'Atrasada';
        statusClass = 'perigo-frio';
    } else if (progresso < 70 && diasRestantes < 7) {
        status = 'Em risco';
        statusClass = 'alerta-frio';
    } else if (progresso > 90 && diasRestantes > 14) {
        status = 'Adiantada';
        statusClass = 'alerta-quente';
    } else {
        status = 'No prazo';
        statusClass = 'ideal';
    }
    
    atualizarCardLevada(idLevada, progresso, status, statusClass);
}

function atualizarCardLevada(idLevada, progresso, status, statusClass) {
    const card = document.querySelector(`.card-levada[data-id="${idLevada}"]`);
    if (card) {
        const statusElement = card.querySelector('.status');
        const progressoBar = card.querySelector('.progresso-bar');
        
        statusElement.textContent = status;
        statusElement.className = `status ${statusClass}`;
        progressoBar.style.width = `${progresso}%`;
    }
}

function atualizacaoPeriodica() {
    JSON.parse(sessionStorage.LEVADAS || '[]').forEach(levada => {
        obterDadosLevada(levada.id);
    });
    setTimeout(atualizacaoPeriodica, 30000); 
}