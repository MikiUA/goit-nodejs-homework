const express = require('express');
const { getContacts, getContactByID, postContact, deleteContact, putContact, patchFavourite } = require('../../controllers/contacts');

const router = express.Router()

router.get('/', getContacts)

router.get('/:contactId',getContactByID)

router.post('/',postContact)

router.delete('/:contactId',deleteContact)

router.put('/:contactId',putContact)

router.patch('/:contactId/favourite', patchFavourite)
router.patch('/:contactId/favorite', patchFavourite)

module.exports = router