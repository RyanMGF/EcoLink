// --- DADOS INICIAIS (MOCK) ---
let posts = [
    {
        id: 1,
        school: 'ECIT Elpidio de Almeida',
        author: 'Turma de Desenvolvimento de Sistemas',
        title: 'Horta Comunitária Vertical',
        description: 'Criamos uma horta utilizando garrafas PET recolhidas na cantina. Agora temos temperos frescos para o almoço!',
        likes: 24,
        timestamp: 'Há 2 horas'
    },
    {
        id: 2,
        school: 'Escola Estadual Prata',
        author: 'Clube de Ciências',
        title: 'Campanha Zero Plástico',
        description: 'Substituímos os copos descartáveis por canecas permanentes para todos os funcionários.',
        likes: 18,
        timestamp: 'Há 4 horas'
    },
    {
        id: 3,
        school: 'ECIT Elpidio de Almeida',
        author: 'João Lucas & Pedro Miguel',
        title: 'Sensor de Umidade para Jardim',
        description: 'Protótipo com Arduino que avisa quando a planta precisa de água, economizando recursos hídricos.',
        likes: 31,
        timestamp: 'Há 1 dia'
    }
];

let ranking = [
    { school: 'ECIT Elpidio de Almeida', points: 1250, practices: 12 },
    { school: 'Escola Estadual Prata', points: 980, practices: 8 },
    { school: 'Cidadã Integral Técnica', points: 850, practices: 6 },
    { school: 'Colégio Nossa Senhora', points: 620, practices: 4 },
];

let pollOptions = [
    { id: 'reciclagem', label: 'Faço Coleta Seletiva', votes: 45 },
    { id: 'energia', label: 'Economizo Energia/Água', votes: 32 },
    { id: 'plantio', label: 'Tenho plantas em casa', votes: 28 },
    { id: 'transporte', label: 'Vou a pé ou de bike', votes: 15 },
];

let pollVoted = false;
let currentSearchTerm = '';

// --- NAVEGAÇÃO ---
function switchTab(tabName) {
    // Esconde todas as views
    document.getElementById('view-home').classList.add('hidden-view');
    document.getElementById('view-feed').classList.add('hidden-view');
    document.getElementById('view-ranking').classList.add('hidden-view');
    document.getElementById('view-about').classList.add('hidden-view');

    // Remove active de todos botões desktop
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-emerald-600');
        btn.classList.add('text-gray-500');
    });

     // Remove active de todos botões mobile
     document.querySelectorAll('.mobile-btn').forEach(btn => {
        btn.classList.remove('text-emerald-600');
        btn.classList.add('text-gray-400');
    });

    // Mostra a view selecionada
    document.getElementById(`view-${tabName}`).classList.remove('hidden-view');
    
    // Ativa botão desktop
    const activeBtn = document.getElementById(`btn-${tabName}`);
    if(activeBtn) {
        activeBtn.classList.remove('text-gray-500');
        activeBtn.classList.add('text-emerald-600');
    }

    // Ativa botão mobile
    const activeMob = document.getElementById(`mob-${tabName}`);
    if(activeMob) {
        activeMob.classList.remove('text-gray-400');
        activeMob.classList.add('text-emerald-600');
    }

    // Rerenderiza conteúdos se necessário
    if(tabName === 'feed') loadFeed();
    if(tabName === 'ranking') renderRanking();
    if(tabName === 'about') initTeamCardAnimation();
}

// --- LÓGICA DO FEED ---
function renderFeedSkeleton() {
    const container = document.getElementById('posts-container');
    container.innerHTML = ''; // Limpa o container
    
    // Cria 3 cards de esqueleto
    for (let i = 0; i < 3; i++) {
        const skeletonHtml = `
            <div class="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
                <div class="flex justify-between items-start mb-4">
                    <div class="h-6 w-48 bg-gray-200 rounded-full"></div>
                    <div class="h-4 w-16 bg-gray-200 rounded-full"></div>
                </div>
                <div class="h-6 w-3/4 bg-gray-200 rounded-full mb-3"></div>
                <div class="h-4 w-full bg-gray-200 rounded-full mb-1"></div>
                <div class="h-4 w-5/6 bg-gray-200 rounded-full mb-5"></div>
                <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="h-4 w-32 bg-gray-200 rounded-full"></div>
                    <div class="h-8 w-24 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        `;
        container.innerHTML += skeletonHtml;
    }
}

function renderFeed() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    let filteredPosts = posts;

    // Aplica filtro de busca
    if (currentSearchTerm) {
        const searchTerm = currentSearchTerm.toLowerCase();
        filteredPosts = posts.filter(p => 
            p.title.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10 px-6 bg-white rounded-xl border border-dashed border-gray-200">
                <i class="ph ph-binoculars text-4xl text-gray-400 mb-3"></i>
                <h4 class="font-bold text-lg text-gray-800">Nenhum resultado encontrado</h4>
                <p class="text-gray-500">Tente ajustar sua busca.</p>
            </div>`;
        return;
    }

    filteredPosts.forEach(post => {
        const html = `
            <div class="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md fade-in card-hover">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-100 px-3 py-1 rounded-full">
                        <i class="ph-fill ph-student"></i>
                        ${post.school}
                    </div>
                    <span class="text-xs text-gray-400">${post.timestamp}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${post.title}</h3>
                <p class="text-gray-600 mb-4 leading-relaxed">${post.description}</p>
                
                <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div class="text-sm text-gray-600">Autor: <span class="font-medium text-gray-800">${post.author}</span></div>
                    <button onclick="handleLike(${post.id})" class="flex items-center gap-2 text-gray-500 hover:text-red-500 group">
                        <i class="ph-fill ph-heart text-xl ${post.likes > 0 ? 'text-red-400' : 'text-slate-300'} group-hover:text-red-400"></i>
                        <span>${post.likes} Apoios</span>
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

function handleLike(id) {
    const post = posts.find(p => p.id === id);
    if(post) {
        post.likes++;
        renderFeed(); // Re-renderiza para atualizar número e cor
    }
}

function loadFeed() {
    renderFeedSkeleton();
    // Simula um carregamento de rede (ex: 750ms)
    setTimeout(() => {
        renderFeed();
    }, 750);
}

// --- LÓGICA DO FORMULÁRIO ---
function openModal() {
    const modal = document.getElementById('modal-form');
    modal.classList.remove('hidden-view');
    modal.classList.add('fade-in');
}

function closeModal() {
    const modal = document.getElementById('modal-form');
    modal.classList.add('hidden-view');
    modal.classList.remove('fade-in');
}

function handleAddPost(e) {
    e.preventDefault();

    const title = document.getElementById('input-title').value;
    const author = document.getElementById('input-author').value;
    const school = document.getElementById('input-school').value;
    const desc = document.getElementById('input-desc').value;

    // Adiciona ao feed
    const newPost = {
        id: Date.now(),
        school,
        author,
        title,
        description: desc,
        likes: 0,
        timestamp: 'Agora mesmo'
    };
    posts.unshift(newPost); // Adiciona no início

    // Atualiza o ranking (lógica simulada)
    const schoolIndex = ranking.findIndex(r => r.school === school);
    if(schoolIndex >= 0) {
        ranking[schoolIndex].points += 50;
        ranking[schoolIndex].practices += 1;
        // Reordena ranking
        ranking.sort((a,b) => b.points - a.points);
    }

    // Reset e fecha
    document.querySelector('form').reset();
    closeModal();
    loadFeed();
    
    alert('✨ Ação registrada com sucesso! (+50 pontos para sua escola)');
}

// --- LÓGICA DO RANKING E ENQUETE ---
function renderRanking() {
    // Render Lista
    const container = document.getElementById('ranking-container');
    container.innerHTML = '';

    ranking.forEach((item, index) => {
        let badgeClass = 'bg-emerald-50 text-emerald-600';
        let containerClass = 'bg-white border-slate-200';
        let trophy = '';

        if(index === 0) {
            badgeClass = 'bg-yellow-100 text-yellow-600';
            containerClass = 'bg-amber-50 border-amber-200 shadow-md';
            trophy = '<i class="ph-fill ph-trophy text-amber-400 text-3xl ml-4"></i>';
        } else if (index === 1) {
            badgeClass = 'bg-slate-200 text-slate-600';
        } else if (index === 2) {
            badgeClass = 'bg-orange-200 text-orange-700';
        }

        const html = `
            <div class="flex items-center p-4 rounded-xl border ${containerClass}">
                <div class="w-12 h-12 flex items-center justify-center rounded-full font-bold text-xl mr-4 ${badgeClass}">
                    ${index + 1}º
                </div>
                <div class="flex-grow">
                    <h3 class="font-bold text-gray-800 text-lg">${item.school}</h3>
                    <div class="text-sm text-gray-500">${item.practices} ações registradas</div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-emerald-600">${item.points}</div>
                    <div class="text-xs text-gray-400 uppercase tracking-wide">Pontos Eco</div>
                </div>
                ${trophy}
            </div>
        `;
        container.innerHTML += html;
    });

    // Render Enquete
    renderPoll();
}

function renderPoll() {
    const container = document.getElementById('poll-container');
    container.innerHTML = '';
    
    const totalVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);

    pollOptions.forEach(option => {
        const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
        
        // Estilo da barra
        const barStyle = pollVoted 
            ? `width: ${percentage}%` 
            : 'width: 0%';
        
        const btnClass = pollVoted
            ? 'border-transparent bg-white/10 cursor-default'
            : 'border-emerald-500 hover:bg-emerald-600';

        const html = `
            <div class="relative">
                <button onclick="handleVote('${option.id}')" ${pollVoted ? 'disabled' : ''} 
                    class="w-full text-left py-3 px-4 rounded-lg border relative z-10 flex justify-between items-center ${btnClass}">
                    <span>${option.label}</span>
                    ${pollVoted ? `<span class="font-bold">${percentage}%</span>` : ''}
                </button>
                ${pollVoted ? `<div class="absolute top-0 left-0 h-full bg-emerald-500/30 rounded-lg poll-bar" style="${barStyle}"></div>` : ''}
            </div>
        `;
        container.innerHTML += html;
    });

    if(pollVoted) {
        container.innerHTML += `<p class="text-sm text-emerald-300 mt-2 text-center fade-in">Obrigado por votar!</p>`;
    }
}

function handleVote(id) {
    if(pollVoted) return;
    
    const option = pollOptions.find(o => o.id === id);
    if(option) {
        option.votes++;
        pollVoted = true;
        renderPoll();
    }
}

// Inicializa na Home
document.addEventListener('DOMContentLoaded', () => {
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    const searchInput = document.getElementById('search-input');
    const debouncedSearch = debounce(() => {
        // Não precisa do skeleton aqui para uma busca rápida
        renderFeed();
    }, 300); // 300ms de atraso

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        debouncedSearch();
    });

    // Adiciona listener para fechar modal ao clicar fora
    const modal = document.getElementById('modal-form');
    modal.addEventListener('click', function(e) {
        // Se o clique foi no próprio fundo do modal (e não nos filhos)
        if (e.target === this) {
            closeModal();
        }
    });

    switchTab('home');
});