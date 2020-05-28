// variaveis essenciais
let tabUsers = null;
let tabEstatistics = null;

let buttonSearsh = null;
let searshInput = null;

let allPeople = [];
let allEstatistics = [];

let countUsers = 0;
let countEstatistics = 0;
let countMale = 0;
let countFemale = 0;
let totalAges = 0;
let mediaAges = 0;

// load antes de começar pagina
window.addEventListener('load', start);

// função que inicializa tudo
function start() {
  // variaveis que pega elementos do HTML
  tabUsers = document.querySelector('#tabUsers');
  tabEstatistics = document.querySelector('#tabEstatistics');

  countUsers = document.querySelector('#countUsers');
  countEstatistics = document.querySelector('#countEstatistics');
  countMale = document.querySelector('#countMale');
  countFemale = document.querySelector('#countFemale');
  totalAges = document.querySelector('#totalAges');
  mediaAges = document.querySelector('#mediaAges');

  searshInput = document.querySelector('#searshInput');
  buttonSearsh = document.querySelector('#buttonSearsh');

  buttonSearsh.disabled = true;

  handleSearshing();
}

function handleSearshing() {
  searshInput.addEventListener('keyup', fetchPeople);

  // função requisição de dados da API
  async function fetchPeople(event) {
    if (searshInput.value === '') {
      buttonSearsh.disabled = true;
      cleanRender();
      return;
    }

    buttonSearsh.disabled = false;

    if (event.key === 'Enter') {
      let searsh = searshInput.value;

      // link
      const res = await fetch(
        'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
      );
      // passa pra JSON
      const json = await res.json();

      // salvar dados nas variaveis
      allPeople = json.results
        .map((person) => {
          const { name, picture: thumbnail, dob: age, gender } = person;

          return {
            name: `${name.first} ${name.last}`,
            picture: thumbnail.thumbnail,
            age: age.age,
            gender: gender,
          };
        })
        .filter((person) => {
          name = person.name;
          return name.toLowerCase().includes(searsh.toLowerCase());
        })
        .sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

      // chama renderização
      render();
    }
  }
}

function cleanRender() {
  countUsers.textContent = 'Nenhum usuário filtrado';
  countEstatistics.textContent = 'Nada a ser exibido';
  tabUsers.textContent = null;

  countMale.textContent = null;
  countFemale.textContent = null;
  totalAges.textContent = null;
  mediaAges.textContent = null;
}

// renderizar tudo
function render() {
  // fazendo ***************
  if (allPeople.length === 0 || allPeople.length === 100) {
    cleanRender();

    return;
  }
  countEstatistics.textContent = 'Estatísticas';
  // chamar funções para renderizar conteudo
  renderUsersList();
  renderEstatistics();
}

// renderizar lista de usuários
function renderUsersList() {
  let peopleHTML = "<div class='users'>";

  allPeople.forEach((person, index) => {
    const { name, picture, age } = person;

    const personHTML = `
      <div class='person'>
        <div>
          <img src="${picture}" alt="${name}" />
        </div>
        <div>
          <p>${name}, ${age} anos</p>
        </div>
      </div>
    `;

    peopleHTML += personHTML;
  });

  tabUsers.innerHTML = peopleHTML;
}

// renderizar estatisticas
function renderEstatistics() {
  // ok
  countUsers.textContent = allPeople.length + ' usuário(s) encontrado(s)';

  // ok
  const totalMale = allPeople.filter((gender) => 'male' === gender.gender);

  // ok
  const totalFemale = allPeople.filter((gender) => gender.gender === 'female');

  // ok
  const countAges = allPeople.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  // ok
  const countMediaAges = allPeople.reduce((accumulator, current) => {
    result = accumulator + current.age;
    return result;
  }, 0);

  totalCountMediaAges = countMediaAges / allPeople.length;

  countMale.textContent = `Sexo masculino: ${totalMale.length}`;
  countFemale.textContent = `Sexo feminino: ${totalFemale.length}`;
  totalAges.textContent = `Soma das idades: ${countAges}`;
  mediaAges.textContent = `Média das idades: ${totalCountMediaAges.toLocaleString(
    'pt-BR'
  )}`;
}
