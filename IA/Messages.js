const textkeep = {}
const defaultans = {}
const defdef = ['Não reconheci o que você enviou.', 'Poderia responder minha pergunta anterior?']
const messages = []

//--------TODO--------//
/**
 * Recomp do step 16
 * Mensagem 2 do unfulfill de recomendações no step 16 tá meio ruim
 * Rever a recorrência entre os steps 20 e 15, tá meio robótico demais
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

messages.push(...[
{
'txt':['Olá! Sou um bot programado para auxiliar o processo de matrícula do IFMA.', 'Você gostaria de fazer sua rematrícula?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': {},
'def':['Você só precisa me confirmar a qualquer momento para continuarmos.'],
'to':[1]},

{
'txt': ['Certo. Vamos iniciar o processo para fazer sua rematrícula.', 'De início, só vou precisar de algumas informações suas, como' + 
    ' seu código de matrícula e CPF.', 'Toda vez que você me enviar alguma informação, eu irei confirmar com você se ela tá certa, então não' + 
    ' precisa se preocupar se mandar alguma informação errada.', 'Se houver algum problema durante esse processo, basta ler a descrição' + 
    ' deste perfil.', 'Em alguns casos, por conta da quantidade de usuários que estão me contatando, eu possivelmente irei demorar' + 
    ' para responder. Peço que você aguarde alguns segundos caso eu não responda sua mensagem de imediato em algum ponto do processo.', 
    'Se você estiver pronto para iniciar, basta me mandar um "Tudo pronto".'],
'full': new StepStuff([['pronto']], [[]], [[]]),
'unf': new StepStuff([[]], [[]], [[]]),  //Perguntas????
'def': ['Basta me confirmar com um "Tudo pronto".'],
'to':[2]},

{
'txt': ['Primeiramente, você gostaria de fazer a inscrição com seu código de matrícula ou com seu CPF?'],
'full': new StepStuff([['matricula'], ['cpf']], [[]], [[]]),
'unf': {},
'def': ['Você deve escolher como quer fazer a rematrícula. Basta dizer se quer usar o seu CPF ou seu código de matrícula.'],
'to': [3, 4]
},

{
'txt':['Certo, então me informe seu código de matrícula, por favor.'],
'full': new StepStuff([['~mat~']], [['updateUser']], [[]]),
'unf': new StepStuff([['~matex~'], ['!num!'], ['voltar']], [[], [], ['2']], [['Estanho, já tenho um registro com essa matrícula.', 'Talvez você digitou a' + 
    ' matrícula errada? Ou você já fez a rematrícula?', 'Se for o primeiro caso, é só enviar a matrícula correta, agora se você ainda não' + 
    ' fez a matrícula e isso tá aparecendo pra você, tente contatar alguém do departamento. Neste caso, basta me enviar "Contatar departamento".'], 
    ['Por favor, me mande um código de matrícula válido.'], ['Ok, então vou perguntar novamente. Você quer fazer sua rematrícula' + 
    ' com seu código de matrícula ou com seu CPF?']]),
'def':['Preciso que me mande sua matrícula.', 'Mas se você quiser voltar e escolher outra opção de rematrícula, basta me mandar voltar.'],
'to':[5]},

{
'txt':['Certo, então me informe seu CPF, por favor.'],
'full': new StepStuff([['~cpf~']], [['updateUser']], [[]]),
'unf': new StepStuff([['~invalcpf~'], ['voltar']], [[], ['2']], [['Este CPF não é válido... Poderia verificar e me mandar novamente?'], 
    ['Ok, então vou perguntar novamente. Você quer fazer sua rematrícula' + 
' com seu código de matrícula ou com seu CPF?']]),
'def':['Preciso que me mande seu CPF.', 'Mas se você quiser voltar e escolher outra opção de rematrícula, basta me mandar voltar.'],
'to':[6]},

{
'txt':['Sua matrícula é ~mat~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['3']], [['Ok, me envie o código de matrícula correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'to':[7]},

{
'txt':['Seu CPF é ~cpf~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['4']], [['Ok, me envie o CPF correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'to':[7]},

{
'txt':['Ok! Vamos só até aqui por enquanto.'],
'full': new StepStuff([['~nop~']], [[]], []),
'unf': new StepStuff([[]], [[]], [[]]),
'def':['Refatorei só até aqui por enquanto.'],
'to':[7]},
])

const recorrent = {
    '~matriz~'      : ['~getmatriz~'],
    '~revisar~'     : ['Seus dados: ~userinfo~', '~discesctxt~'],
    '~depart~'      : ['~depart~'],
    '~relatorio~'    : ['~relatorio~']
}

export {textkeep, defaultans, defdef, messages, recorrent, StepStuff}
