import { getFirestore, collection, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { app } from './firebase-config.js';

const db = getFirestore(app);

// Função para carregar as rifas do Firestore
export async function loadRaffles() {
    const raffleList = document.getElementById('raffleList');
    raffleList.innerHTML = ''; // Limpa a lista antes de carregar novamente

    const raffleCollection = collection(db, 'rifas');
    const raffleSnapshot = await getDocs(raffleCollection);
    raffleSnapshot.forEach(rifaDoc => { // Renomeando para evitar conflito com a função doc
        const data = rifaDoc.data();
        const listItem = document.createElement('li');
        listItem.innerText = `${data.name} - ${data.quantity} números - ${data.description || 'Sem descrição'} - R$ ${data.value.toFixed(2)} - Criada em: ${new Date(data.createdAt).toLocaleString()}`;
        
        // Botão para gerenciar a rifa
        const manageBtn = document.createElement('button');
        manageBtn.innerText = 'Gerenciar';
        manageBtn.addEventListener('click', () => {
            window.location.href = `gerenciamentorifa.html?id=${rifaDoc.id}`; // Redireciona para a página de gerenciamento
        });

        // Botão para editar a rifa
        const editBtn = document.createElement('button');
        editBtn.innerText = 'Editar';
        editBtn.addEventListener('click', () => {
            window.location.href = `nova-rifa.html?id=${rifaDoc.id}`; // Redireciona para a página de edição
        });

        // Botão para deletar a rifa
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Deletar';
        deleteBtn.addEventListener('click', async () => {
            const docRef = doc(db, 'rifas', rifaDoc.id); // Corrigido para usar rifaDoc.id
            await deleteDoc(docRef);
            loadRaffles(); // Recarrega a lista após a exclusão
        });

        // Adiciona os botões à lista
        listItem.appendChild(manageBtn); // Adiciona o botão de gerenciar à lista
        listItem.appendChild(editBtn); // Adiciona o botão de edição à lista
        listItem.appendChild(deleteBtn); // Adiciona o botão de deletar à lista
        raffleList.appendChild(listItem);
    });
}

// Redirecionar para a página de nova rifa
document.getElementById('newRaffleBtn').addEventListener('click', function() {
    window.location.href = 'nova-rifa.html'; // Redireciona para a página nova-rifa
});

// Carregar as rifas quando a página é carregada
window.onload = loadRaffles;
