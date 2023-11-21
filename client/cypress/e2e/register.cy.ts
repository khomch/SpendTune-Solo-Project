  
describe('Login workflow', () => {

  beforeEach(() => {
    cy.task('db:reset');
  });

  it('should login', () => {
    cy.visit('/');
    // cy.contains('account');
  });

})