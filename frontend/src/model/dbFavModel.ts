export interface Favorites {
    _id: string;
    userId: string;
    favorites: Favorite[];
}

export interface Favorite {
    truckId: string;
}