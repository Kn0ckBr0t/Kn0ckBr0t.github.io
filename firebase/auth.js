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
            window.location.href = 'index';
        })
        .catch((error) => {
            const errormessage = document.querySelector('.login__form--error');
            document.querySelector('.login__form--error').style.display = 'block';
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
        const promoCheckbox = signupForm.querySelector('input[name="terms"]');
        
        if (password !== rptpassword) {
            const errorMessage = document.querySelector('.signup__form--error');
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'As senhas não são iguais';
            return;
        }
        
        if (!promoCheckbox.checked) {
            const errorMessage = document.querySelector('.signup__form--error');
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Aceite os termos de uso';
            return;
        }
        
        signup(event, email, password);
    });
}

const signup = (event, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User signed up:', userCredential.user);
            window.location.href = 'login';
        })
        .catch((error) => {
            const errorMessage = document.querySelector('.signup__form--error');
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Email já cadastrado';
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
            window.location.href = 'login';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
};


//SESSION

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-name').textContent = user.displayName || 'Nome não disponível';
        document.getElementById('user-email').textContent = user.email;
        console.log('User is signed in:', user);
    } else {
        const profilePage = window.location.pathname.endsWith('perfil');
        if (profilePage) {
            window.location.href = 'login';
        }
        console.log('No user is signed in');
    }
});

export { login, logout };

// DELETE

const deleteButton = document.getElementById('delete');

if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
        deleteAccount(event);
    });
}

const deleteAccount = (event) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (user) {
        user.delete()
            .then(() => {
                console.log('User account deleted');
                window.location.href = 'signup';
            })
            .catch((error) => {
                console.error('Error deleting account:', error);
            });
    } else {
        console.error('No user is signed in');
    }
};