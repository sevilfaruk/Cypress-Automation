/// <reference types="cypress" />

const { not } = require("rxjs/internal-compatibility")

describe('Our first suite', () =>{

    it('first test', () =>{

        //cypress json da bulunan path e gider
        cy.visit('/')

        //forms ve Form layout u bulup tıklar
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //by Tag Name
        cy.get('input')
        //by ID
        //cy.get('#inputEmail1#')
        //by ClassName
       // cy.get('.input-full-width.')
        //by Attribute Name
        cy.get('[placeholder]')
        //by Attribune Name and Value
        //cy.get('[placeholder="Email"]')
        //by Class Value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')
        //by TagName with attriubete value
        //cy.get('input[placeholder="Email]')
        //by two different attributes
        cy.get('[placeholder="Email"][fullwidth]')
        //the most recommend way by Cypress
        //own locator, if ID or other things changes,
        //it will still work
        cy.get('[data-cy="imputEmail1"]')
    })
    it('second test', () =>{
         cy.visit('/')
         cy.contains('Forms').click()
         cy.contains('Form Layouts').click()


        cy.get('[data-cy="signInButton"]')
        cy.contains('Sign in')

        //diğer sign in butonunu bulmak için
        cy.contains('[status="warning"]','Sign in')

        //id si bilinen partın parentını bulmak için
        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain','Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()

            cy.contains('nb-card','Horizontal form').find('[type="email"]')
    })

    it('then and wrap methods', () =>{
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()


        //cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        //cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')
        
        
        //diğer form
        //cy.contains('nb-card','Basic form').find('[for="exampleInputEmail1"]').should('contain','Email address')
       
       
        //cypress style 
        //yukarda sürekli cy contains kullanmak yerine burda düzgün formda kullandık
        //the best way 
        //its the Jquery methods
        cy.contains('nb-card', 'Using the Grid').then(firstForm =>{
            const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
            const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text()
            expect(emailLabelFirst).to.equal('Email')
            expect(passwordLabelFirst).to.equal('Password')
      

            //its the Jquery methods
            //ilk formdaki password ile ikinci formdaki passwordu karşılaştırdık
         cy.contains('nb-card','Basic form').then(secondForm =>{
            const passwordLabelSecond = secondForm.find('[for="exampleInputPassword1"]').text()
            expect(passwordLabelFirst).to.equal(passwordLabelSecond)


            //its the cypress method 
            cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain','Password')

            })
        })

    })

    it('Invoke Command', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //1
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        //2
        cy.get('[for="exampleInputEmail1"]').then( label =>{
            expect(label.text()).to.equal('Email address')
        })

        //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {

            expect(text).to.equal('Email address')
        })


        //checkbox clicked or not
        cy.contains('nb-card','Basic form')
            .find('nb-checkbox')
            .click()
            .find('.custom-checkbox')
            .invoke('attr','class')
            //.should('contain','checked') //also works
            .then(classValue =>{ //most common way
                expect(classValue).to.contain('checked')
            })

    })

    //datepicker example
    it('assert property', () =>{
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker').find('input').then(input =>{
            cy.wrap(input).click()
            cy.get('nb-calendar-day-picker').contains('17').click()
            cy.wrap(input).invoke('prop','value').should('contain','Nov 17, 2021')
        })

    })


    //radiobutton clicked or not  
    it('radio button', () =>{
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons =>{
            cy.wrap(radioButtons)
            .first()
            .check({force:true}) //hidden elemente tıklamak için force ettik
            .should('be.checked')

        cy.wrap(radioButtons)    
            .eq(1)
            .check({force:true})

        cy.wrap(radioButtons)    
            .eq(0)
            .should('not.be.checked')

        cy.wrap(radioButtons)
            .eq(2)
            .should('be.disabled')

        }) 

    })

    //checkbox
    it('check boxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        cy.get('[type="checkbox"]').eq(1).check({force:true}) //same with the following
        cy.get('[type="checkbox"]').eq(1).click({force:true})

    })

    //list and dropwdown selection
    it('list and dropdown', () =>{
            cy.visit('/')
            cy.contains('Modal & Overlays').click()
            cy.contains('Toastr').click()


      //1
      //direkt elle dropdown dan seçme ve kontrol etme
            cy.get('nav nb-select').click()
            cy.get('.options-list').contains('Dark').click()//selection from dropdown menu
            cy.get('nav nb-select').should('contain', 'Dark')
            cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')//dropwdowndan seçilen renk ile arkplanın rengini kontrol ettik


      //2
      //multiple dropdown controller
      cy.get('nav nb-select').then(dropdown =>{
            cy.wrap(dropdown).click()
            cy.get('.options-list nb-option').each( (listItem, index )=>{
                const itemText = listItem.text().trim() //trim boşlukları siler
                const colors = {
                    "Light" : "rgb(255, 255, 255)",
                    "Dark"  : "rgb(34, 43, 69)",
                    "Cosmic": "rgb(50, 50, 89)",
                    "Corporate" : "rgb(255, 255, 255)"
                    
                }
                cy.wrap(listItem).click()
                cy.wrap(dropdown).should('contain', itemText)

                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText]) //tüm colorlar için obje yarattık burası ile check ediyor
                if(index <3){ //dropdown a tekrar tıklamaması için index kontrolu yaptık
                    cy.wrap(dropdown).click()
                }
                
            })
      })
    })


    //table 
    it.only('table', () =>{
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()


        //1
        cy.get('tbody').contains('tr', 'Larry').then(tableRow =>{ //Larry satırını bulduk
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('25')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '25') // değiştirdiğimiz değeri burada kontrol ediyoruz

        })
        //2
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then(tableRow =>{ // tabloya insert ettik
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Artem')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Bondar')
            cy.wrap(tableRow).find('.nb-checkmark').click()
        }) 
        cy.get('tbody tr').first().find('td').then(tableColumns =>{ // insert edileni kontrol ettik
            cy.wrap(tableColumns).eq(2).should('contain', 'Artem')
            cy.wrap(tableColumns).eq(3).should('contain', 'Bondar')

        })
    })


})





