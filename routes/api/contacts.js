const express = require('express');
const { getContacts, getContactByID, postContact, deleteContact, putContact, patchFavourite } = require('../../controllers/contacts');
const { authentificateUser } = require('../../middleware/authentificateUser');

const router = express.Router()

router.get('/', authentificateUser,getContacts)

router.get('/:contactId', authentificateUser,getContactByID)

router.post('/', authentificateUser,postContact)

router.delete('/:contactId', authentificateUser,deleteContact)

router.put('/:contactId', authentificateUser,putContact)

router.patch('/:contactId/favourite', authentificateUser, patchFavourite)
router.patch('/:contactId/favorite', authentificateUser, patchFavourite)

module.exports = router