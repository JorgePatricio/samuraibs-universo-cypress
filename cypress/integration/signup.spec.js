import signupPage from '../support/pages/signup'

describe('cadastro', function () {

	before(function(){
		cy.fixture('signup').then(function(signup){
			this.success = signup.success
			this.email_dup = signup.email_dup
			this.email_inv = signup.email_inv
			this.short_pass = signup.short_pass
		})
	})

	context('quando o usuário é novato', function () {

		before(function () {
			cy.task('removeUser', this.success.email)
				.then(function (result) {
					console.log(result)
				})
		})

		it('deve cadastrar com sucesso', function () {
			signupPage.go()
			signupPage.form(this.success)
			signupPage.submit()
			signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
		})
	})

	context('quando o email já existe', function () {


		before(function () {
			cy.postUser(this.email_dup)
		})

		it('deve exibir email já cadastrado', function () {
			signupPage.go()
			signupPage.form(this.email_dup)
			signupPage.submit()
			signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
		})
	})

	context('quando o email é incorreto', function () {

		it('deve exibir mensagem de alerta', function () {
			signupPage.go()
			signupPage.form(this.email_inv)
			signupPage.submit()
			signupPage.alert.shouldHaveText('Informe um email válido')
		})
	})

	context('quando a senha tem menos de 6 caracteres', function () {

		const passwords = ['1', '1a', 'ab3', '1abc', 'ac#5d']

		beforeEach(function () {
			signupPage.go()
		})

		passwords.forEach(function (p) {
			it('não deve cadastrar com a senha: ' + p, function () {
				
				this.short_pass.password = p
				signupPage.form(this.short_pass)
				signupPage.submit()
			})
		})

		afterEach(function () {
			signupPage.alert.shouldHaveText('Pelo menos 6 caracteres')
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

		alertMessages.forEach(function(a){
			it('deve exibir ' + a.toLowerCase(), function() {
				signupPage.alert.shouldHaveText(a)
			})
		})
	})
})

