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
    ' seu código de matrícula e CPF. Toda vez que você me enviar alguma informação, eu irei confirmar com você se ela tá certa, então não' + 
    ' precisa se preocupar se mandar alguma informação errada.', 'Se houver algum problema durante esse processo, basta ler a descrição' + 
    ' deste perfil.', 'Se você estiver pronto para iniciar, basta me mandar um "Tudo pronto".'],
'full': new StepStuff([['pronto']], [[]], [[]]),
'unf': new StepStuff([[]], [[]], [[]]),  //Perguntas????
'def': ['Basta me confirmar com um "Tudo pronto".'],
'to': [2]},

{
'txt':['Primeiramente me informe seu código de matrícula.'],
'full': new StepStuff([['~validmat~']], [[], ['prepareUser']], []),
'unf': new StepStuff([['~matex~'], ['!num!']], [], [['Estanho, já tenho um registro com essa matrícula.', 'Talvez você digitou a' + 
    ' matrícula errada? Ou você já fez a rematrícula?', 'Se for o primeiro caso, é só enviar a matrícula correta, agora se você ainda não' + 
    ' fez a matrícula e isso tá aparecendo pra você, tente contatar alguém do departamento. Neste caso, basta me enviar "Contatar departamento".'], 
    ['Por favor, me mande um código de matrícula válido.'], 
    ['Esse código de matrícula já está registrado.', 'Você já fez seu registro?']]),
'def':['Preciso que me mande sua matrícula.'],
'from':[1],
'to':[3]},
])

const recorrent = {
    '~matriz~'      : ['~getmatriz~'],
    '~revisar~'     : ['Seus dados: ~userinfo~', '~discesc~'],
    '~depart~'      : ['~depart~']
}

export {textkeep, defaultans, defdef, messages, recorrent, StepStuff}
