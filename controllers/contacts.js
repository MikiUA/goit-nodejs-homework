const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../models/contacts');
const { isValidObjectId } = require('mongoose');

exports.getContacts=async (req, res) => {
  const {page=1}=req.query;
  const items_per_page=req.query.items_per_page||req.query.limit||10;
  const favorite=req.query.favorite||req.query.favourite||null;
  let filter={owner:req.userID};
  if (favorite) filter.favorite=favorite;
    try {
      const results = await listContacts({filter,page,items_per_page});
      if(!results) return res.status(404).send({message:"no contacts found"})
      return res.status(200).send(results);
    } catch (e) {
      console.error(e);
      return res.status(500).send({message:e.message || "internal server error"});
    }
}

exports.getContactByID = async (req, res) => {
    const {contactId}=req.params;
    if (!isValidObjectId(contactId)) return res.status(400).send({message:"contact id is not valid"})
    try {
      const result = await getContactById(contactId);
      if(!result) return res.status(404).send({message:"no contact found"})
      if(result.owner!==req.userID) return res.status(403)
      res.status(200).send(result)
    } catch (e) {
      console.error(e);
      return res.status(500).send({message:e.message || "internal server error"});
    }
}

exports.postContact = async (req, res) => {
    const {name,email,phone}=req.body;
    if (!name || !email || !phone) return res.status(400).send({"message": "missing required name field"});
    try {
      const newContact=await addContact({name,email,phone,owner:req.userID});
      if(!newContact) return res.status(404).send({message:"no contact found"})
      return res.status(200).send(newContact);
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({message:err.message || "internal server error"});
    }
}

exports.deleteContact= async (req, res) => {
    const {contactId}=req.params;  
    if (!isValidObjectId(contactId)) return res.status(400).send({message:"contact id is not valid"})
    try {
      const contact = await getContactById(contactId);
      if(!contact) return res.status(404).send({message:"no contact found"})
      if(contact.owner!==req.userID) return res.status(403)
      const result=await removeContact(contactId);
      if(!result) throw
      return res.status(204).send({message:"succesfully deleted"});
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({message:err.message || "internal server error"});
    }
}

exports.putContact= async (req, res) => {
    const {contactId}=req.params;  
    if (!isValidObjectId(contactId)) return res.status(400).send({message:"contact id is not valid"})
    const {name,email,phone}=req.body;
    const newBody={};  if (name) newBody.name=name;  if (email) newBody.email=email;  if (phone) newBody.phone=phone;
    if (Object.keys(newBody).length===0) return res.json({ message: 'missing any of required name fields' })
    
    try {      
      const contact = await getContactById(contactId);
      if(!contact) return res.status(404).send({message:"no contact found"})
      if(contact.owner!==req.userID) return res.status(403)
      const newContact=await updateContact(contactId,newBody);
      if(!newContact) throw
      return res.status(200).send(newContact);
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({message:err.message || "internal server error"});
    }
}

exports.patchFavourite=async (req,res)=>{
    const {contactId}=req.params;  
    if (!isValidObjectId(contactId)) return res.status(400).send({message:"contact id is not valid"})
    
    const {favorite,favourite}=req.body;
    let favouriteParam;
    if (typeof(favorite)==="boolean") favouriteParam=favorite;
    if (typeof(favourite)==="boolean") favouriteParam=favourite;
    if (typeof(favouriteParam)!=="boolean")  return res.json({ message: 'missing required "favourite" field' })
  
    try {      
      const contact = await getContactById(contactId);
      if(!contact) return res.status(404).send({message:"no contact found"})
      if(contact.owner!==req.userID) return res.status(403)
      if(contact.favorite===favouriteParam) return res.status(200).send(contact);
      const newContact=await updateContact(contactId,{favorite:favouriteParam});
      if(!newContact) return res.status(404).send({message:"no user found"})
      return res.status(200).send(newContact);
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({message:err.message || "internal server error"});
    }
}