import { auth } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { updateProfile } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';

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
            window.location.href = '/';
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
            const user = userCredential.user;
            const displayName = email.split('@')[0] + Math.floor(Math.random() * 1000);
            const photoURL = 'https://imagedelivery.net/xE-VtsYZUS2Y8MtLMcbXAg/4f009d8cce14a403163a/sm';

            updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL
            }).then(() => {
                console.log('User signed up:', userCredential.user);
                window.location.href = '/';
            }).catch((error) => {
                console.error('Error updating profile:', error);
            });
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
        const loginOrProfileLink = document.getElementById('login-or-profile');
        const userNameElement = document.getElementById('user-name');
        const userEmailElement = document.getElementById('user-email');
        const userImageElement = document.querySelector('.user__card--image');

        if (loginOrProfileLink) {
            const photoURL = user.photoURL || 'https://imagedelivery.net/xE-VtsYZUS2Y8MtLMcbXAg/4f009d8cce14a403163a/sm';
            const photoName = user.displayName || 'Nome não disponível';
            loginOrProfileLink.innerHTML = '<a href="perfil"><img src="' + photoURL + '" alt="' + photoName + '" class="header__photo"></a>';
        }

        if (userNameElement) {
            userNameElement.textContent = user.displayName || 'Nome não disponível';
            const userNameInput = document.createElement('input');
            userNameInput.type = 'text';
            userNameInput.value = user.displayName || 'Nome não disponível';
            userNameInput.placeholder = user.displayName || 'Nome não disponível';
            userNameInput.id = 'user-name-input';
            userNameElement.replaceWith(userNameInput);
            const updateButton = document.createElement('button');
            updateButton.id = 'user-input';
            updateButton.innerHTML = 'Alterar nome <i class="fa-solid fa-user-check" style="display: inline; margin: 2px 6px; cursor: pointer;"></i>';
            userNameInput.insertAdjacentElement('afterend', updateButton);

            updateButton.addEventListener('click', (event) => {
                event.preventDefault();
                const newName = userNameInput.value;
                updateProfile(user, { displayName: newName })
                    .then(() => {
                        console.log('User name updated to:', newName);
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error('Error updating user name:', error);
                    });
            });
        }

        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }

        if (userImageElement) {
            userImageElement.src = user.photoURL || 'https://imagedelivery.net/xE-VtsYZUS2Y8MtLMcbXAg/4f009d8cce14a403163a/sm';
            const userImageInput = document.getElementById('user__form--url');
            userImageInput.placeholder = 'URL da imagem';
            const updateImageButton = document.createElement('button');
            updateImageButton.id = 'user-url-input';
            updateImageButton.innerHTML = 'Alterar imagem <i class="fa-solid fa-user-check" style="display: inline; margin: 2px 6px; cursor: pointer;"></i>';
            userImageInput.insertAdjacentElement('afterend', updateImageButton);

            updateImageButton.addEventListener('click', (event) => {
            event.preventDefault();
            const newPhotoURL = userImageInput.value;
            updateProfile(user, { photoURL: newPhotoURL })
                .then(() => {
                console.log('User photo URL updated to:', newPhotoURL);
                window.location.reload();
                })
                .catch((error) => {
                console.error('Error updating user photo URL:', error);
                });
            });
        }

        console.log('User is signed in:', user);
    } else {
        const loginOrProfileLink = document.getElementById('login-or-profile');
        if (loginOrProfileLink) {
            loginOrProfileLink.innerHTML = '<a href="login"><i class="fa-solid fa-user fa-2x"></i></a>';
        }
        const profilePage = window.location.pathname.endsWith('perfil') || window.location.pathname.endsWith('perfil.html');
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