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

        // Calculate max VGV for progress bar scaling
        const maxVGV = Math.max(...this.teams.map(team => team.vgv));

        container.innerHTML = this.teams.map((team, index) => {
            const position = index + 1;
            const progressPercentage = (team.vgv / maxVGV) * 100;
            
            return this.createTeamCard(team, position, progressPercentage);
        }).join('');

        // Animate progress bars after rendering
        setTimeout(() => {
            this.animateProgressBars();
        }, 100);
    }

    createTeamCard(team, position, progressPercentage) {
        const positionClass = this.getPositionClass(position);
        const formattedVGV = this.formatCurrency(team.vgv);

        return `
            <div class="team-card ${positionClass}" data-team="${team.name}">
                <div class="position-badge">#${position}</div>
                
                <img src="${team.managerPhoto}" 
                     alt="${team.managerName}" 
                     class="manager-avatar"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGRjZBMDAiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZmZmIj4KPHA+VXNlcjwvcD4KPC9zdmc+Cjwvc3ZnPgo='">
                
                <div class="team-info">
                    <h3 class="team-name">${team.name}</h3>
                    <p class="manager-name">${team.managerName}</p>
                </div>
                
                <div class="performance-section">
                    <div class="vgv-value">${formattedVGV}</div>
                    <div class="progress-container">
                        <div class="progress-bar" data-width="${progressPercentage}"></div>
                    </div>
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

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach((bar, index) => {
            const targetWidth = bar.getAttribute('data-width');
            
            // Stagger animation for visual appeal
            setTimeout(() => {
                bar.style.width = targetWidth + '%';
            }, index * 150);
        });
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