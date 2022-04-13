import signupPage from '../support/pages/signup'

describe('cadastro', function () {

	context('quando o usuário é novato', function () {
		const user = {
			name: 'Jorge Patricio',
			email: 'jorge@samuraibs.com',
			password: 'pwd123'
		}

		before(function () {
			cy.task('removeUser', user.email)
				.then(function (result) {
					console.log(result)
				})
		})

		it('deve cadastrar com sucesso', function () {
			signupPage.go()
			signupPage.form(user)
			signupPage.submit()
			signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
		})
	})

	context('quando o email já existe', function () {
		const user = {
			name: 'João Lucas',
			email: 'joao@samuraibs.com',
			password: 'pwd123',
			is_provider: true
		}

		before(function () {
			cy.postUser(user)
		})

		it('deve exibir email já cadastrado', function () {
			signupPage.go()
			signupPage.form(user)
			signupPage.submit()
			signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
		})
	})

	context('quando o email é incorreto', function () {
		const user = {
			name: 'Elizabeth Olsen',
			email: 'lisa.yahoo.com',
			password: 'pwd123'
		}

		it('deve exibir mensagem de alerta', function () {
			signupPage.go()
			signupPage.form(user)
			signupPage.submit()
			signupPage.alertHaveText('Informe um email válido')
		})
	})

	context('quando a senha tem menos de 6 caracteres', function () {

		const passwords = ['1', '1a', 'ab3', '1abc', 'ac#5d']

		beforeEach(function () {
			signupPage.go()
		})

		passwords.forEach(function (p) {
			it('não deve cadastrar com a senha: ' + p, function () {
				const user = {
					name: 'Jason Friday',
					email: 'jason@gmail.com',
					password: p
				}

				signupPage.form(user)
				signupPage.submit()
			})
		})

		afterEach(function () {
			signupPage.alertHaveText('Pelo menos 6 caracteres')
		})


	})

	context('quando não preencho nenhum dos campos', function() {

		const alertMessages = [
			'Nome é obrigatório',
			'E-mail é obrigatório',
			'Senha é obrigatória'
		]

		before(function () {
			signupPage.go()
			signupPage.submit()
		})

		alertMessages.forEach(function(alert){
			it('deve exibir ' + alert.toLowerCase(), function() {
				signupPage.alertHaveText(alert)
			})
		})
	})
})

