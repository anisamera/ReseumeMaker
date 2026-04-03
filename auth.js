/**
 * Auth.js - Client-side authentication simulation for Resume Maker
 * Uses localStorage for persistence.
 */

const AUTH_CONFIG = {
    USER_KEY: 'resume_maker_users',
    SESSION_KEY: 'resume_maker_session',
    PASSWORD_MIN_LENGTH: 8
};

const Auth = {
    // --- CORE METHODS ---

    /**
     * Register a new user
     */
    register(identity, password) {
        const validation = this.validateIdentity(identity);
        if (!validation.isValid) return { success: false, message: validation.message };

        if (!password || password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
            return { success: false, message: `Kata laluan mestilah sekurang-kurangnya ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} aksara.` };
        }

        const users = this._getUsers();
        if (users[identity]) {
            return { success: false, message: 'Emel atau nombor telefon ini telah pun berdaftar.' };
        }

        // Create new user
        const newUser = {
            id: 'user_' + Date.now(),
            identity: identity,
            password: this._hash(password), // Simulated hashing
            createdAt: new Date().toISOString()
        };

        users[identity] = newUser;
        this._setUsers(users);

        // Auto login after registration
        this._setSession(newUser.id);
        return { success: true, message: 'Pendaftaran berjaya!', user: newUser };
    },

    /**
     * Login existing user
     */
    login(identity, password) {
        const users = this._getUsers();
        const user = users[identity];

        if (!user || user.password !== this._hash(password)) {
            return { success: false, message: 'Emel/No. Telefon atau kata laluan tidak sah.' };
        }

        this._setSession(user.id);
        return { success: true, message: 'Log masuk berjaya!', user: user };
    },

    /**
     * Logout current user
     */
    logout() {
        localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
        window.location.href = 'index.html';
    },

    /**
     * Forgot password simulation
     */
    forgotPassword(identity) {
        const users = this._getUsers();
        if (!users[identity]) {
            return { success: false, message: 'Identiti tidak dijumpai.' };
        }
        // In a real app, this would send an email/SMS. Here we just return success.
        return { success: true, message: 'Arahan menetap semula kata laluan telah dihantar.' };
    },

    // --- STATE HELPERS ---

    isAuthenticated() {
        return !!localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    },

    getCurrentUserId() {
        return localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    },

    getCurrentUser() {
        const id = this.getCurrentUserId();
        if (!id) return null;
        const users = this._getUsers();
        return Object.values(users).find(u => u.id === id) || null;
    },

    /**
     * Returns true if identity is a valid Malaysian phone number or email
     */
    validateIdentity(id) {
        if (!id) return { isValid: false, message: 'Sila masukkan emel atau nombor telefon.' };

        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Malaysian phone regex: starts with 01 or +601, followed by 7-9 digits
        const phoneRegex = /^(?:\+601|01)[0-46-9]-?[0-9]{7,8}$/;

        if (emailRegex.test(id)) return { isValid: true, type: 'email' };
        if (phoneRegex.test(id)) return { isValid: true, type: 'phone' };

        return { isValid: false, message: 'Format emel atau nombor telefon Malaysia tidak sah.' };
    },

    // --- PRIVATE UTILS ---

    _getUsers() {
        const data = localStorage.getItem(AUTH_CONFIG.USER_KEY);
        return data ? JSON.parse(data) : {};
    },

    _setUsers(users) {
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(users));
    },

    _setSession(userId) {
        localStorage.setItem(AUTH_CONFIG.SESSION_KEY, userId);
    },

    _hash(str) {
        // Simple b64 simulation for "secure storage" demonstration
        // In reality, use bcrypt or similar on a server
        return btoa('salt_' + str);
    }
};

// Global export
window.Auth = Auth;
