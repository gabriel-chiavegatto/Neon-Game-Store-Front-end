import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Footer from "../shared/Footer";
import UserContext from "../context/UserContext"

export default function Game() {
  const [game, setGame] = useState({});
  const [added, setAdded] = useState(false)
  const {user} = useContext(UserContext)
  const { id } = useParams();
  const config = {
    headers:{
      Authorization: `Bearer ${user.token}`
    }
  }
  const navigate = useNavigate()

  console.log(game)
    useEffect(() => {
    async function FetchData(){
      const {data} = await axios.get(`https://neon-game-store-back.herokuapp.com/game/${id}`)
      setGame(data)
    } 
    FetchData() 
    }, [id])

    function buyNow() {
          const body = {
            products: [
              {
                name: game.name,
                description: game.description,
                price: game.price,
                imageURL: game.imageURL,
              },
            ],
            total: game.price,
          };
          axios
            .post(
              "https://neon-game-store-back.herokuapp.com/checkout",
              body,
              config
            )
            .then(() => {
              console.log("Tudo ok");
              navigate("/checkout");
            })
            .catch((error) => {
              console.log(error);
            });
     
      };
    

     const isEmpty = Object.keys(game).length === 0 

     async function addToCart(){
      try {
        const body = {name: game.name, price:game.price, description:game.description, imageURL:game.imageURL}
        await axios.post("https://neon-game-store-back.herokuapp.com/cart", body, config)
        setAdded(true)
        
      } catch (error) {
        alert("Erro ao adicionar ao carrinho")
      }


      }

  async function removeFromCart(){
    const bool = window.confirm("Deseja remover este produto do carrinho?")
    if(bool && !isEmpty){
      try {
        await axios.delete(`https://neon-game-store-back.herokuapp.com/cart/${game._id}`,config)
        console.log("Removido com sucesso")
        setAdded(false)
      } catch (error) {
        alert("Erro ao remover do carrinho")
      }
    }
  }
    return (
       <>
       <Container>
          {!isEmpty ? 
           <>
             <div className="section">
            <img className="imagesolo" src={game.soloURL}/>
          </div>
          <div className="infos">
                <h2 className="gamename">{game.name}</h2>
                <div className="tec-infos"></div>
                <h3>Sobre o jogo</h3>
            <p className="description">{game.description}</p>
          </div>
          <div className="footer">
            <div className="actions">
              <div>
             
                <button onClick={buyNow} className="comprar">Compre Agora</button>
            
              {added ? <button onClick={removeFromCart}>Remover do Carrinho</button> : <button onClick={addToCart}>Adicionar ao Carrinho</button>}
              </div>
              <p className="price">R$ {game.price.toFixed(2).replace(".",",")}</p>
            </div>
         
          </div>
          
          <Footer /> 
           </>: "Carregando..." }
        </Container>
       </>
    )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  padding: 20px;
  height: 100vh;

  background: linear-gradient(
    180deg,
    rgba(199, 8, 1, 1) 0%,
    rgba(0, 0, 0, 1) 40%
  );

  .imagesolo {
    width: 250px;
  }

  .infos {
    .gamename {
      font-size: 50px;
      font-family: "Goldman";
    }
    .description {
      text-align: justify;
      font-family: "Inria Sans";
      font-size: 18px;
    }
  }

  h3 {
    font-size: 20px;
    margin: 10px 0px;
  }

  .footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  .actions {
    display: flex;
    align-items: center;
    width: 100%;

  
    .price {
      color: #dfff1e;
      font-size: 20px;
      margin-left: 10px;
    }
  }

  a{
    text-decoration: none;
  }

  button {
    background: linear-gradient(
      180deg,
      rgba(255, 16, 16, 1) 0%,
      rgba(138, 0, 0, 1) 100%
    );
    color: white;
    font-family: "Goldman";
    border-radius: 5px;
    width: 100%;
    border: none;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    font-size: 16px;
  }
`;
