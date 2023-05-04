const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../models/contacts');
const { isValidObjectId } = require('mongoose');

exports.getContacts=async (req, res) => {
    try {
      const results = await listContacts();
      if(!results) return res.status(404).send({message:"no user found"})
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
      const results = await getContactById(contactId);
      if(!results) return res.status(404).send({message:"no user found"})
      res.status(200).send(results)
    } catch (e) {
      console.error(e);
      return res.status(500).send({message:e.message || "internal server error"});
    }
}

exports.postContact = async (req, res) => {
    const {name,email,phone}=req.body;
    if (!name || !email || !phone) return res.status(400).send({"message": "missing required name field"});
    try {
      const newContact=await addContact({name,email,phone});
      if(!newContact) return res.status(404).send({message:"no user found"})
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
      const result=await removeContact(contactId);
      if(!result) return res.status(404).send({message:"no user found"})
      return res.status(200).send({message:"succesfully deleted"});
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
      const newContact=await updateContact(contactId,newBody);
      if(!newContact) return res.status(404).send({message:"no user found"})
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
      const newContact=await updateContact(contactId,{favorite:favouriteParam});
      if(!newContact) return res.status(404).send({message:"no user found"})
      return res.status(200).send(newContact);
    }
    catch (err) {
      console.error(err);
      return res.status(500).send({message:err.message || "internal server error"});
    }
}