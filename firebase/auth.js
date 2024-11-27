import { auth } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { updateProfile } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import { db } from './firebase.js';

//LOGIN
const loginForm = document.querySelector('.login__form--form');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = loginForm.querySelector('input[name="email"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;
        const rememberMe = loginForm.querySelector('input[name="remember"]').checked;
        login(event, email, password, rememberMe);
    });
}

const login = (event, email, password, rememberMe) => {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    setPersistence(auth, persistence)
        .then(() => {
            return signInWithEmailAndPassword(auth, email, password);
        })
        .then(() => {
            window.location.href = '/';
        })
        .catch(() => {
            const errormessage = document.querySelector('.login__form--error');
            errormessage.style.display = 'block';
            errormessage.textContent = 'Usuário ou senha inválidos';
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
            errorMessage.textContent = 'Você deve aceitar os termos e condições';
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(user, { photoURL: 'https://imagedelivery.net/xE-VtsYZUS2Y8MtLMcbXAg/4f009d8cce14a403163a/sm' });
                const emailPrefix = email.split('@')[0];
                const randomNumbers = Math.floor(Math.random() * 1000);
                const displayName = `${emailPrefix}${randomNumbers}`;
                updateProfile(user, { displayName: displayName })
                    .then(() => {
                        window.location.reload();
                    });
                window.location.href = '/';
            })
            .catch(() => {
                const errorMessage = document.querySelector('.signup__form--error');
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Erro ao cadastrar usuário';
            });
    });
}

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
            window.location.href = 'login';
        });
};


//SESSION
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        const loginOrProfileLink = document.getElementById('login-or-profile');
        const userNameElement = document.getElementById('user-name');
        const userEmailElement = document.getElementById('user-email');
        const userImageElement = document.querySelector('.user__card--image');
        const userPasswordElement = document.querySelector('#user-password');

        if (loginOrProfileLink) {
            const photoURL = user.photoURL;
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
                        window.location.reload();
                    });
            });
        }

        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }

        if (userImageElement) {
            userImageElement.src = user.photoURL;
            const userImageInput = document.getElementById('user__form--url');
            userImageInput.placeholder = 'URL da imagem';
            const updateImageButton = document.createElement('button');
            updateImageButton.id = 'user-url-input';
            updateImageButton.innerHTML = 'Alterar imagem <i class="fa-solid fa-user-check" style="display: inline; margin: 2px 6px; cursor: pointer;"></i>';
            userImageInput.insertAdjacentElement('afterend', updateImageButton);

            updateImageButton.addEventListener('click', (event) => {
            event.preventDefault();
            const newPhotoURL = userImageInput.value;

            try {
                const docRef = doc(db, 'orientador', user.uid);
                setDoc(docRef, {
                    photoURL: newPhotoURL
                }, { merge: true });
                console.log('Dados do orientador atualizados com sucesso');
            } catch (e) {
                console.error('Erro ao atualizar dados do orientador: ', e);
            }

            updateProfile(user, { photoURL: newPhotoURL })
                .then(() => {
                window.location.reload();
                });
            });
        }

        if (userPasswordElement) {
            const currentPasswordInput = document.createElement('input');
            currentPasswordInput.type = 'password';
            currentPasswordInput.placeholder = 'Senha atual';
            currentPasswordInput.id = 'current-password-input';

            const newPasswordInput = document.createElement('input');
            newPasswordInput.type = 'password';
            newPasswordInput.placeholder = 'Nova senha';
            newPasswordInput.id = 'new-password-input';

            const confirmPasswordInput = document.createElement('input');
            confirmPasswordInput.type = 'password';
            confirmPasswordInput.placeholder = 'Confirmar nova senha';
            confirmPasswordInput.id = 'confirm-password-input';

            const updatePasswordButton = document.createElement('button');
            updatePasswordButton.id = 'update-password-button';
            updatePasswordButton.innerHTML = 'Alterar senha <i class="fa-solid fa-lock" style="display: inline; margin: 2px 6px; cursor: pointer;"></i>';

            userPasswordElement.insertAdjacentElement('afterend', currentPasswordInput);
            currentPasswordInput.insertAdjacentElement('afterend', newPasswordInput);
            newPasswordInput.insertAdjacentElement('afterend', confirmPasswordInput);
            confirmPasswordInput.insertAdjacentElement('afterend', updatePasswordButton);

            currentPasswordInput.classList.add('password-input');
            newPasswordInput.classList.add('password-input');
            confirmPasswordInput.classList.add('password-input');

            updatePasswordButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (newPassword !== confirmPassword) {
                alert('As novas senhas não coincidem');
                return;
            }

            try {
                const user = auth.currentUser;
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                alert('Senha atualizada com sucesso');
                window.location.reload();
            } catch (error) {
                alert('Erro ao atualizar a senha: ' + error.message);
            }
            });
        }

    } else {
        const loginOrProfileLink = document.getElementById('login-or-profile');
        if (loginOrProfileLink) {
            loginOrProfileLink.innerHTML = '<a href="login"><i class="fa-solid fa-user fa-2x"></i></a>';
        }
        const profilePage = window.location.pathname.endsWith('perfil') || window.location.pathname.endsWith('perfil.html') || window.location.pathname.endsWith('orientador') || window.location.pathname.endsWith('orientador.html');
        if (profilePage) {
            window.location.href = 'login';
        }
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
                window.location.href = 'signup';
            });
    }
};

// GOOGLE
const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(() => {
            window.location.href = 'perfil';
        });
    
};

const googleButton = document.getElementById('google');
if (googleButton) {
    googleButton.addEventListener('click', googleLogin);
}

//PLANOS

const planosPayButton = document.getElementById('planos_pay');

if (planosPayButton) {
    planosPayButton.addEventListener('click', (event) => {
        event.preventDefault();
        setTimeout(() => {
            addOrUpdatePlanData();
        }, 1);
    });
}

const addOrUpdatePlanData = async () => {
    const user = auth.currentUser;
    const planSelect = document.getElementById('planos__selecionar--select');
    const paymentSelect = document.getElementById('planos__selecionar--select');
    const planName = planSelect ? planSelect.value : 'Plano Exemplo';
    const paymentMethod = paymentSelect ? paymentSelect.value : 'pix';
    const valorElement = document.getElementById('valor');
    const valor = valorElement ? valorElement.textContent.replace('Valor: ', '') : '0';

    if (user) {
        try {
            const docRef = doc(db, 'planos', user.uid);
            await setDoc(docRef, {
                uid: user.uid,
                planName: planName,
                paymentMethod: paymentMethod,
                valor: valor,
                timestamp: new Date()
            }, { merge: true });
            console.log('Plano atualizado com sucesso');
        } catch (e) {
            console.error('Erro ao atualizar plano: ', e);
        }
    } else {
        console.error('Nenhum usuário está logado');
    }
};

const displayCurrentPlan = async () => {
    const user = auth.currentUser;

    if (user) {
        try {
            const docRef = doc(db, 'planos', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const planData = docSnap.data();
                const currentPlanElement = document.getElementById('current-plan');
                if (currentPlanElement) {
                    currentPlanElement.innerHTML = `Seu plano atualmente é o <a href="/#planos">${planData.planName}</a>`;
                }
            } else {
                console.log('Nenhum plano encontrado para o usuário');
                const currentUrl = window.location.pathname;
                const restrictedPages = ['/orientador', '/orientador.html', '/orientadores', '/orientadores.html'];

                if (restrictedPages.includes(currentUrl)) {
                    alert('Você precisa ter um plano para acessar esta página.');
                    window.location.href = '/perfil';
                }
            }
        } catch (e) {
            console.error('Erro ao buscar plano: ', e);
        }
    } else {
        console.error('Nenhum usuário está logado');
    }
};

auth.onAuthStateChanged((user) => {
    if (user) {
        displayCurrentPlan();
    }
});

// ORIENTADOR

const orientadorForm = document.getElementById('orientador__registrar');

if (orientadorForm) {
    orientadorForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = orientadorForm.querySelector('input[name="nome"]').value;
        const idade = orientadorForm.querySelector('input[name="idade"]').value;
        const linkedin = orientadorForm.querySelector('input[name="linkedin"]').value;
        const experiencia = orientadorForm.querySelector('input[name="experiencia"]').value;
        const errorElement = document.querySelector('.error');

        if (parseInt(idade) <= 17) {
            errorElement.style.display = 'block';
            errorElement.textContent = 'A idade deve ser maior que 17 anos.';
            return;
        }

        const linkedinPattern = /^(https:\/\/)?(www\.)?linkedin\.com\/.*$/;
        if (!linkedinPattern.test(linkedin)) {
            errorElement.style.display = 'block';
            errorElement.textContent = 'O link deve ser um URL válido do LinkedIn.';
            return;
        }

        const user = auth.currentUser;

        if (user) {
            try {
                const docRef = doc(db, 'orientador', user.uid);
                await setDoc(docRef, {
                    nome,
                    idade,
                    linkedin,
                    experiencia,
                    photoURL: user.photoURL
                });
                window.location.href = '/perfil';
                errorElement.style.display = 'none';
            } catch (e) {
                console.error('Erro ao registrar dados: ', e);
            }
        }
    });
}

const orientadorContainer = document.querySelector('.orientadores__container');

async function fetchOrientadores() {
    const orientadoresQuery = collection(db, 'orientador');
    const querySnapshot = await getDocs(orientadoresQuery);
    const orientadores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    displayOrientadores(orientadores);
}

function displayOrientadores(orientadores) {
    if (orientadorContainer) {
        orientadorContainer.innerHTML = '';
    }
    orientadores.forEach(orientador => {
        const orientadorElement = document.createElement('section');
        orientadorElement.classList.add('orientador__item');
        orientadorElement.innerHTML = `
            <figure>
                <img src="${orientador.photoURL || 'default-image-url'}" alt="${orientador.nome}">
            </figure>
            <section>
                <h2 class="orientador__name" style="color: #fff;">${orientador.nome}</h2>
                <p style="color: #fff;"><strong>Idade:</strong> ${orientador.idade}</p>
                <p style="color: #fff;"><strong>Experiência:</strong> ${orientador.experiencia}</p>
                <p style="color: #fff;"><strong><a href="https://${orientador.linkedin}" target="_blank"><i class="fa-brands fa-linkedin" style="display: inline;"></i>Linkedin</a></strong></p>
            </section>
            <div>
                <button class="orientador__button">Contratar</button>
            </div>
        `;
        if (orientadorContainer) {
            orientadorContainer.appendChild(orientadorElement);
        }

        const button = orientadorElement.querySelector('.orientador__button');
        button.addEventListener('click', () => {
            window.alert('Uma reunião será marcada, fique atento ao seu email. Caso você não tenha disponibilidade, você pode remarcar.');
        });
    });
}

document.addEventListener('DOMContentLoaded', fetchOrientadores);

// OrientadorFerramentas

const checkIfUserIsOrientador = async () => {
    const user = auth.currentUser;

    if (user) {
        try {
            const docRef = doc(db, 'orientador', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const dashboardElement = document.getElementById('dashboard');
                if (dashboardElement) {
                    const meetingCard = document.createElement('section');
                    meetingCard.classList.add('meeting-card');
                    meetingCard.innerHTML = `
                        <section class="orientador__container">
                            <div>
                                <h1 class="meeting__title">Criar Reunião</h1>
                                <section class="orientador__card">
                                    <button id="create-meeting-button">Criar Reunião no Google Meet</button>
                                </section>
                            </div>
                        </section>
                    `;
                    dashboardElement.appendChild(meetingCard);

                    const createMeetingButton = document.getElementById('create-meeting-button');
                    createMeetingButton.addEventListener('click', () => {
                        window.open('https://calendar.google.com/calendar/u/0/r/eventedit?vcon=meet&dates=now&hl=pt-BR', '_blank');
                    });
                }
            }
        } catch (e) {
            console.error('Erro ao verificar orientador: ', e);
        }
    } else {
        console.error('Nenhum usuário está logado');
    }
};

auth.onAuthStateChanged((user) => {
    if (user) {
        checkIfUserIsOrientador();
    }
});

auth.onAuthStateChanged((user) => {
    if (user) {
        document.querySelectorAll('.orientador__button').forEach(button => {
            button.addEventListener('click', () => {
                const orientadorContainer = button.closest('.orientador__container');
                if (orientadorContainer) {
                    const emailElement = document.createElement('p');
                    emailElement.innerHTML = `<strong>Email:</strong> ${user.email}`;
                    orientadorContainer.appendChild(emailElement);
                }
            });
        });
    }
});