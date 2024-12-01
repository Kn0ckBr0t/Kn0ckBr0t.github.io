import { auth } from './firebase.js';
import { updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence, EmailAuthProvider, reauthenticateWithCredential, updatePassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
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

//FORGOT

const forgotForm = document.querySelector('.forgot__form');

if (forgotForm) {
    forgotForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = forgotForm.querySelector('input[name="email"]').value;
        forgotPassword(event, email);
    });
}

const forgotPassword = (event, email) => {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            const errormessage = document.querySelector('.forgot__form--error');
            errormessage.style.display = 'block';
            errormessage.style.color = '#034153';
            errormessage.textContent = 'Email enviado com sucesso';
        })
        .catch((error) => {
            const errormessage = document.querySelector('.forgot__form--error');
            errormessage.style.display = 'block';
            if (error.code === 'auth/user-not-found') {
                errormessage.textContent = 'Usuário não encontrado';
            } else if (error.code === 'auth/invalid-email') {
                errormessage.textContent = 'Email inválido';
            } else if (error.code === 'auth/too-many-requests') {
                errormessage.textContent = 'Muitas tentativas. Tente novamente mais tarde.';
            } else {
                errormessage.textContent = 'Erro ao enviar email';
            }
        });
}

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
                const emailPrefix = email.split('@')[0];
                const randomNumbers = Math.floor(Math.random() * 1000);
                const displayName = `${emailPrefix}${randomNumbers}`;
                updateProfile(user, { displayName: displayName, photoURL: 'https://imagedelivery.net/xE-VtsYZUS2Y8MtLMcbXAg/4f009d8cce14a403163a/sm' })
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
                const docSnap = getDoc(docRef);

                if (docSnap.exists()) {
                    setDoc(docRef, {
                        photoURL: newPhotoURL
                    }, { merge: true });
                    console.log('Foto do orientador atualizada com sucesso');
                }
            } catch (e) {
                console.error('Erro ao atualizar foto do orientador: ', e);
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
        const idade = Math.trunc(orientadorForm.querySelector('input[name="idade"]').value);
        const linkedin = orientadorForm.querySelector('input[name="linkedin"]').value;
        const experiencia = orientadorForm.querySelector('input[name="experiencia"]').value;
        const errorElement = document.querySelector('.error');

        if (parseInt(idade) <= 17) {
            errorElement.style.display = 'block';
            errorElement.textContent = 'A idade deve ser maior que 17 anos.';
            return;
        }

        const linkedinPattern = /^(https:\/\/)?(www\.)?(linkedin\.com|br\.linkedin\.com)\/.*$/;
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
                    uid: user.uid,
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
                <img class="orientador__img" src="${orientador.photoURL || 'default-image-url'}" alt="${orientador.nome}">
            </figure>
            <section>
                <h2 class="orientador__name" style="color: #fff;">${orientador.nome}</h2>
                <p style="color: #fff;"><strong>Idade:</strong> ${orientador.idade}</p>
                <p style="color: #fff;"><strong>Experiência:</strong> ${orientador.experiencia}</p>
                <p style="color: #fff;"><strong><a href="https://${orientador.linkedin}" target="_blank"><i class="fa-brands fa-linkedin" style="display: inline;"></i>Linkedin</a></strong></p>
            </section>
            <div>
                <button class="orientador__button"><i class="fa-solid fa-video" style="margin-right: 4px; display: inline;"></i>Marcar reúnião</button>
            </div>
        `;
        if (orientadorContainer) {
            orientadorContainer.appendChild(orientadorElement);
        }

        const button = orientadorElement.querySelector('.orientador__button');
        button.addEventListener('click', () => {
            const dialog = document.createElement('dialog');
            dialog.classList.add('dialog');
            dialog.innerHTML = `
                <section class="dialog-content">
                    <h2>Marcar Reunião</h2>
                    <label for="meeting-date">Data:</label>
                    <input type="date" id="meeting-date" required>
                    <label for="meeting-time">Horário:</label>
                    <input type="time" id="meeting-time" required>
                    <button id="schedule-meeting"><i class="fa-solid fa-calendar-days" style="display: inline; margin-right: 4px;"></i>Agendar</button>
                    <i class="fa-solid fa-xmark fa-2x" id="cancel-meeting"></i>
                    <span class="dialog__error">Sucesso, aguarde a confirmação do orientador</span>
                </section>
            `;
            document.body.appendChild(dialog);
            dialog.showModal();
            document.body.style.height = '100vh';
            document.body.style.overflow = 'hidden';

            const dialogError = dialog.querySelector('.dialog__error');
            const scheduleButton = dialog.querySelector('#schedule-meeting');
            const cancelButton = dialog.querySelector('#cancel-meeting');

            scheduleButton.addEventListener('click', async () => {
            const meetingDate = dialog.querySelector('#meeting-date').value;
            const meetingTime = dialog.querySelector('#meeting-time').value;

            if (!meetingDate || !meetingTime) {
                dialogError.style.display = 'block';
                dialogError.textContent = 'Por favor, preencha todos os campos';
                dialogError.style.color = 'red';
                return;
            }

            const user = auth.currentUser;
            const orientadorId = orientador.id;

            if (user) {
                try {
                const meetingRef = doc(db, 'meetings', `${user.uid}_${orientadorId}`);
                await setDoc(meetingRef, {
                    userId: user.uid,
                    userEmail: user.email,
                    orientadorId: orientadorId,
                    meetingDate: meetingDate,
                    meetingTime: meetingTime,
                    timestamp: new Date(),
                    confirmed: false
                });
                dialogError.style.display = 'block';

                setTimeout(() => {
                    dialog.close();
                    document.body.style.height = '';
                    document.body.style.overflow = '';
                }, 3000);
                } catch (e) {
                console.error('Erro ao agendar reunião: ', e);
                }
            } else {
                console.error('Nenhum usuário está logado');
            }
            });

            cancelButton.addEventListener('click', () => {
            dialog.close();
            document.body.style.height = '';
            document.body.style.overflow = '';
            });
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
                            <div style="max-width: 40%;">
                                <h1 class="meeting__title">Painel de orientador</h1>
                                <section class="orientador__card">
                                    <button id="create-meeting-button"><i class="fa-brands fa-google" style="display: inline; max-width: 50px; margin-right: 6px;"></i>Criar Reunião no Google Meet</button>
                                </section>
                            </div>
                            <div>
                                <h1 class="meeting__title">Alunos</h1>
                                <section class="orientador__card">
                                    <div id="displayStudents"></div>
                                </section>
                            </div>
                        </section>
                    `;

                    const displayStudents = async () => {
                        const user = auth.currentUser;
                    
                        if (user) {
                            try {
                                const meetingsQuery = query(
                                    collection(db, 'meetings'),
                                    where('orientadorId', '==', user.uid),
                                    where('confirmed', '==', false)
                                );
                                const querySnapshot = await getDocs(meetingsQuery);
                                const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    
                                const displayStudentsElement = document.getElementById('displayStudents');
                                if (displayStudentsElement) {
                                    displayStudentsElement.innerHTML = '';
                                    if (students.length === 0) {
                                        displayStudentsElement.textContent = 'Você não possui nenhum aluno.';
                                    } else {
                                        students.forEach(student => {
                                            const studentElement = document.createElement('p');
                                            studentElement.innerHTML = `${student.userEmail}, ${student.meetingDate}, ${student.meetingTime} <i class="fa-solid fa-check" style="color: #63E6BE; cursor: pointer;" id="studentAprove" data-id="${student.id}"></i><i class="fa-solid fa-xmark" style="color: red; cursor: pointer;" id="studentDecline" data-id="${student.id}"></i>`;
                                            displayStudentsElement.appendChild(studentElement);
                                        });
                    
                                        document.querySelectorAll('#studentDecline').forEach(button => {
                                            button.addEventListener('click', async (event) => {
                                                const studentId = event.target.getAttribute('data-id');
                                                if (studentId) {
                                                    try {
                                                        await deleteDoc(doc(db, 'meetings', studentId));
                                                        displayStudents();
                                                    } catch (e) {
                                                        console.error('Erro ao deletar aluno: ', e);
                                                    }
                                                }
                                            });
                                        });
                                    
                                        document.querySelectorAll('#studentAprove').forEach(button => {
                                            button.addEventListener('click', async (event) => {
                                                const studentId = event.target.getAttribute('data-id');
                                                if (studentId) {
                                                    try {
                                                        await setDoc(doc(db, 'meetings', studentId), { confirmed: true }, { merge: true });
                                                        displayStudents();
                                                    } catch (e) {
                                                        console.error('Erro ao aprovar aluno: ', e);
                                                    }
                                                }
                                            });
                                        });
                                    }
                                }
                            } catch (e) {
                                console.error('Erro ao buscar alunos: ', e);
                            }
                        } else {
                            console.error('Nenhum usuário está logado');
                        }
                    };

                    dashboardElement.appendChild(meetingCard);

                    await displayStudents();

                    const createMeetingButton = document.getElementById('create-meeting-button');
                    createMeetingButton.addEventListener('click', () => {
                        window.open('https://calendar.google.com/calendar/u/0/r/eventedit?vcon=meet&dates=now&hl=pt-BR', '_blank');
                    });

                    const updateData = document.createElement('section');
                    updateData.classList.add('atualizarDados-card');
                    updateData.innerHTML = `
                        <section class="orientador__container">
                            <div>
                                <a href="orientador"><i class="fa-solid fa-pen" style="color: #fff; display: inline;"></i>Atualizar dados de orientador</a>
                            </div>
                        </section>
                    `;

                    dashboardElement.appendChild(updateData);
                }
            }
        } catch (e) {
            console.error('Erro ao verificar orientador: ', e);
        }
    } else {
        console.error('Nenhum usuário está logado');
    }
};

const checkConfirmedMeetings = async () => {
    const user = auth.currentUser;

    if (user) {
        try {
            const meetingsQuery = query(
                collection(db, 'meetings'),
                where('confirmed', '==', true),
                where('orientadorId', '==', user.uid)
            );
            const meetingsQueryUser = query(
                collection(db, 'meetings'),
                where('confirmed', '==', true),
                where('userId', '==', user.uid)
            );

            const [querySnapshotOrientador, querySnapshotUser] = await Promise.all([
                getDocs(meetingsQuery),
                getDocs(meetingsQueryUser)
            ]);

            const confirmedMeetings = [
                ...querySnapshotOrientador.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                ...querySnapshotUser.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            ];

            const dashboardMeetingElement = document.getElementById('dashboard_meeting');
            if (dashboardMeetingElement) {
                if (confirmedMeetings.length > 0) {
                    dashboardMeetingElement.innerHTML = `Você possui reuniões confirmadas: <a href="https://mail.google.com/mail/u/0/" target="_blank">Acesse o Gmail<i class="fa-solid fa-up-right-from-square" style="display: inline; margin-left: 5px;"></i></a><br><a id="clearMeetings" style="cursor: pointer; color: red;"><i class="fa-solid fa-eraser" style="display: inline; margin-right: 5px;"></i>Limpar reuniões</a>`;
                } else {
                    dashboardMeetingElement.textContent = 'Não há reuniões marcadas';
                }
            }

            const clearMeetingsButton = document.getElementById('clearMeetings');
            if (clearMeetingsButton) {
                clearMeetingsButton.addEventListener('click', async () => {
                    try {
                        for (const meeting of confirmedMeetings) {
                            await deleteDoc(doc(db, 'meetings', meeting.id));
                        }
                        if (dashboardMeetingElement) {
                            dashboardMeetingElement.textContent = 'Não há reuniões marcadas';
                        }
                    } catch (e) {
                        console.error('Erro ao deletar reuniões: ', e);
                    }
                });
            }
        } catch (e) {
            console.error('Erro ao buscar reuniões confirmadas: ', e);
        }
    } else {
        console.error('Nenhum usuário está logado');
    }
};

auth.onAuthStateChanged((user) => {
    if (user) {
        checkIfUserIsOrientador();
        checkConfirmedMeetings();
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