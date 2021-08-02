const btnDel = document.getElementById('btn-del')
const btnUpd = document.getElementById('btn-alt')
const tabela = document.querySelector('table')
const aviso = document.getElementById('aviso')
const modal = document.getElementById('modal')
const fecha = document.getElementById('fecha')
const foto = document.getElementById('img-pet')
const inputCPF = document.getElementById('cpf')
const inputNome = document.getElementById('nome')
const inputPet = document.getElementById('nomePet')
const inputRaca = document.getElementById('raca')
const inputDia = document.getElementById('dia')
const inputMes = document.getElementById('mes')
const listAno = document.getElementById("ano")
const inputFoto = document.getElementById('img')
const listInput = document.querySelectorAll('input[type=text]')

let ids = []
let linhaAtual = 0

geraLista()
ajaxGet()

////////////////////////////////////////////////////////////////////////////////
//Funções de evento

listInput.forEach((input) => {
    input.addEventListener('keypress', (e) => {
        input.classList.remove('invalido')
    })
})

window.addEventListener('mousedown', (e) => {
    if(e.target == modal){
        fechaModal()
    }
})

fecha.addEventListener('click', fechaModal)

btnDel.addEventListener('click', (e) => {
    //Remove a linha selecionada e o id desse item da lista de IDs
    tabela.deleteRow(linhaAtual+1)
    ajaxDelete(ids[linhaAtual])
    ids = ids.filter((id) => !(id == ids[linhaAtual]))
    if(ids.length == 0){
        aviso.style.display = "block"
    }
    fechaModal()
})


btnUpd.addEventListener('click', (e) => {
    //Confere se o formulario foi preenchido corretamente antes de tentar alterar os dados
    if(validaForm()){
        const formData = new FormData()

        //Caso o usuário digite algo tipo 2/4/2020
        //Esses ifs transforma a data em 02/04/2020
        const dia = (inputDia.value.length == 1) ? `0${inputDia.value}` : inputDia.value
        const mes = (inputMes.value.length == 1) ? `0${inputMes.value}` : inputMes.value

        const data = `${dia}/${mes}/${listAno.value}`

        formData.append('cpf', inputCPF.value)
        formData.append('nome', inputNome.value)
        formData.append('nomePet', inputPet.value)
        formData.append('raca', inputRaca.value)
        formData.append('data', data)

        if(inputFoto.value != ''){
            formData.append('foto', inputFoto.files[0]) 
        }

        ajaxPut(ids[linhaAtual], formData)
        const linha = tabela.rows[linhaAtual+1]
        
        //Modifica manualmente no front
        linha.cells[0].innerHTML = inputCPF.value
        linha.cells[1].innerHTML = inputNome.value
        linha.cells[2].innerHTML = inputPet.value
        linha.cells[3].innerHTML = inputRaca.value
        linha.cells[4].innerHTML = data
        fechaModal()
    }
})

////////////////////////////////////////////////////////////////////////////////
//Funções Gerais

function geraTabela(info){
    if(info.length != 0){
        aviso.style.display = "none"

        for(elemento of info){
            ids.push(elemento['_id'])

            const linha = document.createElement('tr')
            linha.addEventListener('click', (e) => {
                linhaAtual = linha.rowIndex-1
                ajaxGetId(ids[linhaAtual])
                modal.style.display = "block"
            })
            const cpf = document.createElement('td')
            const cpfTxt = document.createTextNode(elemento['cpf'])

            cpf.appendChild(cpfTxt)
            linha.appendChild(cpf)

            const nome = document.createElement('td')
            const nomeTxt = document.createTextNode(elemento['nome'])

            nome.appendChild(nomeTxt)
            linha.appendChild(nome)

            const nomePet = document.createElement('td')
            const nomePetTxt = document.createTextNode(elemento['nomePet'])

            nomePet.appendChild(nomePetTxt)
            linha.appendChild(nomePet)

            const raca = document.createElement('td')
            const racaTxt = document.createTextNode(elemento['raca'])

            raca.appendChild(racaTxt)
            linha.appendChild(raca)

            const data = document.createElement('td')
            const dataTxt = document.createTextNode(elemento['data'])

            data.appendChild(dataTxt)
            linha.appendChild(data)

            tabela.tBodies[0].appendChild(linha)
        }
    }
}

function fechaModal(){
    modal.style.display = "none"
    for(let i = 0; i < listInput.length; i++){
        listInput[i].classList.remove('invalido')
    }
    inputFoto.value = ''
}

function geraLista(){
    //Função responsavel por gerar a lista de anos da data de nascimento
    const ano = new Date().getFullYear()
    
    let opcoes = ""
    for(let i = ano - 30; i <= ano; i++){
        opcoes += `<option value="${i}">${i}</option>`
    }

    listAno.innerHTML = opcoes
}

function validaForm(){
    //Validação mais geral, não deixa o usuario passar com um input vazio
    numErro = 0

    for(let i = 0; i < listInput.length; i++){
        if(listInput[i].value == '' || listInput[i].classList.contains('invalido')){
            listInput[i].classList.add('invalido')
            listInput[i].reportValidity()
            numErro++
        }
    }
    
    validado = (numErro > 0) ? false : true

    return validado
}

////////////////////////////////////////////////////////////////////////////////
//Validações

//Valida CPF
inputCPF.addEventListener('blur', (e) => {
    const textoInput = inputCPF.value
    if(textoInput.match('[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}')){
        inputCPF.classList.remove('invalido')
    }else{
        inputCPF.classList.add('invalido')
    }
})

//Valida Nome
inputNome.addEventListener('blur', (e) => {
    const textoInput = inputNome.value
    if(textoInput.length > 2){
        inputNome.classList.remove('invalido')
    }else{
        inputNome.classList.add('invalido')
    }
})

//Valida Nome do Pet
inputPet.addEventListener('blur', (e) => {
    const textoInput = inputPet.value
    if(textoInput.length > 2){
        inputPet.classList.remove('invalido')
    }else{
        inputPet.classList.add('invalido')
    }
})

//Valida Raça
inputRaca.addEventListener('blur', (e) => {
    const textoInput = inputRaca.value
    if(textoInput.length > 2){
        inputRaca.classList.remove('invalido')
    }else{
        inputRaca.classList.add('invalido')
    }
})

//"Valida" Data
inputDia.addEventListener('blur', (e) => {
    const textoInput = inputDia.value
    if(textoInput > 0 && textoInput < 32){
        inputDia.classList.remove('invalido')
    }else{
        inputDia.classList.add('invalido')
    }
})
inputMes.addEventListener('blur', (e) => {
    const textoInput = inputMes.value
    if(textoInput > 0 && textoInput < 13){
        inputMes.classList.remove('invalido')
    }else{
        inputMes.classList.add('invalido')
    }
})

////////////////////////////////////////////////////////////////////////////////
//Funções de Requisição

//Função Get
async function ajaxGet(){
    try {
        const resp = await axios.get('http://localhost:5000/app/pets')
        const conteudo = await resp.data

        geraTabela(conteudo)
    } catch (error) {
        alert(error);
    }
}

//Função Get(id)
async function ajaxGetId(id){
    try {
        const resp = await axios.get('http://localhost:5000/app/pets/' + id)
        const conteudo = await resp.data

        inputCPF.value = conteudo.cpf
        inputNome.value = conteudo.nome
        inputPet.value = conteudo.nomePet
        inputRaca.value = conteudo.raca
        inputDia.value = conteudo.data.split('/')[0]
        inputMes.value = conteudo.data.split('/')[1]
        listAno.value = conteudo.data.split('/')[2]
        foto.src = conteudo.pathImg
    } catch (error) {
        alert(error);
    }
}

//Função Put
async function ajaxPut(id, dados){
    try {
        const resp = await axios.put('http://localhost:5000/app/pets/' + id, dados)
        const conteudo = await resp.data
        alert(conteudo.Mensagem)
    } catch (error) {
        alert(error);
    }
}

//Função Delete
async function ajaxDelete(id){
    try {
        const resp = await axios.delete('http://localhost:5000/app/pets/' + id)
        const conteudo = await resp.data

        alert(conteudo.Mensagem)
    } catch (error) {
        alert(error);
    }
}