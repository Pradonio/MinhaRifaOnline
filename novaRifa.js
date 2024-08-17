import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from './firebase-config.js'; // Importa a instância do Firestore

// Função para salvar uma nova rifa
export async function salvarNovaRifa(nome, descricao, valorNumero, quantidadeNumeros, dataExpiracao) {
    try {
        const docRef = await addDoc(collection(db, "rifas"), {
            nome: nome,
            descricao: descricao,
            valorNumero: valorNumero,
            quantidadeNumeros: quantidadeNumeros,
            dataExpiracao: dataExpiracao,
            createdAt: new Date().toISOString(), // Adiciona data e hora de criação
        });
        console.log("Rifa criada com ID: ", docRef.id);
        return docRef.id; // Retorna o ID da rifa criada
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
    }
}

// Função para consultar rifas existentes
export async function consultarRifas() {
    const querySnapshot = await getDocs(collection(db, "rifas"));
    const rifas = []; // Array para armazenar as rifas

    querySnapshot.forEach((doc) => {
        rifas.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return rifas; // Retorna a lista de rifas
}

// Função para deletar uma rifa
export async function deletarRifa(id) {
    const docRef = doc(db, "rifas", id); // Referência do documento a ser deletado
    await deleteDoc(docRef); // Deleta o documento
    console.log(`Rifa ${id} deletada com sucesso`);
}

// Exemplo de uso (remova os comentários para testar)
// salvarNovaRifa("Nome da Rifa", "Descrição da Rifa", 10, 150, "2024-08-30");
// consultarRifas().then(rifas => console.log(rifas));
