const db = require('../database/db')

const getWishlistByUserId = async (id) => {
    return await db.any(' Select * FROM wishlists INNER JOIN users ON wishlists.user_id = users.id  INNER JOIN products ON wishlists.product_id = products.id WHERE user_id = $1', id)
}

const createWishlistItem = async (product_id, user_id, style_id) => {
    const insertQuery = `
        INSERT INTO wishlist
            (product_id, user_id, style_id)
        VALUES
            ($1, $2, $3) 
        RETURNING *
    `
    return await db.one(insertQuery, [product_id, user_id, style_id])
}

const updateWishlistItem = async (id) => {
    const updateQuery = `
        UPDATE wishlists
        SET willing_to_buy = NOT willing_to_buy
        WHERE id = $1 
        RETURNING *
    `
    return await db.one(updateQuery, [id])
}

const createVote = async (id) =>  {
    const createdVote = `
     INSERT INTO votes (product_id, user_id)
        VALUES ((SELECT product_id FROM wishlists WHERE id=$1), (SELECT user_id FROM wishlists WHERE id=$1))
        RETURNING *
    `
    return await db.one(createdVote, [id]);
}

const deleteVote = async (id) => {
    const deletedVote = `
    DELETE FROM votes WHERE product_id = (SELECT product_id FROM wishlists WHERE id=$1) AND user_id = (SELECT user_id FROM wishlists WHERE id=$1) `;
    return await db.none(deletedVote, [id]);
};

const deleteWishlistItem = async (id) => {
    return db.one('DELETE FROM wishlist WHERE id=$1 RETURNING *', id)
}

module.exports = {
    getWishlistByUserId, 
    createWishlistItem, 
    updateWishlistItem,
    deleteWishlistItem,
    createVote,
    deleteVote
}
