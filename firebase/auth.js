import { auth } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';

//LOGIN

const loginForm = document.querySelector('.login__form--form');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = loginForm.querySelector('input[name="email"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;
        login(event, email, password);
    });
}

const login = (event, email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User signed in:', userCredential.user);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing in:', error);
        });
};

//SIGNUP

const signupForm = document.querySelector('.signup__form--form');

if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = signupForm.querySelector('input[name="email"]').value;
        const password = signupForm.querySelector('input[name="password"]').value;
        const rptpassword = signupForm.querySelector('input[name="rptpassword"]').value;
        const promoCheckbox = signupForm.querySelector('input[name="promo"]');
        
        if (password !== rptpassword) {
            console.error('Passwords do not match');
            return;
        }
        
        if (!promoCheckbox.checked) {
            console.error('You must agree to the promotional terms');
            return;
        }
        
        signup(event, email, password);
    });
}

const signup = (event, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User signed up:', userCredential.user);
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Error signing in:', error);
        });
};

//LOGOUT

const logoutButton = document.getElementById('sair');

if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
        logout(event);
    });
}

const logout = (event) => {
    event.preventDefault();
    signOut(auth)
        .then(() => {
            console.log('User signed out');
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
};


//SESSION

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);
    } else {
        console.log('No user is signed in');
    }
});

export { login, logout };