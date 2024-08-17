import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { app } from './firebase-config.js';

const db = getFirestore(app);

// Função para carregar os dados da rifa
async function loadRaffle() {
    const urlParams = new URLSearchParams(window.location.search);
    const raffleId = urlParams.get('id'); // Obtém o ID da rifa
    const docRef = doc(db, 'rifas', raffleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('raffleName').innerText = data.name;
        document.getElementById('raffleDescription').innerText = data.description || 'Sem descrição';
        document.getElementById('raffleValue').innerText = `Valor: R$ ${data.value.toFixed(2)}`;
        document.getElementById('raffleQuantity').innerText = `Quantidade de Números: ${data.quantity}`;
        
        // Carregar os números disponíveis e reservados
        loadNumbers(data.quantity, data.reservedNumbers || {});
        displayReservations(data.reservedNumbers || {}); // Exibir reservas
    } else {
        console.error('Rifa não encontrada!');
    }
}

// Função para carregar os números e permitir reservas
function loadNumbers(quantity, reservedNumbers) {
    const numbersGrid = document.getElementById('numbersGrid');
    numbersGrid.innerHTML = ''; // Limpa a lista antes de adicionar novos números

    for (let i = 1; i <= quantity; i++) {
        const numberItem = document.createElement('li');
        numberItem.innerText = i;
        numberItem.classList.add('number-item');

        // Verifica se o número está reservado e aplica a classe apropriada
        if (reservedNumbers[i]) {
            numberItem.classList.add('reserved'); // Adiciona classe de reservado
            numberItem.style.backgroundColor = reservedNumbers[i].approved ? 'red' : 'orange'; // Muda a cor conforme o status
            numberItem.innerHTML += `<br>Reservado por: ${reservedNumbers[i].name}`; // Adiciona nome acima do número
        } else {
            numberItem.addEventListener('click', () => {
                document.getElementById('reservationForm').style.display = 'block';
                document.getElementById('reserveBtn').setAttribute('data-number', i); // Guarda o número a ser reservado
            });
        }

        numbersGrid.appendChild(numberItem); // Adiciona o número ao grid
    }
}

// Função para reservar o número
document.getElementById('reserveBtn').addEventListener('click', async () => {
    const userName = document.getElementById('userName').value;
    const numberToReserve = document.getElementById('reserveBtn').getAttribute('data-number');

    if (userName) {
        const urlParams = new URLSearchParams(window.location.search);
        const raffleId = urlParams.get('id');
        const docRef = doc(db, 'rifas', raffleId);
        const docSnap = await getDoc(docRef);

        // Verifica se o número já está reservado
        const reservedNumbers = docSnap.data().reservedNumbers || {};
        if (reservedNumbers[numberToReserve]) {
            alert('Esse número já está reservado!');
            return;
        }

        // Atualiza o número reservado no Firestore com nome e timestamp
        await updateDoc(docRef, {
            [`reservedNumbers.${numberToReserve}`]: {
                name: userName,
                timestamp: new Date().toISOString()
            }
        });

        alert(`Número ${numberToReserve} reservado com sucesso!`);
        window.location.reload(); // Recarrega a página para atualizar os números
    } else {
        alert('Por favor, insira seu nome.');
    }
});

// Função para exibir reservas com data e hora
function displayReservations(reservedNumbers) {
    const reservationsList = document.getElementById('reservationsList');
    reservationsList.innerHTML = ''; // Limpa a lista antes de adicionar novas reservas

    for (const [number, details] of Object.entries(reservedNumbers)) {
        const listItem = document.createElement('li');
        const reservationTime = new Date(details.timestamp).toLocaleString(); // Formata a data e hora
        listItem.innerText = `Número ${number}: Reservado por ${details.name} em ${reservationTime}`;
        reservationsList.appendChild(listItem); // Adiciona a reserva à lista
    }
}

// Carregar os dados da rifa quando a página é carregada
window.onload = loadRaffle;
