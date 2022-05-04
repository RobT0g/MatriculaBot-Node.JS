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
'txt':['Olá! Sou um bot programado para auxiliar o processo de matrícula do IFMA.',
    'Você gostaria de fazer alterações em sua matrícula?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': {},
'def':['Você só precisa me confirmar a qualquer momento para continuarmos.'],
'from':[-1],
'to':[1]},

{ 
'txt':['Beleza. Antes de continuarmos, só preciso fazer algumas verificações com você.',
    'Primeiramente, para que você altere sua matrícula, é necessário que você já esteja matrículado ' + 
    'nesse período. Então se certifique de que já tenha completado o formulário de rematrícula ou que' + 
    ' você já tenho feito sua matrícula no campus, caso seja do 1° período.',
    'Além disso, eu só irei verificar quais matérias você deseja adicionar ou retirar, portanto, ' + 
    'caso você queria rever quais matérias você já está programado para cursar, basta verificar ' + 
    'quais matérias você marcou no formulário de rematrícula, ou caso esteja no 1° preíodo, ' + 
    'basta verificá-las na matriz curricular do seu curso.',
    'O formulário de rematrícula pode ser encontrado aqui: ~getformremat~',
    'Se quiser ver a matriz curricular do seu curso, basta me enviar "Ver matriz curricular"' + 
    ' e eu lhe mandarei as instruções.',
    'Se ocorrer algum problema com o bot, basta ler a descrição do perfil.',
    'Quando estiver pronto para prosseguir basta me mandar um "Tudo pronto".'
],
'full': new StepStuff([['pronto']], [], []),
'unf': {},
'def':['Você só precisa me confirmar a qualquer momento para continuarmos.'],
'recomp': {'any': ['Só me mandar um "tudo pronto" para continuarmos!']},
'from':[0],
'to':[2]},

{
'txt':['Vou precisar de alguma informações suas. Primeiramente me informe seu código de matrícula.'],
'full': new StepStuff([['~matex~'], ['~mat~']], [[], ['prepareUser']], []),  //Excessão de matrícula que já existe
'unf': new StepStuff([['!num!'], ], [], [['Por favor, me mande um código de matrícula válido.'], 
    ['Esse código de matrícula já está registrado.', 'Você já fez seu registro?']]),
'def':['Preciso que me mande sua matrícula.'],
'from':[1],
'to':['qual passo?', 3]},

{
'txt':['Sua matrícula é ~mat~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['goBack']], [['Ok, me envie o código de matrícula correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[2],
'to':[4]},

{
'txt':['Agora me informe seu nome completo.'],
'full': new StepStuff([['~nome~']], [['updateUser']], []),
'unf': new StepStuff([['~1-wrd~']], [], [['Poderia rever o nome que você enviou?', 'Eu pedi que me enviasse ' + 
'seu nome completo, mas você só me enviou uma palavra.']]),
'def':['Por favor, me informe seu nome.'],
'from':[3],
'to':[5]},

{
'txt':['Seu nome completo é ~nome~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['goBack']], [['Ok, me envie o nome correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[4],
'to':[6]},

{
'txt':['Agora me informe seu Email.'],
'full': new StepStuff([['~email~']], [['updateUser']], []),
'unf': new StepStuff([['*@']], [], [['Me envie um email válido, por favor.']]),
'def':['Preciso do seu email.'],
'from':[5],
'to':[7]},

{
'txt':['Seu email é ~email~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['goBack']], [['Ok, me envie o email correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[6],
'to':[8]},

{
'txt':['Agora preciso saber qual é o seu curso.'],
'full': new StepStuff([['~curso~']], [['updateUser']], []),
'unf': new StepStuff([['~sim~', '~nao~']], [], [['Só precisa me enviar o nome do seu curso.']]),
'def':['Por favor, me mande o nome do seu curso.', 'É preciso ser um dos 4 do nosso campus: ' + 
'Administração, Engenharia da Computação, Física ou Construção de Edifícios.'],
'from':[7],
'to':[9]},

{
'txt':['Beleza, e qual o ano da sua turma? (ano em que você ingressou na instituição)'],
'full': new StepStuff([['~turma~']], [['insUpdateUser']], []),
'unf': new StepStuff([['~sim~', '~nao~']], [], [['Só precisa me enviar o ano da sua turma.']]),
'def':['Eu preciso do ano da sua turma, ou seja, o ano em que você entrou na instituição.'],
'from':[8],
'to':[10]},

{
'txt':['Então você é do curso ~curso~ da turma de ~turma~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['goTo8']], [['Ok, vamos voltar atrás então. Qual é mesmo o seu curso?']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[9],
'to':[11]},

{
'txt':['Me informe seu CPF.'],
'full': new StepStuff([['~cpf~']], [['updateUser']], []),
'unf': new StepStuff([['~num~']], [], [['Por favor, me envie um cpf válido.', 'Ele deve conter exatamente 11 ' + 
    'dígitos.']]),
'def':['Por favor, me informe o seu CPF.'],
'from':[10],
'to':[12]},

{
'txt':['Seu CPF é ~cpf~. Você confirma?'],
'full': new StepStuff([['~sim~']], [['effetivate']], []),
'unf': new StepStuff([['~nao~']], [['goBack']], [['Ok, me envie o CPF correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[11],
'to':[13]},

{
'txt':['Tudo certo. Agora nós começaremos o processo de adicionar/retirar matérias.', 'Para escolher uma das opções, basta me enviar' + 
    ' "adicionar" ou "retirar". Após cada processo de escolhas, você retornará para este ponto, e portanto pode mudar suas esolhas' + 
    ' ou até escolher mais matérias.', 'A partir deste ponto, você também pode rever algumas informações, como "matriz curricular"' + 
    ' para ver as disciplinas de cada curso e "revisar" se quiser rever todas as suas informações e escolhas.', '~finalizar~'],
'full': new StepStuff([['adicionar'], ['retirar'], ['~finalizar~']], [], []),
'unf': {},
'def':['Só dizer alguma das opções para continuarmos.'],
'from':[12],
'to':[14, 15, 18]},

//Step 14
{
'txt':['Ok, agora você irá selecionar as matérias que você deseja adicionar.', 'Para selecioná-las, basta me' + 
    ' mandar o id (número) das matérias, pode mandar vários de uma vez. Em seguida eu vou te mostrar' + 
    ' os requisitos delas, para que você confirme que pode cursar a matéria.', 'Não precisa se preocupar' + 
    ' em escolher errado neste momento, você poderá voltar se tiver escolhido alguma matéria errada.', 
    'Caso você não queira escolher as matérias, basta me mandar um "voltar", para voltar pro passo anterior.',
    'Você também pode me enviar "matriz curricular" ou "formulário" se quiser consultá-los novamente.',
    'Baseado no seu perfil, você provavelmente possui todos os requisitos para qualquer uma das matérias que' +
    ' estão nessa lista: ~recdisc~', 'Não precisa escolher dessa lista necessariamente, é só pra lhe dar' + 
    ' algumas ideias de matérias que você pode escolher.',],
'full': new StepStuff([['~matnums~'], ['~voltar~']], [['add_discs']], []),
'unf': {},
'def':['Basta me enviar os índices das matérias para continuarmos!'],
'from':[13],
'to':[16, 13]},

//Step 15
{
'txt':['Certo, agora você irá selecionar as matérias que deseja retirar.', 'Para selecioná-las, basta me' + 
    ' mandar o id (número) das matérias, pode mandar vários de uma vez. Em seguida eu vou confirmar as' + 
    ' suas escolhas com você, então não precisa se preocupar em escolher errado agora, você poderá voltar' + 
    ' se tiver escolhido alguma matéria errada.',
    'Caso você não queira escolher as matérias, basta me mandar um "voltar", para voltar pro passo anterior.',
    'Você também pode me enviar "matriz curricular" ou "formulário" se quiser consultá-los novamente.'],
'full': new StepStuff([['~matnums~'], ['~voltar~']], [['del_discs']], []),
'unf': {},
'def':['Basta me enviar os índices das matérias para continuarmos!'],
'from':[13],
'to':[17, 13]},

//Step 16
{
'txt':['Agora vamos confirmar se você escolheu tudo certinho.',
    'Estas são as matérias e seus requisitos:', '~instmatseladd~', 
    'Basta me dizer "sim" ou "não" para confirmar as escolhas agora!'],
'full': new StepStuff([['~sim~'], ['~voltar~']], [['effetivate'], ['cleareff']], []),
'unf': new StepStuff([['~nao~']], [['goBack']], [['Ok. Pode reenviar os números das matérias que deseja adicionar.']]),
'def':['Basta me confirmar com um sim ou não.'],
'recomp': {'any': 'Só precisa me dizer sim ou não para confirmar as suas escolhas.'},
'from':[14],
'to':[18, 13]},

//Step 17
{
'txt':['Você selecionou essas matérias: ~instmatseldel~', 
    'Basta me dizer "sim" ou "não" para confirmar as escolhas agora!'],
'full': new StepStuff([['~sim~'], ['~voltar~']], [['effetivate'], ['cleareff']], []),
'unf': new StepStuff([['~nao~']], [['goBack']], [['Ok. Pode reenviar os números das matérias que deseja retirar.']]),
'def':['Basta me confirmar com um sim ou não.'],
'recomp': {'any': 'Só precisa me dizer sim ou não para confirmar as suas escolhas.'},
'from':[15],
'to':[18, 13]},

//Step 18
{
'txt':['OK, suas escolhas foram salvas.', 'Agora, você pode escolher se quer voltar e adicionar/retirar' + 
    ' outras matérias, basta me mandar "voltar".', 'Se você já tiver terminado com suas escolhas, basta' +
    ' me mandar "finalizar".', 'Estas foram suas escolhas até o momento:', '~discesc~'],
'full': new StepStuff([['~voltar~'], ['~finalizar~']], [[], ['finalize']], []),
'unf': {},
'def':['Você só precisa me mandar "finalizar" ou "voltar" para continuarmos com este processo.'],
'recomp': {'any': ['Basta me mandar "finalizar" ou "voltar" para continuarmos.']},
'from':[13],
'to':[13, 19]},

//Step 19
{
'txt':['Pronto! Estamos finalizados com a sua alteração de matrícula.', /*'Eu irei te avisar quando o departamento', 
    ' tiver processado seu cadastro.', 'Neste ponto, você também pode requisitar refazer todo o processo', 
' para outra pessoa.'*/],
'full': new StepStuff([['~nop~']], [], []),
'unf': new StepStuff([['~nao~']], [['goBack']], [['Ok, me envie o nome correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[13],
'to':[14]},

])

const recorrent = {
    '~matriz~'      : ['~getmatriz~'],
    '~revisar~'     : ['Seus dados: ~userinfo~', '~discesc~'],
}

export {textkeep, defaultans, defdef, messages, recorrent, StepStuff}
