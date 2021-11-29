'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_curso')) ?? []
const setLocalStorage = (dbCurso) => localStorage.setItem("db_curso",JSON.stringify(dbCurso))

//CRUD - CREATE READ UPDATE DELETE

//CRUD - CREATE
const criarCurso = (curso) =>{
    const dbCurso = getLocalStorage()
    dbCurso.push(curso)
    setLocalStorage(dbCurso)
}

//CRUD - READ
const listaCursos = () => getLocalStorage()

//CRUD - READ 1 ELEMENT
const exibirCurso = (id) => {
    const dbCurso = listaCursos()
    console.log(dbCurso[id])
}

//CRUD - UPDATE
const atualizarCurso = (id, curso) =>{
    const dbCurso = listaCursos()
    dbCurso[id] = curso
    setLocalStorage(dbCurso)
}

//CRUD - DELETE
const deletarCurso = (id) => {
    const dbCurso = listaCursos()
    dbCurso.splice(id,1)
    setLocalStorage(dbCurso)
}

const isValidFields = () =>{
    return document.getElementById('form').reportValidity()
}

const clearFields = () =>{
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

//Interação
const salvarCurso = () => {
    if(isValidFields()){
        const curso = {
            id: document.getElementById('indice').value,
            titulo: document.getElementById('titulo').value,
            descricao:document.getElementById('descricao').value,
            imagem: document.getElementById('imagem').value,
            nomeProfessor:document.getElementById('nomeProfessor').value,
            listaAulas:document.getElementById('listaAulas').value
        }
        const index = document.getElementById('indice').dataset.index
        if(index == 'novo'){
            criarCurso(curso)
            updateTable()
            closeModal() 
        }else{
            atualizarCurso(index, curso)
            updateTable()
            closeModal()
        }
        
    }
}

const criarLinha = (curso, index) => {
    const novaLinha = document.createElement('tr')
    novaLinha.innerHTML = `
        <td>${curso.id}</td>
        <td>${curso.titulo}</td>
        <td>${curso.descricao}</td>
        <td>${curso.imagem}</td>
        <td>${curso.nomeProfessor}</td>
        <td>${curso.listaAulas}</td>
        <td>
            <button type="button" class="button green" id="editar-${index}">Editar</button>
            <button type="button" class="button red" id="deletar-${index}">Excluir</button>
        </td>`
    document.querySelector('#tableCurso>tbody').appendChild(novaLinha)
}

const clearTable = () => {
    const linhas = document.querySelectorAll('#tableCurso>tbody tr')
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

const updateTable = () => {
    const dbCurso = listaCursos()
    clearTable()
    dbCurso.forEach(criarLinha)
}

updateTable()

const preencherCampos = (curso) => {
    document.getElementById('indice').value = curso.indice
    document.getElementById('titulo').value = curso.titulo
    document.getElementById('descricao').value = curso.descricao
    document.getElementById('imagem') == curso.imagem
    document.getElementById('nomeProfessor').value = curso.nomeProfessor
    document.getElementById('listaAulas').value = curso.listaAulas
    document.getElementById('indice').dataset.index = curso.index
}

const editarCurso = (index) => {
    const curso = listaCursos()[index]
    curso.index = index
    preencherCampos(curso)
    openModal()
}

const editarDeletar = (event) => {
    if(event.target.type == 'button'){
        const [action,index] = event.target.id.split('-')

        if(action == 'editar'){
            editarCurso(index)
        }else{
            const curso = listaCursos()[index]
            const response = confirm(`Deseja realmente excluir o curso ${curso.titulo}`)
            if(response){
                deletarCurso(index)
                updateTable() 
            }
            
        }
    }
    
}

//Função buscar curso pelo id
const criarLinha2 = (curso) => {
    
    const novaLinha2 = document.createElement('tr')
    novaLinha2.innerHTML = `
        <td>${curso.id}</td>
        <td>${curso.titulo}</td>
        <td>${curso.descricao}</td>
        <td>${curso.imagem}</td>
        <td>${curso.nomeProfessor}</td>
        <td>${curso.listaAulas}</td>`
    document.querySelector('#tableBusca>tbody').appendChild(novaLinha2)
}

const clearTable2 = () => {
    const linhas = document.querySelectorAll('#tableBusca>tbody tr')
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

const buscarCurso = () => {
    const indice = document.getElementById('inputBusca').value
    const dbBusca = listaCursos()[indice-1]
    clearTable2()
    criarLinha2(dbBusca)    
        
}


//Eventos
document.getElementById('cadastrarCurso').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', salvarCurso)

document.getElementById('cancelar').addEventListener('click', closeModal)

document.querySelector('#tableCurso>tbody').addEventListener('click', editarDeletar)

document.getElementById('busca').addEventListener('click',buscarCurso)