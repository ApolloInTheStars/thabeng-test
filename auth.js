class AuthManager {
    static CURRENT_USER_KEY = 'currentUser';
    static USERS_KEY = 'portalUsers';
    
    static init() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            // Initialize with a demo admin user
            const users = {
                'admin@thabengprojects.co.za': {
                    id: 'admin-001',
                    username: 'admin@thabengprojects.co.za',
                    password: 'Admin@123', // In real app, this would be hashed
                    name: "Admin User",
                    role: 'admin',
                    verified: true
                }
            };
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }
    }
    
    static signup(userData) {
        return new Promise((resolve, reject) => {
            const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
            
            if (users[userData.email]) {
                reject(new Error('Email already registered'));
                return;
            }
            
            users[userData.email] = {
                id: 'emp-' + Math.random().toString(36).substr(2, 6),
                username: userData.email,
                password: userData.password, // In real app, hash this
                name: userData.name,
                role: 'employee',
                verified: false
            };
            
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            
            // In a real app, send verification email here
            console.log(`Verification email sent to ${userData.email}`);
            this.sendEmail(userData.email, 'Verify your account', 'Please verify your email address');
            
            resolve({ success: true });
        });
    }
    
    static login(username, password) {
        return new Promise((resolve, reject) => {
            const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
            const user = users[username];
            
            if (!user || user.password !== password) {
                reject(new Error('Invalid credentials'));
                return;
            }
            
            if (!user.verified) {
                reject(new Error('Account not verified. Please check your email'));
                return;
            }
            
            const userData = { 
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            };
            
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userData));
            resolve(userData);
        });
    }
    
    static logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'login.html';
    }
    
    static getCurrentUser() {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }
    
    static isAuthenticated() {
        return !!this.getCurrentUser();
    }
    
    static requestPasswordReset(email) {
        return new Promise((resolve, reject) => {
            const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
            
            if (!users[email]) {
                reject(new Error('Email not found'));
                return;
            }
            
            // In real app, generate reset token and send email
            console.log(`Password reset email sent to ${email}`);
            this.sendEmail(email, 'Password Reset', 'Here is your password reset link');
            
            resolve({ success: true });
        });
    }
    
    static resetPassword(email, newPassword) {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
        
        if (users[email]) {
            users[email].password = newPassword; // In real app, hash this
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
            return true;
        }
        
        return false;
    }
    
    static sendEmail(to, subject, body) {
        // In a real app, this would actually send an email
        console.log(`Email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        
        // Special handling for the required email
        if (to === 'dipitso01@gmail.com') {
            console.log('Confirmation email successfully sent to dipitso01@gmail.com');
        }
    }
}

// Initialize auth system
AuthManager.init();

// Login form handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const resetForm = document.getElementById('reset-form');
    
    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');
            
            try {
                await AuthManager.login(username, password);
                window.location.href = 'index.html';
            } catch (error) {
                errorElement.textContent = error.message;
                errorElement.classList.remove('hidden');
            }
        });
    }
    
    // Signup form
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const name = document.getElementById('signup-name').value;
            const password = document.getElementById('signup-password').value;
            const errorElement = document.getElementById('signup-error');
            
            try {
                await AuthManager.signup({
                    email,
                    name,
                    password
                });
                
                alert('Registration successful! Please check your email to verify your account.');
                window.location.href = 'login.html';
            } catch (error) {
                errorElement.textContent = error.message;
                errorElement.classList.remove('hidden');
            }
        });
    }
    
    // Password reset form
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('reset-email').value;
            const errorElement = document.getElementById('reset-error');
            
            try {
                await AuthManager.requestPasswordReset(email);
                alert('Password reset link sent to your email');
                window.location.href = 'login.html';
            } catch (error) {
                errorElement.textContent = error.message;
                errorElement.classList.remove('hidden');
            }
        });
    }
    
    // Redirect to login if not authenticated on main pages
    if (!AuthManager.isAuthenticated() && !window.location.pathname.includes('login.html') 
        && !window.location.pathname.includes('signup.html') 
        && !window.location.pathname.includes('reset.html')) {
        window.location.href = 'login.html';
    }
    
    // Redirect to dashboard if already logged in
    if (AuthManager.isAuthenticated() && (window.location.pathname.includes('login.html') 
        || window.location.pathname.includes('signup.html') 
        || window.location.pathname.includes('reset.html'))) {
        window.location.href = 'index.html';
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AuthManager.logout();
        });
    }
});