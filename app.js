document.addEventListener('DOMContentLoaded', () => {
    if (!AuthManager.isAuthenticated()) return;
    
    // Initialize managers
    const videoManager = new VideoManager();
    const calendar = new Calendar();
    
    // Load section based on hash
    function loadSection(sectionId) {
        const mainContent = document.querySelector('.main-content');
        
        // Hide all sections
        mainContent.innerHTML = '';
        
        // Load the requested section
        switch(sectionId) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'training':
                loadTraining(videoManager);
                break;
            case 'hr':
                loadHR();
                break;
            case 'calendar':
                loadCalendar(calendar);
                break;
            case 'documents':
                loadDocuments();
                break;
            case 'notices':
                loadNotices();
                break;
            case 'profile':
                loadProfile();
                break;
            default:
                loadDashboard();
        }
    }
    
    // Navigation handling
    window.addEventListener('hashchange', () => {
        const sectionId = window.location.hash.substring(1);
        loadSection(sectionId);
    });
    
    // Initial load
    const initialSection = window.location.hash.substring(1) || 'dashboard';
    loadSection(initialSection);
    
    // Section loading functions
    function loadDashboard() {
        const html = `
            <section id="dashboard">
                <h2 class="widget-title">Welcome to Your Portal</h2>
                <p>Access all employee resources in one place.</p>
                
                <div class="quick-stats">
                    <div class="stat-card">
                        <h3>5</h3>
                        <p>New Training Videos</p>
                    </div>
                    <div class="stat-card">
                        <h3>3</h3>
                        <p>Company Notices</p>
                    </div>
                </div>
            </section>
        `;
        document.querySelector('.main-content').innerHTML = html;
    }
    
    function loadTraining(videoManager) {
        // Implementation would load videos from videoManager
        const html = `
            <section id="training">
                <h2 class="widget-title">Training Videos</h2>
                <div class="video-grid">
                    <div class="video-card">
                        <div class="video-thumbnail">Safety Training</div>
                        <div class="video-info">
                            <div class="video-title">Safety Procedures</div>
                            <div class="video-duration">15:23</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        document.querySelector('.main-content').innerHTML = html;
    }
    
    function loadCalendar(calendar) {
        const html = `
            <section id="calendar">
                <h2 class="widget-title">Company Calendar</h2>
                <div class="calendar-container">
                    <div id="calendar"></div>
                </div>
            </section>
        `;
        document.querySelector('.main-content').innerHTML = html;
        calendar.render();
    }
    
    // Other section loaders would be similar...
});


// Update time display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('current-time').textContent = timeString;
}

// Update every second
setInterval(updateTime, 1000);
updateTime(); // Initial call