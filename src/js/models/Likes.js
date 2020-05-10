export default class Likes{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {
            id,
            title,
            author,
            img
        }
        this.likes.push(like);

        //persist data to local storage
        this.persistData();

        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //persist data to local storage
        this.persistData();
    }
    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }
    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes)); //JSON.stringify() converts array into stirng
    }

    readStorage(){

        //restoring data from local storage
        const storage = JSON.parse(localStorage.getItem('likes'));  //JSON.parse() converts string into array
        if(storage){
            this.likes = storage;
        }
    }
}