const textkeep = {}
const defaultans = {}
const defdef = ['Não reconheci o que você enviou.', 'Poderia responder minha pergunta anterior?']
const messages = []

//--------TODO--------//
/**
 *  
 */ 

class StepStuff{
    constructor(tags=[[]], actions=[''], msg=[[]]){
        let t = typeof(tags)=='object'?(typeof(tags[0])=='object'?tags:[tags]):[[tags]]
        let a = typeof(actions)=='object'?actions:[actions]
        let m = typeof(msg)=='object'?(typeof(msg[0])=='object'?msg:[msg]):[[msg]]
        for (let i in t)
            this[t[i]] = { alts:t[i].splice(1), actions:(a[i]?a[i]:''), msg:(m[i]?m[i]:[]) }
    }

    getTags(){
        return Object.keys(this).map((i) => {let j = [i]; j.push(...this[i].alts); return j})
    }
}

/**
 * Novo Modelo de organização das mensagens:
 * O array message contém em cada item as informações pra criação de um bloco, assim como os steps deste
 * bloco. A composição dos itens do array é:
 *  {from, to, step(array com os steps)}
 * Já os steps, são configurados no formato:
 *  {txt, full, unf(estes dois são instancias de StepStuff), def, from, to}
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
    'O formulário de rematrícula pode ser encontrado aqui: ' +
    'https://docs.google.com/forms/d/e/1FAIpQLSfW29Ml1eWBmltoX428vsH1cErALrac0NA8Ma3Mvu9BPSlONg/viewform?edit2=2_ABaOnud33HrxwsaUv_UQmUhruKOGVMUXjwiiRIKf8tbfKBvyD6PoGS5_4PVxwA03qw',
    'Se quiser ver a matriz curricular do seu curso, basta me enviar "Ver matriz curricular"' + 
    ' e eu lhe mandarei as instruções.',
    'Se ocorrer algum problema com o bot, basta ler a descrição do perfil.',
    'Quando estiver pronto para prosseguir basta me mandar um "Tudo pronto".'
],
'full': new StepStuff([['pronto']], [], []),
'unf': new StepStuff([['matriz&curricular']], [], [['Matriz curricular de cada curso:\n' + 
    '> Administração (página 14): https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2018/06/PROJETO-ADMINISTRA%C3%87%C3%83O.pdf\n' + 
    '> Engenharia da Computação: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2019/03/matriz_curricular_enge_comp.pdf\n' + 
    '> Física: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2019/02/matriz_curricular_fisica.pdf\n' + 
    '> TCE: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2018/10/MatrizCurEdific.pdf',
'   Quando estiver pronto para prosseguir, basta me enviar "Tudo pronto".']]),
'def':['Você só precisa me confirmar a qualquer momento para continuarmos.'],
'from':[0],
'to':[2]},

{
'txt':['Vou precisar de alguma informações suas. Primeiramente me informe seu código de matrícula.'],
'full': new StepStuff([['~mat~']], ['register'], []),
'unf': new StepStuff([['!num!']], [], [['Por favor, me mande um código de matrícula válido.']]),
'def':['Preciso que me mande sua matrícula.'],
'from':[1],
'to':[3]},

{
'txt':['Sua matrícula é ~mat~. Você confirma?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': new StepStuff([['~nao~']], ['goBack'], [['Ok, me envie o código de matrícula correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[2],
'to':[4]},

{
'txt':['Agora me informe seu nome completo.'],
'full': new StepStuff([['~nome~']], ['register'], []),
'unf': new StepStuff([['1-wrd']], [], [['Poderia rever o nome que você enviou?', 'Eu pedi que me enviasse ' + 
'seu nome completo, mas você só me enviou uma palavra.']]),
'def':['Por favor, me informe seu nome.'],
'from':[3],
'to':[5]},

{
'txt':['Seu nome completo é ~nome~. Você confirma?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': new StepStuff([['~nao~']], ['goBack'], [['Ok, me envie o nome correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[4],
'to':[6]},

{
'txt':['Agora me informe seu Email.'],
'full': new StepStuff([['~email~']], ['register'], []),
'unf': new StepStuff([['*@']], [], [['Me envie um email válido, por favor.']]),
'def':['Preciso do seu email.'],
'from':[5],
'to':[7]},

{
'txt':['Seu email é ~email~. Você confirma?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': new StepStuff([['~nao~']], ['goBack'], [['Ok, me envie o email correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[6],
'to':[8]},

{
'txt':['Agora preciso saber qual é o seu curso.'],
'full': new StepStuff([['~curso~']], ['register'], []),
'unf': new StepStuff([['~sim~', '~nao~']], [], [['Só precisa me enviar o nome do seu curso.']]),
'def':['Por favor, me mande o nome do seu curso.', 'É preciso ser um dos 4 do nosso campus: ' + 
'Administração, Engenharia da Computação, Física e Construção de Edifícios.'],
'from':[7],
'to':[9]},

{
'txt':['Beleza, e qual o ano da sua turma? (ano em que você ingressou na instituição)'],
'full': new StepStuff([['~ano~']], ['register'], []),
'unf': new StepStuff([['~sim~', '~nao~']], [], [['Só precisa me enviar o ano da sua turma.']]),
'def':['Eu preciso do ano da sua turma, ou seja, o ano em que você entrou na instituição.'],
'from':[8],
'to':[10]},

{
'txt':['Então você é do curso ~curso~ da turma de ~ano~. Você confirma?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': new StepStuff([['~nao~']], ['goTo-8'], [['Ok, vamos voltar atrás então. Qual é mesmo o seu curso?']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[9],
'to':[11]},

{
'txt':['Me informe seu CPF.'],
'full': new StepStuff([['~cpf~']], ['register'], []),
'unf': new StepStuff([['~num~']], [], [['Por favor, me envie um cpf válido.', 'Ele deve conter exatamente 11 ' + 
    'dígitos.']]),
'def':['Por favor, me informe o seu CPF.'],
'from':[10],
'to':[12]},

{
'txt':['Seu CPF é ~cpf~. Você confirma?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': new StepStuff([['~nao~']], ['goBack'], [['Ok, me envie o CPF correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[11],
'to':[13]},

{
'txt':['Tudo certo. Agora nós começaremos a ver quais as matérias você quer adicionar ou retirar.',
    'Repito que para ver as matérias que você optou por cursar, deve rever o formulário de rematrícula ou' + 
    ' a matriz curricular do seu curso.', 'Basta me enviar "Formulário" ou "Matriz Curricular" se quiser' +
    ' rever algum destes.', 'Esse processo será feito da seguinte maneira: Primeiramente você irá dizer ' + 
    'se quer adicionar alguma matéria. Vou te mostrar as opções com base no ano da sua turma, e apresentarei os ' + 
    'requisitos de cada matéria que você quiser adicionar. Caso você coloque a matéria mesmo sem ter os ' + 
    'requisitos, o departamento não irá adicioná-la, então não tem problema errar nesse ponto.',
     'Depois será feito o mesmo para as matérias ' + 
    'que você for retirar. Além disso, não precisa se preocupar em adicionar/retirar todas de uma vez, ' + 
    'mesmo já tendo terminado o processo, se o bot estiver ativo você pode vir novamente e pedir para ' + 
    'ver as matérias que você escolheu, assim como para adicionar/retirar mais.',
    'Vamos iniciar agora. Você está pronto para continuar?'],
'full': new StepStuff([['~sim~']], [], []),
'unf': new StepStuff([['matriz&curricular'], ['formulario']], [], [['Matriz curricular de cada curso:\n' + 
    '> Administração (página 14): https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2018/06/PROJETO-ADMINISTRA%C3%87%C3%83O.pdf\n' + 
    '> Engenharia da Computação: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2019/03/matriz_curricular_enge_comp.pdf\n' + 
    '> Física: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2019/02/matriz_curricular_fisica.pdf\n' + 
    '> TCE: https://santaines.ifma.edu.br/wp-content/uploads/sites/14/2018/10/MatrizCurEdific.pdf',
    'Quando estiver pronto para prosseguir, basta me mandar um "sim".'], ['O formulário de rematrícula pode ser encontrado aqui: ' +
    'https://docs.google.com/forms/d/e/1FAIpQLSfW29Ml1eWBmltoX428vsH1cErALrac0NA8Ma3Mvu9BPSlONg/viewform?edit2=2_ABaOnud33HrxwsaUv_UQmUhruKOGVMUXjwiiRIKf8tbfKBvyD6PoGS5_4PVxwA03qw',
    'Quando estiver pronto para prosseguir, basta me mandar um "sim".']]),
'def':['Só dizer sim ou não para adicionar matérias, ou dizer "Matriz Curricular" ou "Formulário" para mais ' + 
    'informações.'],
'from':[12],
'to':[14]},

{
'txt':['Ok, neste ponto você poderá escolher se quer adicionar ou remover as disciplinas, ver quais você ' + 
    'já escolheu além de poder rever suas informações.', 'Basta me enviar "Adicionar" ou "Retirar" para ' + 
    'selecionar as matérias que você deseja adicionar ou retirar, ou me envie um "Revisar" para rever ' +
    'o que você já escolheu, assim como rever suas informações.'],
'full': new StepStuff([['adicionar'], ['retirar']], [], []),
'unf': new StepStuff([['revisar']], [], [['Seus dados: ~userinfo~', '~discesc~', 'Basta me enviar '+
    '"Adicionar" ou "Retirar" para continuarmos.']]),
'def':['Basta me enviar "Adicionar" ou "Retirar" para continuarmos.'],
'from':[13],
'to':[16]},

{
'txt':['Certo, por enquanto você colocou esta(s) disiciplina(s):\n~'],
'full': new StepStuff([['~nop~']], [], []),
'unf': {},
'def':['Por enquanto é só até aqui.'],
'from':[14],
'to':[14]},

{
'txt':['Aqui a gente para.'],
'full': new StepStuff([['~nop~']], [], []),
'unf': new StepStuff([['~nao~']], ['goBack'], [['Ok, me envie o nome correto agora 🤨']]),
'def':['Você só precisa me mandar um "sim" ou "não" para confirmar.'],
'from':[13],
'to':[14]},

])

export {textkeep, defaultans, defdef, messages}