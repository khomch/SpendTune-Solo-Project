describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });


  it('should register a new user with valid information', () => {
    cy.get('input[name="email"]').type(Cypress.env('newEmail'));
    cy.get('input[name="password"]').type(Cypress.env('newPassword'));
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('DoeTheSecond');

    cy.get('form').submit();
    cy.url().should('include', '/home');

    // Assert that the user is logged in
    cy.get('.register').should('not.exist'); // Assuming the registration form is hidden after successful registration
  });

  it('should show an error message with invalid registration information', () => {
    cy.get('input[name="email"]').type('invalidemail');
    cy.get('input[name="password"]').type('short');
    cy.get('input[name="firstName"]').type('fakeName');
    cy.get('input[name="lastName"]').type('fakeLastName');

    cy.get('form').submit();

    cy.get('input[name="email"]').should('not.have.text');
  });

  it('should navigate back to the login page', () => {
    cy.get('.register__actions button:last-child').click();
    cy.url().should('include', '/login');
  });

/*   TODO: make it so I can delete the user
after(() => {
    let user;
    cy.request({
      url: 'http://localhost:3001/login',
      method: 'POST',
      body: {
        email: Cypress.env('newEmail'),
        password: Cypress.env('newPassword')
      }
    }).its('body').then(res => user = res);
      
    console.log('user :>> ', user);
    cy.request({
      url:'http://localhost:3000/user',
      method: 'DELETE',
      auth: { bearer: user.token }
    })
  }); */
});




describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });
  
  it('should log in with valid credentials', () => {
    cy.get('input[name="email"]').type(Cypress.env('email'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('form').submit();
  
    cy.url().should('include', '/home');
    cy.get('.login').should('not.exist');
  });

  it('should show an error message with invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@email.com');
    cy.get('input[name="password"]').type('invalidpassword');

    cy.get('form').submit();
    cy.url().should('include', '/login');
  });

  it('should navigate to the registration page', () => {
    cy.get('.login__register button').click();
    cy.url().should('include', '/register');
  });
});








