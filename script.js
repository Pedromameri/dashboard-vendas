class SalesDashboard {
    constructor() {
        this.teams = [];
        this.lastUpdateTime = new Date();
        this.init();
    }

    init() {
        this.loadData();
        this.updateLastUpdatedTime();
        
        setInterval(() => {
            this.loadData();
            this.updateLastUpdatedTime();
        }, 30000);

        setInterval(() => {
            this.updateLastUpdatedTime();
        }, 60000);
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            this.teams = data.teams.sort((a, b) => b.vgv - a.vgv);
            
            this.renderRanking();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showError();
        }
    }

    renderRanking() {
        const container = document.getElementById('rankingContainer');
        
        if (!this.teams.length) {
            container.innerHTML = '<div class="loading">Carregando dados...</div>';
            return;
        }

        const maxVGV = Math.max(...this.teams.map(team => team.vgv));

        container.innerHTML = this.teams.map((team, index) => {
            const position = index + 1;
            return this.createTeamCard(team, position);
        }).join('');

        // Aplicar gradientes baseados no VGV
        this.applyVGVGradients(maxVGV);
    }

    createTeamCard(team, position) {
        const positionClass = this.getPositionClass(position);
        const formattedVGV = this.formatCurrency(team.vgv);

        return `
            <div class="team-card ${positionClass}" data-vgv="${team.vgv}">
                <div class="position-badge">#${position}</div>
                
                <img src="${team.managerPhoto}" 
                     alt="${team.managerName}" 
                     class="manager-avatar"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjUiIGhlaWdodD0iNjUiIHZpZXdCb3g9IjAgMCA2NSA2NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIuNSIgY3k9IjMyLjUiIHI9IjMyLjUiIGZpbGw9IiNGRjZBMDAiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzNSIgaGVpZ2h0PSIzNSIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+'">
                
                <div class="team-info">
                    <h3 class="team-name">${team.name}</h3>
                    <p class="manager-name">${team.managerName}</p>
                </div>
                
                <div class="performance-section">
                    <div class="vgv-value">${formattedVGV}</div>
                </div>
            </div>
        `;
    }

    applyVGVGradients(maxVGV) {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach((card, index) => {
            const vgv = parseInt(card.getAttribute('data-vgv'));
            const percentage = (vgv / maxVGV) * 100;
            
            let gradientColor;
            
            if (index === 0) {
                // 1º lugar - Dourado
                gradientColor = `linear-gradient(90deg, 
                    rgba(255, 215, 0, ${0.15 + (percentage/100) * 0.15}) 0%, 
                    rgba(255, 106, 0, ${0.08 + (percentage/100) * 0.1}) ${percentage}%, 
                    rgba(255, 255, 255, 0.02) 100%)`;
            } else if (index === 1) {
                // 2º lugar - Prateado
                gradientColor = `linear-gradient(90deg, 
                    rgba(192, 192, 192, ${0.12 + (percentage/100) * 0.12}) 0%, 
                    rgba(255, 106, 0, ${0.06 + (percentage/100) * 0.08}) ${percentage}%, 
                    rgba(255, 255, 255, 0.02) 100%)`;
            } else if (index === 2) {
                // 3º lugar - Bronze
                gradientColor = `linear-gradient(90deg, 
                    rgba(205, 127, 50, ${0.12 + (percentage/100) * 0.12}) 0%, 
                    rgba(255, 106, 0, ${0.06 + (percentage/100) * 0.08}) ${percentage}%, 
                    rgba(255, 255, 255, 0.02) 100%)`;
            } else {
                // Outros - Laranja
                gradientColor = `linear-gradient(90deg, 
                    rgba(255, 106, 0, ${0.08 + (percentage/100) * 0.12}) 0%, 
                    rgba(255, 106, 0, ${0.04 + (percentage/100) * 0.06}) ${percentage}%, 
                    rgba(255, 255, 255, 0.02) 100%)`;
            }
            
            // Aplica o gradiente com animação
            setTimeout(() => {
                card.style.background = gradientColor;
            }, index * 200);
        });
    }

    getPositionClass(position) {
        switch(position) {
            case 1: return 'first-place';
            case 2: return 'second-place';
            case 3: return 'third-place';
            default: return '';
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    updateLastUpdatedTime() {
        const now = new Date();
        const diffMinutes = Math.floor((now - this.lastUpdateTime) / 60000);
        
        const lastUpdatedElement = document.getElementById('lastUpdated');
        
        if (diffMinutes === 0) {
            lastUpdatedElement.textContent = 'Última atualização: agora';
        } else if (diffMinutes === 1) {
            lastUpdatedElement.textContent = 'Última atualização: 1 minuto atrás';
        } else {
            lastUpdatedElement.textContent = `Última atualização: ${diffMinutes} minutos atrás`;
        }
    }

    showError() {
        const container = document.getElementById('rankingContainer');
        container.innerHTML = `
            <div class="loading">
                <span style="color: #FF6A00;">Erro ao carregar dados. Verificando novamente...</span>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SalesDashboard();
});
