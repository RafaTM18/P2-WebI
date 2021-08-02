const form = document.getElementById("form")
const tabs = document.getElementsByClassName("tab")
const steps = document.getElementsByClassName("tab-step")
const btnAnt = document.getElementById("btn-volt")
const btnProx = document.getElementById("btn-prox")
const listAno = document.getElementById("ano")
const inputCPF = document.getElementById('cpf')
const inputNome = document.getElementById('nome')
const inputPet = document.getElementById('nomePet')
const inputRaca = document.getElementById('raca')
const inputDia = document.getElementById('dia')
const inputMes = document.getElementById('mes')
const inputFoto = document.getElementById('foto')
const listInput = document.querySelectorAll('input')

let tabAtual = 0
mostraTab(tabAtual)
geraLista()

////////////////////////////////////////////////////////////////////////////////
//Funções de Evento

listInput.forEach((input) => {
    input.addEventListener('keypress', (e) => {
        input.classList.remove('invalido')
    })
})

btnAnt.addEventListener('click', (e) => {
    proxTab(-1)
})

btnProx.addEventListener('click', (e) => {
    proxTab(1)
})

////////////////////////////////////////////////////////////////////////////////
//Funções Gerais

function mostraTab(numTab){  
    //Serve para mudar a página formulário, se for a ultima pagina, muda o botão de Proximo para Submeter
    tabs[numTab].style.display = "block"

    if(numTab == 0){
        btnAnt.style.display = "none"
    }else{
        btnAnt.style.display = "inline"
    }

    if(numTab == (tabs.length - 1)){
        btnProx.innerHTML = "Submeter"
    }else{
        btnProx.innerHTML = "Próximo"
    }

    indicadorStep(numTab)
}

function proxTab(numTab){
    //Vai para a proxima tab, somente se os inputs estão corretos, se for a ultima tab, realiza a requisição do Post
    if(numTab == 1 && !validaForm()){
        return
    }

    tabs[tabAtual].style.display = "none"
    tabAtual = tabAtual + numTab

    if(tabAtual >= tabs.length){
        ajaxPost()
        form.reset()
        resetStep()
        tabAtual = 0
    }

    mostraTab(tabAtual)
}

function validaForm(){
    //Validação mais geral, não deixa o usuario passar com um input vazio
    listInputTab = tabs[tabAtual].getElementsByTagName('input')
    numErro = 0

    for(let i = 0; i < listInputTab.length; i++){
        if(listInputTab[i].value == '' || listInputTab[i].classList.contains('invalido')){
            listInputTab[i].classList.add('invalido')
            listInputTab[i].reportValidity()
            numErro++
        }
    }
    
    validado = (numErro > 0) ? false : true

    if(validado){
        steps[tabAtual].classList.add('finalizado')
    }else{
        steps[tabAtual].classList.remove('finalizado')
    }

    return validado
}

function indicadorStep(numTab){
    for(let i = 0; i < steps.length; i++){
        steps[i].classList.remove("ativo")
    }

    steps[numTab].classList.add("ativo")
}

function resetStep(){
    for(let i = 0; i < steps.length; i++){
        steps[i].classList.remove('ativo')
        steps[i].classList.remove('finalizado')
    }
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

////////////////////////////////////////////////////////////////////////////////
//Validações de Campo
//Essas funções de evento fazem a verificação do input quando ele é desfocado

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

inputFoto.addEventListener('change', (e) =>{
    inputFoto.classList.remove('invalido')
})

////////////////////////////////////////////////////////////////////////////////
//Requisição Post

const url = "http://localhost:5000/app/pets"

function ajaxPost(){
    const formData = new FormData()

    const cpf = inputCPF.value
    const nome = inputNome.value

    const nomePet = inputPet.value
    const raca = inputRaca.value

    //Caso o usuário digite algo tipo 2/4/2020
    //Esses ifs transforma a data em 02/04/2020
    const dia = (inputDia.value.length == 1) ? `0${inputDia.value}` : inputDia.value
    const mes = (inputMes.value.length == 1) ? `0${inputMes.value}` : inputMes.value
    const ano = document.getElementById('ano')

    const data = `${dia}/${mes}/${ano.value}`

    const fileUp = inputFoto

    formData.append('cpf', cpf)
    formData.append('nome', nome)
    formData.append('nomePet', nomePet)
    formData.append('raca', raca)
    formData.append('data', data)
    formData.append('foto', fileUp.files[0])

    const params = {
        url: url,
        method: "POST",
        data: formData
    }

    axios(params)
        .then((resultado) => alert(resultado.data.Mensagem))
        .catch((error) => {
            alert(error);
        })
}