const textkeep = {}
const defaultans = {}
const defdef = ['Não reconheci o que você enviou.', 'Poderia responder minha pergunta anterior?']
const messages = []

//--------TODO--------//
/**
 * 
 */ 

class StepStuff{
    constructor(tags=[], actions=[], msg=[]){
        for (let i in tags)
            this[tags[i][0]] = { alts:tags[i].slice(1), actions:(actions[i]?actions[i]:[]), msg:(msg[i]?msg[i]:[]) }
    }

    getTags(){
        return Object.keys(this).map((i) => {let j = [i]; j.push(...this[i].alts); return j})
    }

    getActions(){
        return Object.keys(this).map((i) => this[i].actions)
    }
}

/**
 * Novo Modelo de organização das mensagens:
 * O array message contém em cada item as informações pra criação de um bloco, assim como os steps deste
 * bloco. A composição dos itens do array é:
 *  {from, to, step(array com os steps)}
 * Já os steps, são configurados no formato:
 * {txt, full, unf(estes dois são instancias de StepStuff), def, from, to}
 */

messages.push(...[{
'txt':['Olá! Sou um bot programado para auxiliar o processo de matrícula do IFMA.', 'Você gostaria de fazer sua rematrícula?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': {},
'def':['Você só precisa me confirmar a qualquer momento para continuarmos.'],
'to':[1]},

{
'txt': ['Certo. Vamos iniciar o processo para fazer sua rematrícula.', 'De início, só vou precisar de algumas informações suas, como' + 
    ' seu código de matrícula e CPF.', 'Toda vez que você me enviar alguma informação, eu irei confirmar com você se ela tá certa, então não' + 
    ' precisa se preocupar se mandar alguma informação errada.', 'Se houver algum problema durante esse processo, basta ler a descrição' + 
    ' deste perfil.', 'Se você estiver pronto para iniciar, basta me mandar um "Tudo pronto".'],
'full': new StepStuff([['pronto']], [[]], [[]]),
'unf': new StepStuff([[]], [[]], [[]]),  //Perguntas????
'def': ['Basta me confirmar com um "Tudo pronto".'],
'to': [2]},

{
'txt':['Primeiramente me informe seu código de matrícula.'],
'full': new StepStuff([['~mat~']], [['prepareUser']], [[]]),
'unf': new StepStuff([['~matex~'], ['!num!']], [], [['Estanho, já tenho um registro com essa matrícula.', 'Talvez você digitou a' + 
    ' matrícula errada? Ou você já fez a rematrícula?', 'Se for o primeiro caso, é só enviar a matrícula correta, agora se você ainda não' + 
    ' fez a matrícula e isso tá aparecendo pra você, tente contatar alguém do departamento. Neste caso, basta me enviar "Contatar departamento".'], 
    ['Por favor, me mande um código de matrícula válido.'], 
    ['Esse código de matrícula já está registrado.', 'Você já fez seu registro?']]),
'def':['Preciso que me mande sua matrícula.'],
'to':[3]},


{
'txt':['Sua matrícula é ~mat~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['2']], [['Ok, me envie o código de matrícula correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'to':[4]},

{
'txt':['Agora me informe seu nome completo.'],
'full': new StepStuff([['~nome~']], [['updateUser']], []),
'unf': new StepStuff([['~1-wrd~']], [], [['Poderia rever o nome que você enviou?', 'Eu pedi que me enviasse ' + 
'seu nome completo, mas você só me enviou uma palavra.']]),
'def':['Por favor, me informe seu nome.'],
'to':[5]},

{
'txt':['Seu nome completo é ~nome~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['4']], [['Ok, me envie o nome correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'to':[6]},

{
'txt':['Agora me informe seu Email.'],
'full': new StepStuff([['~email~']], [['updateUser']], []),
'unf': new StepStuff([['*@']], [], [['Me envie um email válido, por favor.']]),
'def':['Preciso do seu email.'],
'to':[7]},

{
'txt':['Seu email é ~email~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['6']], [['Ok, me envie o email correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'to':[8]},

{
'txt':['Agora preciso saber qual é o seu curso.'],
'full': new StepStuff([['~curso~']], [['updateUser']], []),
'unf': new StepStuff([['~sim~', '~nao~']], [], [['Só precisa me enviar o nome do seu curso.']]),
'def':['Por favor, me mande o nome do seu curso.', 'É preciso ser um dos 4 do nosso campus: ' + 
'Administração, Engenharia da Computação, Física ou Construção de Edifícios.'],
'to':[9]},

{
'txt':['Beleza, e qual o ano da sua turma? (ano em que você ingressou na instituição)'],
'full': new StepStuff([['~turma~']], [['insUpdateUser']], []),
'unf': new StepStuff([['~sim~', '~nao~']], [], [['Só precisa me enviar o ano da sua turma.']]),
'def':['Eu preciso do ano da sua turma, ou seja, o ano em que você entrou na instituição.'],
'to':[10]},

{
'txt':['Então você é do curso ~curso~ da turma de ~turma~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['8']], [['Ok, vamos voltar atrás então. Qual é mesmo o seu curso?']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'to':[11]},

{
'txt':['Me informe seu CPF.'],
'full': new StepStuff([['~cpf~']], [['updateUser']], []),
'unf': new StepStuff([['~num~']], [], [['Por favor, me envie um cpf válido.', 'Ele deve conter exatamente 11 ' + 
    'dígitos.']]),
'def':['Por favor, me informe o seu CPF.'],
'to':[12]},

{
'txt':['Seu CPF é ~cpf~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], [[]]),
'unf': new StepStuff([['~nao~']], [['11']], [['Ok, me envie o CPF correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'to':[13]},

{
'txt':['Pronto. Já tenho todas as informações necessárias para concluir a sua rematrícula.', 'Se você já quiser finalizar aqui, basta' + 
    'me mandar um "finalizar" e eu vou mandar seus dados para o departamento da rematrícula, mas se quiser, você ainda pode alterar a sua' + 
    ' matrícula.', 'A alteração de matrícula é basicamente onde você poderá escolher se quer adicionar ou retirar alguma matéria da sua' + 
    ' carga horária desse período', 'Estas são as matérias em que você está matrículado para este período:\n~defdisc~', 'Se quiser fazer a' + 
    ' alteração de matrícula, basta me mandar "alterar matrícula".'],
'full': new StepStuff([['~finalizar~'], ['alterar']], [[], []], [[]]),
'unf': new StepStuff([[]], [[]], [[]]),
'def':['Você só precisa me mandar um "finalizar" ou "alterar" para continuarmos.'],
'to':[14, 15]},
])

const recorrent = {
    '~matriz~'      : ['~getmatriz~'],
    '~revisar~'     : ['Seus dados: ~userinfo~', '~discesc~'],
    '~depart~'      : ['~depart~']
}

export {textkeep, defaultans, defdef, messages, recorrent, StepStuff}
