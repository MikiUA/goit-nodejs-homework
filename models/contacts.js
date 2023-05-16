const {Contact} =require("./schemas");

const listContacts = async ({filter={},page=1,items_per_page=10}) => {
  return Contact.find(filter,null,{limit:items_per_page,skip:((page-1)*items_per_page)});
}

const getContactById = async (id) => {
  return Contact.findOne({ _id: id });
}

const addContact = async (data) => {
  return Contact.create(data);
}

const removeContact = async (id) => {
  return Contact.findByIdAndRemove({ _id: id });
}

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate({ _id: contactId }, body, { new: true });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
