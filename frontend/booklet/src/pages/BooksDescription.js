import React from 'react'
import axios from "axios";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import ReviewLayout from "../components/ReviewLayout";
import BookItem from "../components/BookItem";

const ImageDiv=styled.img`
    width:300px;
    height: 400px;
    margin-bottom: 10px;
`;
const BookDiv = styled.div`
    display: flex;
    margin: 100px;
    flex-flow: column wrap;
`;

const ReviewDiv = styled.div `
    display:flex;
    margin-top: 20px;
    flex-direction: column ;
`;
const TextArea = styled.textarea`
            height: 100px;
            width: 400px;
            solid #f6f6f6;
            text-align: center;
            margin-top:10px;
            margin-bottom: 20px;
            animation: input-field ease-in 2s;
`;

const InputText = styled.input`
            height: 40px;
            solid :#f6f6f6;
            width :400px;
            margin-top:10px;
            margin-bottom: 20px;
            text-align: center;
`;
const FormDiv = styled.form`
            display: flex;
            flex-direction: column;
`;

const StyledButton = styled.button`
   height: 41px;
   width: 135px;
   margin-bottom:20px;
   border-radius: 10px;
   background-color: skyblue;
   text-align: center;
   color: #442305;
   font-family: Roboto;
   font-size: 16px;
   font-weight: bold;
`;
export default class BooksDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            book : '',
            review:'',
            ratings:'',
            reviews: [
                {
                    id: 1,
                    ratings: 5,
                    review: "Good book",
                    rate_reviewer: "4"
                },
                {
                    id: 2,
                    ratings: 4.5,
                    review: "normal book",
                    rate_reviewer: "4.7"
                },
                {
                    id: 3,
                    ratings: 3.5,
                    review: "Bad book",
                    rate_reviewer: "4.2"
                }
            ]
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {

        this.setState({
            [event.target.name]: event.target.value
        });
    }

    getUserToken(){
        return JSON.parse(localStorage.getItem("userToken"));
    }

    handleSubmit(event) {
        event.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getUserToken().access}`
        }
        console.log('pressed');
        const bookData = {

            ratings : this.state.ratings,
            review : this.state.review
        };
        const data = new FormData(event.target);

        let review = data.get('review');
        let rating = data.get('rating');
        console.log(`Bearer ${this.getUserToken().access}`);
        console.log(this.state);
        axios.post(`http://127.0.0.1:8000/books/${this.state.book.id}/rate-review/`,bookData, {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getUserToken().access}`
            }
        }).then(response => {
            console.log('I am in good'+response.status);
            this.props.history.push('/books/');

            console.log("request successful :  "+response.data);
        }).catch(error => {
                const statusCode = error.response.status;
                console.log('I am in bad '+error.response.status);
                let refresh = this.getUserToken().refresh;
                console.log(refresh);
                if(statusCode=== 401) {
                    axios.post('http://127.0.0.1:8000/api/token/refresh/', {refresh:this.getUserToken().refresh })
                        .then(response => {
                            console.log(response.data.access);
                            axios.post(`http://127.0.0.1:8000/books/${this.state.book.id}/rate-review/`,bookData, {
                                headers:{
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${response.data.access}`
                                }
                            }).then(response => {
                                console.log('I am in good under bad'+response.status);
                                this.props.history.push('/books/');
                                console.log("request successful :  "+response.data);
                            }).catch(error => {
                                console.log(error);
                            })
                        })
                        .catch(error => {
                                console.log(error +"refresh token api error");
                            }
                        )
                }
                console.log(error);
            }
        )
    }

    render() {
        const { title, description,id, author, isbn, thumbnail, category, availability,type} = this.state.book;
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        return (
            <div>
                <Navbar isLoggedIn = {isLoggedIn}/>
                <BookDiv>
                    <ImageDiv src = {thumbnail} alt="Smiley face"/>
                    <h2>{title}</h2>
                    <h3>{author}</h3>
                    <p>{description}</p>

                    <p>Want to buy or get the book?</p>
                    <p> Owner Email : jarintasnimaugust20</p>

                    <ReviewDiv>
                        <h3 margin ="20px">Input review: </h3>
                        <FormDiv onSubmit={this.handleSubmit}>
                            <TextArea
                                type="text"
                                name="review"
                                required
                                placeholder="Enter books review"
                                onChange={this.handleChange}
                                onClick={this.handleChange}/>
                            <label>Rating for the book</label>
                            <InputText
                                type="number"
                                name="ratings"
                                min="1"
                                max="5"
                                required
                                placeholder="Enter your rating"
                                onChange={this.handleChange}
                                onClick={this.handleChange}/>
                            <StyledButton type={'submit'}>Submit</StyledButton>
                        </FormDiv>



                    </ReviewDiv>
                    <h2>Reviews :</h2>
                    {
                        this.state.reviews.map(review => (
                            <ReviewLayout key={review.id} reviewData={review} />
                        ))
                    }

                </BookDiv>

                <h2>jksasakj{this.props.match.params.id}</h2>
            </div>
        );
    }

    componentDidMount() {
        const  bookId= this.props.match.params.id;
        axios.get('http://127.0.0.1:8000/books/')
            .then(response => {
                console.log();
                response.data.filter((book) => {
                    if(book.id == bookId) {
                        console.log('entered');
                        this.setState({
                            book : book,
                        });
                        console.log(book);
                    }

                });
            }).catch(error => {
                console.log(error);
        })
    }
}
