'use strict'

import { getContatos } from "./contato.js"
import { getContatosPorNome } from "./contato.js"
import { postContato } from "./contato.js"
import { uploadImageToAzure } from "./uploadImageToAzure.js"

async function criarCard(contato){
    
    const container = document.getElementById('container')
    const card = document.createElement('div')
    card.classList.add('card-contato')
    card.innerHTML = `
        <img src="${contato.foto}" alt="">
        <h2>${contato.nome}</h2>
        <p>${contato.celular}</p>
    `
    container.appendChild(card)
}

async function exibirContatos(){
    const contatos = await getContatos()
    const container = document.getElementById('container')
    container.replaceChildren('')
    contatos.forEach(criarCard)
}

async function exibirPesquisa(evento) {
    if(evento.key == 'Enter'){
        const contatos = await getContatosPorNome(evento.target.value)
        const container = document.getElementById('container')
        container.replaceChildren('')
        contatos.forEach(criarCard)
    }
    
}

async function cadastrarContato() {
    document.querySelector('main').className = 'form-show'
}

function abrirHome(){
    document.querySelector('main').className = 'card-show'
}

async function salvarContato(){

    const uploadParams = {
        file: document.getElementById('foto').files[0],
        storageAccount: 'tutorialupload',
        sasToken: 'sp=racwl&st=2025-05-13T14:27:31Z&se=2025-05-30T22:27:31Z&sv=2024-11-04&sr=c&sig=Jom%2FgMFugyhtw5SZokN0Pe%2BQf7c2ciA8KP9SckR%2FPfc%3D',
        containerName: 'fotos',
    };

    const contato = 
    {
        "nome"    : document.getElementById('nome')    .value,
        "celular" : document.getElementById('celular') .value,
        "foto"    : await uploadImageToAzure(uploadParams),
        "email"   : document.getElementById('email')   .value,
        "endereco": document.getElementById('endereco').value,
        "cidade"  : document.getElementById('cidade')  .value
    }

    
    if(await postContato(contato)){
        await exibirContatos()
        abrirHome()
        alert('Cadastro realizado com succeso')
    }
    
    await uploadImageToAzure(uploadParams)
}



exibirContatos()



document.getElementById('pesquisar')
        .addEventListener('keydown', exibirPesquisa)

document.getElementById('novo-contato')
        .addEventListener('click', cadastrarContato)

document.getElementById('cancelar')
        .addEventListener('click', abrirHome)

document.getElementById('salvar')
        .addEventListener('click', salvarContato)