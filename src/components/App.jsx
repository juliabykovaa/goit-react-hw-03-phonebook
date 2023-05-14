import { React, Component } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactBook } from './ContactBook/ContactBook';
import { Filter } from './FilterContactBook/FilterContactBook';
import { nanoid } from 'nanoid';
import { Container, Header } from './App.styled';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  addToContacts = ({ name, number }) => {
    const contactToadd = {
      id: nanoid(),
      name,
      number,
    };

    this.setState(({ contacts }) => ({
      contacts: [contactToadd, ...contacts],
    }));
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('phone', JSON.stringify(this.state.contacts));
    }
  }

  componentDidMount() {
    const savedContact = JSON.parse(localStorage.getItem('phone'));
    this.setState({ contacts: savedContact });
  }

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getFilteredContacts = () => {
    const { filter, contacts } = this.state;
    const filterNormalized = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filterNormalized)
    );
  };

  render() {
    const { filter } = this.state;
    const filteredContacts = this.getFilteredContacts();

    return (
      <>
        <Container>
          <Header>Phonebook</Header>
          <ContactForm
            onSubmit={this.addToContacts}
            contacts={this.state.contacts}
          />

          <Header>Contacts</Header>
          <Filter value={filter} onChange={this.changeFilter} />
          {filteredContacts.length ? (
            <ContactBook
              contacts={filteredContacts}
              onDeleteContact={this.deleteContact}
            />
          ) : (
            <p>No contacts</p>
          )}
        </Container>
      </>
    );
  }
}
