const express = require('express');
const mysql2 = require('mysql2/promise');
const bodyParser = require('body-parser');

const pool = mysql2.createPool({
	host: 'localhost',
	user: 'root',
	database: 'course_work',
	password: '',
});

const app = express();
app.use(bodyParser.urlencoded());

/*ГЛАВНОЕ МЕНЮ*/
app.get('/main_menu', function(req, res) {
	res.send(`
		<!DOCTYPE html>
		<html lang="ru">
			<head>
				<link rel="stylesheet" href="./styles/styles.css" />
			</head>
			<body>
				<header>
					<h3>Учёт таблиц в базе данных</h3>
					<nav>
						<form method="get" action="/city_db">
							<button> Учёт городов </button><br />
						</form>
						<form method="get" action="/category_db">
							<button> Учёт рубрик </button><br />
						</form>
						<form method="get" action="/organisation_db">
							<button> Учёт организаций </button><br />
						</form>	
						<form method="get" action="/person_db">	
							<button> Учёт физических лиц </button><br />
						</form>	
						<form method="get" action="/organisation_phone_number_db">	
							<button> Учёт номеров организаций </button><br />
						</form>
						<hr />
					</nav>
					<h3>Отчёты</h3>
					<nav>
						<form method="get" action="/city_phone_codes">
							<button> Список телефонных кодов городов</button><br />
						</form>
						<form method="get" action="/city_selection">
							<button type = submit> Список физических лиц выбранного города</button><br />
						</form>
						<form method="get" action="/cities_and_organisations">
							<button> Список всех организаций городов</button><br />
						</form>
						<form method="get" action="/category_selection">
							<button> Список организаций выбранного города и рубрики </button><br />
						</form>
					</nav>
				</header>
				<main>
					<article>
						<section>
						</section>
					</article>
				</main>
				<footer>
				</footer>
			</body>
		</html>`);
});

/*УЧЁТ ГОРОДОВ*/
app.get('/city_db', async function(req, res) {
	const data = await pool.query('SELECT * FROM city');
	const del = await pool.query('SELECT cityName FROM city');
	
	const delCity = del[0];
	const City = data[0];
		
	res.send(`
		<!DOCTYPE html>
		<html lang="ru">
			<head>
				<link rel="stylesheet" href="styles.css" />
				<nav>
					<form method="get" action="/main_menu">
						<button type = submit>Главное меню</button>
					</form>
				</nav>
				<h3>
					Учёт городов
				</h3>
				<hr />
			</head>
			<body>
				<header>
				</header>
				<main>
					<article>
						<section>
							<form method="post" action="/add_city">
								<input type="text" placeholder="Название города" name="cityName" required/>
								<input type="text" placeholder="Код номера" name="phoneCode" required/>
								<input type="text" placeholder="Название страны" name="countryName" required/>
								<button type = submit>Добавить</button>
							</form>
							<table>
							<tr>
								<th scope="col">Название города</th>
								<th scope="col">Телефонный код</th>
								<th scope="col">Страна</th>
								<th scope="col"></th>
							</tr>
							${City.map(City => `
								<tr>
									<td>${City.cityName}</td>
									<td>${City.phoneCode}</td>
									<td>${City.countryName}</td>
									<td><a href='/delete_city/${City.cityName}'>delete</a></td>
								</tr>
							`).join('')}
						</table>
						</section>
					</article>
				</main>
				<footer>
				</footer>
			</body>
		</html>`);
});

/*ДОБАВЛЕНИЕ ГОРОДОВ*/
app.post('/add_city', async function(req, res) {
	const data = await pool.query('SELECT * FROM category');
	const { cityName, phoneCode, countryName } = req.body;
	await pool.query ('INSERT INTO city SET ?', {
		cityName,
		phoneCode,
		countryName,
	});
	res.redirect('/city_db');
});

/*УДАЛЕНИЕ ГОРОДОВ*/
app.get('/delete_city/:city_query', async function(req, res) {
	const { city_query } = req.params;
	await pool.query ('DELETE FROM city WHERE cityName = ?', city_query);
	res.redirect('/city_db');
});

/*УЧЁТ РУБРИК*/
app.get('/category_db', async function(req, res) {
	const data = await pool.query('SELECT * FROM category');
	
	const Category = data[0];
		
	res.send(`
		<!DOCTYPE html>
		<html lang="ru">
			<head>
				<link rel="stylesheet" href="styles.css" />
				<nav>
					<form method="get" action="/main_menu">
						<button type = submit>Главное меню</button>
					</form>
				</nav>
				<h3>
					Учёт рубрик
				</h3>
				<hr />
			</head>
			<body>
				<header>
				</header>
				<main>
					<article>
						<section>
							<form method="post" action="/add_category">
								<input type="text" placeholder="Название категории" name="categoryName" required/>
								<button type = submit>Добавить</button>
							</form>
							<table>
							<tr>
								<th scope="col">ID Категории</th>
								<th scope="col">Название категории</th>
								<th scope="col"></th>
							</tr>
							${Category.map(Category => `
								<tr>
									<td>${Category.categoryID}</td>
									<td>${Category.categoryName}</td>
									<td><a href='/delete_category/${Category.categoryID}'>delete</a></td>
								</tr>
							`).join('')}
						</table>
						</section>
					</article>
				</main>
				<footer>
				</footer>
			</body>
		</html>`);
});

/*ДОБАВЛЕНИЕ РУБРИК*/
app.post('/add_category', async function(req, res) {
	const categoryID = '';
	const data = await pool.query('SELECT * FROM category');
	const { categoryName } = req.body;
	await pool.query ('INSERT INTO category SET ?', {
		categoryID,
		categoryName,
	});
	res.redirect('/category_db');
});

/*УДАЛЕНИЕ РУБРИК*/
app.get('/delete_category/:category_query', async function(req, res) {
	const { category_query } = req.params;
	await pool.query ('DELETE FROM category WHERE categoryID = ?', category_query);
	res.redirect('/category_db');
});

/*УЧЁТ ОРГАНИЗАЦИЙ*/
app.get('/organisation_db', async function(req, res) {
	const data = await pool.query('SELECT * FROM organisation');
	
	const Organisation = data[0];
		
	res.send(`
		<!DOCTYPE html>
		<html lang="ru">
			<head>
				<link rel="stylesheet" href="styles.css" />
				<nav>
					<form method="get" action="/main_menu">
						<button type = submit>Главное меню</button>
					</form>
				</nav>
				<h3>
					Учёт организаций
				</h3>
				<hr />
			</head>
			<body>
				<header>
				</header>
				<main>
					<article>
						<section>
							<form method="post" action="/add_organisation">
								<input type="text" placeholder="Название организации" name="organisationName" required/>
								<select name="org_cityName" id="org_cityName" required>
									<option type = "text" value="">Выберите город из списка</option>
									${Organisation.map(Organisation => `<option value=${Organisation.org_cityName}>${Organisation.org_cityName}</option>`).join('')}
								</select>
								<select name="org_categoryID" id="org_categoryID" required>
									<option type = "text" value="">Выберите ID рубрики из списка</option>
									${Organisation.map(Organisation => `<option value=${Organisation.org_categoryID}>${Organisation.org_categoryID}</option>`).join('')}
								</select>
								<input type="text" placeholder="Улица" name="street" required/>
								<input type="text" placeholder="Здание" name="building" required/>
								<button type = submit>Добавить</button>
							</form>
							<table>
							<tr>
								<th scope="col">Название организации</th>
								<th scope="col">Название города</th>
								<th scope="col">ID категории</th>
								<th scope="col">Улица</th>
								<th scope="col">Здание</th>
								<th scope="col"></th>
							</tr>
							${Organisation.map(Organisation => `
								<tr>
									<td>${Organisation.organisationName}</td>
									<td>${Organisation.org_cityName}</td>
									<td>${Organisation.org_categoryID}</td>
									<td>${Organisation.street}</td>
									<td>${Organisation.building}</td>
									<td><a href='/delete_organisation/${Organisation.organisationName}'>delete</a></td>
								</tr>
							`).join('')}
						</table>
						</section>
					</article>
				</main>
				<footer>
				</footer>
			</body>
		</html>`);
});

/*ДОБАВЛЕНИЕ ОРГАНИЗАЦИЙ*/
app.post('/add_organisation', async function(req, res) {
	const data = await pool.query('SELECT * FROM organisation');
	const { organisationName, org_cityName, org_categoryID, street, building } = req.body;
	await pool.query ('INSERT INTO organisation SET ?', {
		organisationName,
		org_cityName,
		org_categoryID,
		street,
		building,
	});
	res.redirect('/organisation_db');
});

/*УДАЛЕНИЕ ФИЗИЧЕСКИХ ЛИЦ*/
app.get('/delete_organisation/:organisation_query', async function(req, res) {
	const { organisation_query } = req.params;
	await pool.query ('DELETE FROM organisation WHERE organisationName = ?', organisation_query);
	res.redirect('/organisation_db');
});

/*УЧЁТ ФИЗИЧЕСКИХ ЛИЦ*/
app.get('/person_db', async function(req, res) {
	const data = await pool.query('SELECT * FROM person');
	
	const Person = data[0];
		
	res.send(`
		<!DOCTYPE html>
		<html lang="ru">
			<head>
				<link rel="stylesheet" href="styles.css" />
				<nav>
					<form method="get" action="/main_menu">
						<button type = submit>Главное меню</button>
					</form>
				</nav>
				<h3>
					Учёт физических лиц
				</h3>
				<hr />
			</head>
			<body>
				<header>
				</header>
				<main>
					<article>
						<section>
							<form method="post" action="/add_person">
								<select name="per_cityName" id="per_cityName" required>
									<option type = "text" value="">Выберите город из списка</option>
									${Person.map(Person => `<option value=${Person.per_cityName}>${Person.per_cityName}</option>`).join('')}
								</select>
								<input type="text" placeholder="Фамилия" name="surname" required/>
								<input type="text" placeholder="Имя" name="name" required/>
								<input type="text" placeholder="Отчество" name="patronymic" required/>
								<input type="text" placeholder="Номер телефона" name="personPhoneNumber" required/>
								<button type = submit>Добавить</button>
							</form>
							<table>
							<tr>
								<th scope="col">ID физического лица</th>
								<th scope="col">Название города</th>
								<th scope="col">Фамилия</th>
								<th scope="col">Имя</th>
								<th scope="col">Отчество</th>
								<th scope="col">Номер телефона</th>
							</tr>
							${Person.map(Person => `
								<tr>
									<td>${Person.personID}</td>
									<td>${Person.per_cityName}</td>
									<td>${Person.surname}</td>
									<td>${Person.name}</td>
									<td>${Person.patronymic}</td>
									<td>${Person.personPhoneNumber}</td>
									<td><a href='/delete_person/${Person.personID}'>delete</a></td>
								</tr>
							`).join('')}
						</table>
						</section>
					</article>
				</main>
				<footer>
				</footer>
			</body>
		</html>`);
});

/*ДОБАВЛЕНИЕ ФИЗИЧЕСКИХ ЛИЦ*/
app.post('/add_person', async function(req, res) {
	const personID = '';
	const data = await pool.query('SELECT * FROM person');
	const { per_cityName, surname, name, patronymic, personPhoneNumber } = req.body;
	await pool.query ('INSERT INTO person SET ?', {
		personID,
		per_cityName,
		surname,
		name,
		patronymic,
		personPhoneNumber,
	});
	res.redirect('/person_db');
});

/*УДАЛЕНИЕ ФИЗИЧЕСКИХ ЛИЦ*/
app.get('/delete_person/:person_query', async function(req, res) {
	const { person_query } = req.params;
	await pool.query ('DELETE FROM person WHERE personID = ?', person_query);
	res.redirect('/person_db');
});

/*УЧЁТ НОМЕРОВ ТЕЛЕФОНОВ ОРГАНИЗАЦИЙ*/
app.get('/organisation_phone_number_db', async function(req, res) {
	const data = await pool.query('SELECT * FROM organisation_phone_number');
	
	const OrganisationPN = data[0];
		
	res.send(`
		<!DOCTYPE html>
		<html lang="ru">
			<head>
				<link rel="stylesheet" href="styles.css" />
				<nav>
					<form method="get" action="/main_menu">
						<button type = submit>Главное меню</button>
					</form>
				</nav>
				<h3>
					Учёт номеров телефонов организаций
				</h3>
				<hr />
			</head>
			<body>
				<header>
				</header>
				<main>
					<article>
						<section>
							<form method="post" action="/add_orgPN">
								<input type="text" placeholder="Номер организации" name="organisationPhoneNumber" required/>
								<select name="PN_organisationName" id="PN_organisationName" required>
									<option type = "text" value="">Выберите организацию из списка</option>
									${OrganisationPN.map(OrganisationPN => `<option value=${OrganisationPN.PN_organisationName}>${OrganisationPN.PN_organisationName}</option>`).join('')}
								</select>
								<button type = submit>Добавить</button>
							</form>
							<table>
							<tr>
								<th scope="col">Номер телефона организации</th>
								<th scope="col">Название организации</th>
								<th scope="col"></th>
							</tr>
							${OrganisationPN.map(OrganisationPN => `
								<tr>
									<td>${OrganisationPN.organisationPhoneNumber}</td>
									<td>${OrganisationPN.PN_organisationName}</td>
									<td><a href='/delete_orgPN/${OrganisationPN.organisationPhoneNumber}'>delete</a></td>
								</tr>
							`).join('')}
						</table>
						</section>
					</article>
				</main>
				<footer>
				</footer>
			</body>
		</html>`);
});

/*ДОБАВЛЕНИЕ НОМЕРОВ ОРГАНИЗАЦИЙ*/
app.post('/add_orgPN', async function(req, res) {
	const data = await pool.query('SELECT * FROM category');
	const { organisationPhoneNumber, PN_organisationName } = req.body;
	console.log(req.body);
	await pool.query ('INSERT INTO organisation_phone_number SET ?', {
		organisationPhoneNumber,
		PN_organisationName,
	});
	res.redirect('/organisation_phone_number_db');
});

/*УДАЛЕНИЕ НОМЕРОВ ОРГАНИЗАЦИЙ*/
app.get('/delete_orgPN/:orgPN_query', async function(req, res) {
	const { orgPN_query } = req.params;
	await pool.query ('DELETE FROM organisation_phone_number WHERE organisationPhoneNumber = ?', orgPN_query);
	res.redirect('/organisation_phone_number_db');
});

/*ОТЧЁТ СПИСОК ТЕЛЕФОННЫХ КОДОВ*/
app.get('/city_phone_codes', async  function(req, res) {
	const data = await pool.query('SELECT city.cityName, city.phoneCode FROM city');
	 
	const Codes = data[0];
		
	res.send(`
	<!DOCTYPE html>
	<html lang="ru">
		<head>
			<link rel="stylesheet" href="styles.css" />
			<nav>
				<form method="get" action="/main_menu">
					<button type = submit>Главное меню</button>
				</form>
			</nav>
			<h3>
				Список телефонных кодов городов
			</h3>
			<hr />			
		</head>
		<body>
			<header>
			</header>
			<main>
				<article>
					<section>
						<table>
							<tr>
								<th scope="col">Город</th>
								<th scope="col">Телефонный код</th>
							</tr>
							${Codes.map(Codes => `
								<tr>
									<td>${Codes.cityName}</td>
									<td>${Codes.phoneCode}</td>
								</tr>
							`).join('')}
						</table>
					</section>
				</article>
			</main>
			<footer>
			</footer>
		</body>
	</html>`);
});

/*ВЫБОР ГОРОДА*/
app.get('/city_selection', async function(req, res) {
	const data = await pool.query('SELECT city.cityName FROM city');
	
	const City = data[0];
		
	res.send(`
	<!DOCTYPE html>
	<html lang="ru">
		<head>
			<link rel="stylesheet" href="styles.css" />
			<nav>
				<form method="get" action="/main_menu">
					<button type = submit>Главное меню</button>
				</form>
			</nav>
			<h3>
				Выбор города
			</h3>
			<hr />	
		</head>
		<body>
			<header>
			</header>
			<main>
				<article>
					<section>
						<form method="get" action="/person_of_the_city">
							<select name="city_query" id="city-query">
								<option type = "text" value="">Выберите город из списка</option>
								${City.map(City => `<option value=${City.cityName}>${City.cityName}</option>`).join('')}
							</select>
							<button type = submit>Поиск</button>
						</form>
					</section>
				</article>
			</main>
			<footer>
			</footer>
		</body>
	</html>`);
});

/*ОТЧЁТ ФИЗИЧЕСКИХ ЛИЦ В ОПРЕДЕЛЕННОМ ГОРОДЕ*/
app.get('/person_of_the_city', async function(req, res) {
	
	const city_query = req.query.city_query;
	
	const data = await pool.query(`
		SELECT city.cityName, person.surname, person.name, person.patronymic, person.personPhoneNumber
		FROM person
		JOIN city ON person.per_cityName = city.cityName
		WHERE person.per_cityName LIKE ?
	`, '%'+city_query+'%').then(function(data) {
		
	const Person = data[0];
		
	res.send(`
	<!DOCTYPE html>
	<html lang="ru">
		<head>
			<link rel="stylesheet" href="styles.css" />
		</head>
		<body>
			<header>
				<nav>
					<form method="get" action="/main_menu">
						<button type = submit>Главное меню</button>
					</form>
					<form method="get" action="/city_selection">
						<button> Выбор города </button><br />
					</form>
				</nav>
				<h3>
					Список физических лиц выбранного города
				</h3>
				<hr />
			</header>
			<main>
				<article>
					<section>
						<table>
							<tr>
								<th scope="col">Город</th>
								<th scope="col">Фамилия</th>
								<th scope="col">Имя</th>
								<th scope="col">Отчество</th>
								<th scope="col">Номер телефона</th>
							</tr>
							${Person.map(Person => `
								<tr>
									<td>${Person.cityName}</td>
									<td>${Person.surname}</td>
									<td>${Person.name}</td>
									<td>${Person.patronymic}</td>
									<td>${Person.personPhoneNumber}</td>
								</tr>
							`).join('')}
						</table>
					</section>
				</article>
			</main>
			<footer>
			</footer>
		</body>
	</html>`);
	});
});

/*ОТЧЁТ ВСЕХ ОРГАНИЗАЦИЙ И ИХ ГОРОДОВ*/
app.get('/cities_and_organisations', async function(req, res) {
	const data = await pool.query(`
		SELECT organisation.organisationName, city.cityName, organisation.street, organisation.building 
		FROM organisation
		JOIN city ON organisation.org_cityName = city.cityName
	`)
	
	const Organisations = data[0];
		
	res.send(`
	<!DOCTYPE html>
	<html lang="ru">
		<head>
			<link rel="stylesheet" href="styles.css" />
			<nav>
				<form method="get" action="/main_menu">
					<button type = submit>Главное меню</button>
				</form>
			</nav>
			<h3>
				Список организаций всех городов
			</h3>
			<hr />			
		</head>
		<body>
			<header>
			</header>
			<main>
				<article>
					<section>
						<table>
							<tr>
								<th scope="col">Название организации</th>
								<th scope="col">Город</th>
								<th scope="col">Улица</th>
								<th scope="col">Здание</th>
							</tr>
							${Organisations.map(Organisations => `
								<tr>
									<td>${Organisations.organisationName}</td>
									<td>${Organisations.cityName}</td>
									<td>${Organisations.street}</td>
									<td>${Organisations.building}</td>
								</tr>
							`).join('')}
						</table>
					</section>
				</article>
			</main>
			<footer>
			</footer>
		</body>
	</html>`);
	
});

/*ВЫБОР ГОРОДА И РУБРИКИ*/
app.get('/category_selection', async function(req, res) {
	const data = await pool.query(`
		SELECT city.cityName, category.categoryID, category.categoryName
		FROM city
		JOIN organisation ON organisation.org_cityName = city.cityName
		JOIN category ON organisation.org_categoryID = category.categoryID
		WHERE organisation.org_cityName LIKE city.cityName
       	AND organisation.org_categoryID LIKE category.categoryID
	`);
	
	const Category = data[0];
		
	res.send(`
	<!DOCTYPE html>
	<html lang="ru">
		<head>
			<link rel="stylesheet" href="styles.css" />
			<nav>
				<form method="get" action="/main_menu">
					<button type = submit>Главное меню</button>
				</form>
			</nav>
			<h3>
				Выбор рубрики и города
			</h3>
			<hr />			
		</head>
		<body>
			<header>
			</header>
			<main>
				<article>
					<section>
						<form method="get" action="/organisation_of_the_category">
							<select name="category_query" id="categoty-query">
								<option type = "text" value="">Выберите категорию из списка</option>
								${Category.map(Category => `<option value=${Category.categoryID}>${Category.categoryName}</option>`).join('')}
							</select>
							<select name="city_query" id="city-query">
								<option type = "text" value="">Выберите город из списка</option>
								${Category.map(Category => `<option value=${Category.cityName}>${Category.cityName}</option>`).join('')}
							</select>
							<button type = submit>Поиск</button>
						</form>
					</section>
				</article>
			</main>
			<footer>
			</footer>
		</body>
	</html>`);
});

/*ОТЧЁТ ОРГАНИЗАЦИЙ В ОПРЕДЕЛЁННОМ ГОРОДЕ И РУБРИКЕ*/
app.get('/organisation_of_the_category', async function(req, res) {
	
	const category_query = req.query.category_query;
	const city_query = req.query.city_query;
	
	const data = await pool.query(`
		SELECT organisation.organisationName, city.cityName, category.categoryID, category.categoryName
		FROM organisation
		JOIN city ON organisation.org_cityName = city.cityName
		JOIN category ON organisation.org_categoryID = category.categoryID
		WHERE category.categoryID LIKE ?
	`, '%'+category_query+'%',`
		AND city.cityName LIKE ?
	`, '%'+city_query+'%',`
		GROUP BY organisation.organisationName
	`);
	
	const Organisation = data[0];
		
		res.send(`
		<!DOCTYPE html>
		<html lang="ru">
			<head>
				<link rel="stylesheet" href="styles.css" />
			</head>
			<body>
				<header>
					<nav>
						<form method="get" action="/main_menu">
							<button type = submit> Главное меню </button>
						</form>
						<form method="get" action="/category_selection">
							<button> Выбор рубрики и города </button><br />
						</form>
					</nav>
					<h3>
						Список организаций в выбранном городе и рубрике
					</h3>
					<hr />
				</header>
				<main>
					<article>
						<section>
							<table>
								<tr>
									<th scope="col">Организация</th>
									<th scope="col">Город</th>
									<th scope="col">Название рубрики</th>
								</tr>
								${Organisation.map(Organisation => `
									<tr>
										<td>${Organisation.organisationName}</td>
										<td>${Organisation.cityName}</td>
										<td>${Organisation.categoryName}</td>
									</tr>
								`).join('')}
							</table>
						</section>
					</article>
				</main>
				<footer>
				</footer>
			</body>
		</html>`);
});

app.listen(3000, function() {
	console.log('Server started :3');
})