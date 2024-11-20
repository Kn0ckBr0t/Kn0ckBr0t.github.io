import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import { db, auth } from './firebase.js';

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
            console.log('Documento atualizado com sucesso');
        } catch (e) {
            console.error('Erro ao atualizar documento: ', e);
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

function getRandomBackground() {
    const backgrounds = [
        'background-image: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);',
        'background-image: linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%);',
        'background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);',
        'background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);'
    ];
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[randomIndex];
}

function displayOrientadores(orientadores) {
    if (orientadorContainer) {
        orientadorContainer.innerHTML = '';
    }
    orientadores.forEach(orientador => {
        const orientadorElement = document.createElement('section');
        orientadorElement.classList.add('orientador__item');
        orientadorElement.style = getRandomBackground();
        orientadorElement.innerHTML = `
            <figure>
                <img src="${orientador.photoURL || 'default-image-url'}" alt="${orientador.nome}">
            </figure>
            <section>
                <h2 class="orientador__name">${orientador.nome}</h2>
                <p><strong>Formação:</strong> ${orientador.formacao || 'Não informado'}</p>
                <p><strong>Idade:</strong> ${orientador.idade}</p>
                <p><a href="https://${orientador.linkedin}" target="_blank">Linkedin</a></p>
                <p><strong>Experiência:</strong> ${orientador.experiencia}</p>
            </section>
            <div>
                <button class="orientador__button">Contratar</button>
            </div>
        `;
        if (orientadorContainer) {
            orientadorContainer.appendChild(orientadorElement);
        } else {
            console.error('orientadorContainer is null');
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