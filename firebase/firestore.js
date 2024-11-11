import { db } from './firebase.js';
import { collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import { auth } from './firebase.js';

const planosPayButton = document.getElementById('planos_pay');

if (planosPayButton) {
    planosPayButton.addEventListener('click', (event) => {
        event.preventDefault();
        setTimeout(() => {
            addOrUpdatePlanData();
        }, 5000);
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