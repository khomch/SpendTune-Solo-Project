

describe('syncs and categorises transactions from new user', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('email'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.get('form').submit();
  })

  it.skip('syncs transactions with new bank', () => {

    cy.intercept(
      'GET',
      'http://localhost:3001/api/create-link-token',
      {
        statusCode: 200,
        body: {
          expiration: '2023-11-22T14:37:39Z',
          link_token: 'link-sandbox-8650a104-a120-436f-a660-3492b6df1b6c',
          request_id: '5vTKC9G5i2cZGVX'
        }
      }
    ).as('createLinkToken')

    cy.intercept(
      'POST',
      'http://localhost:3001/api/exchange-public-token',
      {
        statusCode: 200,
        fixture: 'user.new.json'
      }).as('exchangeToken')

    cy.intercept(
      'POST',
      'http://localhost:3001/api/sync-transactions',
      { statusCode: 200, fixture: 'user.with.trx.json' }
    ).as('syncTransactions')

    cy.intercept('**plaid.com**', { fixture: 'user.new.json' }).as('plaidIntercept');


    cy.visit('/home');

    // onBeforeLoad(win) {
    //   cy.stub(win, 'fetch')
    //     .withArgs(Cypress.sinon.match(/.*plaid.com.*/))
    //     .resolves(newUser)  
    // },

    cy.get('.navbar > :nth-child(1) > :nth-child(2)').click();
    cy.url().should('include', '/sync');

    cy.wait('@createLinkToken').then(({ response }) => {
      const publicToken = response!.body.link_token;
      cy.log('publicToken :>> ', publicToken);
    });

    cy.wait('@exchangeToken').then(inter => {
      cy.log('@exchangeToken - inter :>> ', inter);
    })



    // cy.wait('@plaidIntercept').then(inter => cy.log(inter.response!.statusCode.toString()));
    // cy.wait('@syncTransactions');
  });



  it('adds new category and categorises transactions', () => {

    const uuid = () => Cypress._.random(0, 1e6).toString()
    const firstCat = uuid();
    const secondCat = uuid();
    let initialUncatTransactions;
    cy.get('.transaction__row').then(rows => {
      initialUncatTransactions = rows.length
    })

    cy.contains('Add category').eq(0).click();
    cy.get('.modal__input').eq(0).type(firstCat);
    cy.get('.btn').eq(0).click();

    cy.contains('Add category').eq(0).click();
    cy.get('.modal__input').eq(0).type(secondCat);
    cy.get('.btn').eq(0).click();

    cy.get('.transaction__dropdown').eq(1)
      .select(firstCat);
    cy.get('.transaction__dropdown').eq(3)
      .select(secondCat).then(el => {
        cy.get('.transaction__row').should('have.length', 4);
      });

  });
});





const newUser = {
  "_id": {
    "$oid": "655ccd2b7205ff8de3e0533a"
  },
  "email": "juancamilo210@gmail.com",
  "password": "$2b$10$w3zCiDnBxxBb4qK1sn5NiOOO754t/uLFbWkWf5pxnDyi4JaysEbSy",
  "firstName": "juan",
  "lastName": "v",
  "accessToken": "",
  "linkedBanks": [],
  "next_cursor": "CAESJTlQcjFEd2V2VkFpYXFNTk5xYnY5Q3l3UmtramxscXVxUUt4QkEiDAiMpvOqBhDok/ikAioMCIym86oGEOiT+KQC",
  "transactions": [],
  "transactionsCategorized": [],
  "categories": [],
  "__v": 2
}