class SalesDashboard {
    constructor() {
        this.teams = [];
        this.lastUpdateTime = new Date();
        this.init();
    }

    init() {
        this.loadData();
        this.updateLastUpdatedTime();
        
        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.loadData();
            this.updateLastUpdatedTime();
        }, 30000);

        // Update time display every minute
        setInterval(() => {
            this.updateLastUpdatedTime();
        }, 60000);
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            // Sort teams by VGV (highest first)
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

        // Calculate max VGV for progress scaling
        const maxVGV = Math.max(...this.teams.map(team => team.vgv));

        container.innerHTML = this.teams.map((team, index) => {
            const position = index + 1;
            const fillPercentage = (team.vgv / maxVGV) * 100;
            
            return this.createTeamCard(team, position, fillPercentage);
        }).join('');

        // Animate card backgrounds after rendering
        setTimeout(() => {
            this.animateCardBackgrounds();
        }, 100);
    }

    createTeamCard(team, position, fillPercentage) {
        const positionClass = this.getPositionClass(position);
        const formattedVGV = this.formatCurrency(team.vgv);

        return `
            <div class="team-card ${positionClass}" data-team="${team.name}" data-fill="${fillPercentage}">
                <div class="position-badge">#${position}</div>
                
                <img src="${team.managerPhoto}" 
                     alt="${team.managerName}" 
                     class="manager-avatar"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzUiIGN5PSIzNSIgcj0iMzUiIGZpbGw9IiNGRjZBMDAiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmIj4KPHBhdGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+'">
                
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

    animateCardBackgrounds() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach((card, index) => {
            const fillPercentage = card.getAttribute('data-fill');
            
            // Stagger animation for visual appeal
            setTimeout(() => {
                // Anima o fundo do card (::before)
                card.style.setProperty('--fill-width', fillPercentage + '%');
                
                // Aplica a animação via CSS custom property
                const beforeElement = window.getComputedStyle(card, '::before');
                card.style.setProperty('--fill-width', fillPercentage + '%');
                
                // Força a animação do ::before
                requestAnimationFrame(() => {
                    card.style.setProperty('--dynamic-width', fillPercentage + '%');
                });
                
            }, index * 150);
        });

        // Aplica a largura dinamicamente
        setTimeout(() => {
            teamCards.forEach(card => {
                const fillPercentage = card.getAttribute('data-fill');
                card.style.setProperty('--fill-width', fillPercentage + '%');
                
                // Atualiza o ::before via JavaScript
                const styleSheet = document.styleSheets[0];
                const cardSelector = `.team-card[data-team="${card.dataset.team}"]::before`;
                
                // Remove regra anterior se existir
                for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
                    if (styleSheet.cssRules[i].selectorText === cardSelector) {
                        styleSheet.deleteRule(i);
                    }
                }
                
                // Adiciona nova regra
                styleSheet.insertRule(`
                    ${cardSelector} {
                        width: ${fillPercentage}% !important;
                    }
                `, styleSheet.cssRules.length);
            });
        }, 500);
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

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SalesDashboard();
});
