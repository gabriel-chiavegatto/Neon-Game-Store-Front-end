import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import styled from "styled-components";
import { IoBagCheckOutline } from "react-icons/io5";
import Collapsible from "react-collapsible";
import { TailSpin } from "react-loader-spinner";
import dayjs from "dayjs";
import Footer from "../shared/Footer.js";
import NeonButton from "../shared/NeonButton";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { name, token } = user;
  const [order, setOrder] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cpf, setCpf] = useState("");
  const [payment, setPayment] = useState("");
  const date = dayjs().format("DD/MM/YYYY");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    async function GetOrder() {
     
      try {
        const response = await axios.get(
          "https://neon-game-store-back.herokuapp.com/checkout",
          config
        );

        setOrder(response.data);
      } catch (error) {
        const message = error.response.statusText;
        alert(message);
      }
    }
    GetOrder();
  }, []);
 
  if (order.length === 0) {
    return (
      <Loading>
        <TailSpin
          color="#ffab2d"
          text-align="center"
          ariaLabel="loading-indicator"
        />
      </Loading>
    );
  }

  function RenderProducts() {
    console.log(order);

    return order[order.length-1].products.map((product, index) => {
      const { name, price, imageURL, _id } = product;
      return (
        <>
          <Product key={index}>
            <Info>
              <Link to={`game/${_id}`}>
                <img src={imageURL} alt="product" />
              </Link>
              <span> {name} </span>
            </Info>
            <Info>
              <span>${price} </span>
            </Info>
          </Product>
        </>
      );
    });
  }

  function RenderTotal() {
    return (
      <>
        <Total>
          <span>TOTAL</span>
          <span>${order[order.length-1].total}</span>
        </Total>
      </>
    );
  }

  function RenderCustomerData() {
    return (
      <>
        <input
          type="name"
          id="name"
          value={name}
          placeholder="Nome"
          // onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          id="cpf"
          value={cpf}
          placeholder="CPF"
          onChange={(e) => setCpf(e.target.value)}
        />
        <input
          type="text"
          id="phone"
          value={phone}
          placeholder="Telefone"
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          id="address"
          value={address}
          required
          placeholder="Endereço"
          onChange={(e) => setAddress(e.target.value)}
        />
        <p>Forma de pagamento</p>
        <RadioGroup>
          <input
            type="radio"
            id="creditcard"
            name="fav_language"
            value="Cartão de crédito"
            onChange={(e) => setPayment(e.target.value)}
          />
          <label htmlFor="creditcard">Cartão de Crédito</label>
          <br></br>
          <input
            type="radio"
            id="debitcard"
            name="fav_language"
            value="Cartão de débito"
            onChange={(e) => setPayment(e.target.value)}
          />
          <label htmlFor="debitcard">Cartão de Débito</label> <br></br>
          <input
            type="radio"
            id="boleto"
            name="fav_language"
            value="Boleto"
            onChange={(e) => setPayment(e.target.value)}
          />
          <label htmlFor="boleto">Boleto</label>
        </RadioGroup>
      </>
    );
  }


  async function DeleteCart() {
   

    try {
      await axios.delete(
        `https://neon-game-store-back.herokuapp.com/cart`,
        // body,
        config
      );
      DeleteCheckout();
    } catch (error) {
      const message = error.response.statusText;
      alert(message);
    }
  }

  async function DeleteCheckout() {
    try {
      await axios.delete(
        `https://neon-game-store-back.herokuapp.com/checkout`,
        // body,
        config
      );
     
    } catch (error) {
      const message = error.response.statusText;
      alert(message);
    }
  }

  async function SubmitOrder() {

    const { total, products } = order[0];
    console.log(total);
    const body = {
      name,
      cpf,
      products,
      total,
      address,
      payment,
      date,
    };

    try {
      await axios.post(
        "https://neon-game-store-back.herokuapp.com/orders",
        body,
        config
      );
      DeleteCart();
      navigate("/success")
    } catch (error) {
      const message = error.response.statusText;
      alert(message);
    }
  }

  return (
    <>
      <Header>
        <span>Finalizar compra</span>
        <i>
          <IoBagCheckOutline />
        </i>
      </Header>
      <Container>
        <Collapsible trigger=">> Resumo do pedido">
          <Products>{RenderProducts()}</Products>
        </Collapsible>
        <Collapsible trigger=">> Dados da compra">
          <Products>{RenderCustomerData()}</Products>
          {RenderTotal()}
        </Collapsible>
        <button onClick={SubmitOrder}>
        <NeonButton
          content={"Finalizar compra"}
        ></NeonButton>
        </button>
      </Container>
      <Footer />
    </>
  );
}

const Container = styled.main`
  width: 100vw;
  min-height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  overflow-x: hidden;
  justify-content: "flex-start";
  margin-top: 50px;
  margin-bottom: 110px;
  padding: 15px;
  overflow-y: hidden;

  button {
    background-color: #11ffee00;
    border: none;
    color: #ffffff;
  }

  .Collapsible {
    width: 100%;
    font-family: "Goldman", cursive;
    font-size: 18px;
    margin-bottom: 30px;
    background-color: #212121;
    border-radius: 10px;
    color: #d8d4d4;
    border: 0.1rem solid #fff;
    border-radius: 0.1rem;
    padding: 0.4em;
    box-shadow: 0 0 0.1rem #fff, 0 0 0.1rem #fff, 0 0 1rem #ffab2d,
      0 0 0.4rem #ffab2d, 0 0 0.4rem #ffab2d, inset 0 0 0.8rem #ffab2d;
  }

  .Collapsible__contentInner {
    /* max-height: calc((100vh - 380px)); */
    max-height: max-content;
    padding: 5px;
  }

  input {
    /* height: 50px;
    border-radius: 5px;
    border-bottom: 1px; */
    margin: 20px 0 20px 0;
    font-family: "Inria Sans", sans-serif;
    background-color: #212121;
    outline: none;
    border-width: 0 0 2px;
    border-color: #ffab2d;
    color: #ffffff;
    font-size: 15px;
  }
  input:first-child {
    margin-top: 40px;
  }

  p {
    font-family: "Inria Sans", sans-serif;
    margin-top: 20px;
    font-size: 18px;
  }
`;

const Header = styled.div`
  background-color: #151515;
  color: #ffab2d;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;

  span {
    font-family: "Goldman", cursive;
    font-size: 20px;
  }

  i {
    font-size: 27px;
  }
`;

const Products = styled.div`
  width: 100%;
  height: calc((100vh - 380px));
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const Product = styled.div`
  color: #ffab2d;
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-family: "Inria Sans", sans-serif;
    font-size: 16px;
    margin-bottom: 70px;
    color: #ffffff;
  }

  span:nth-child(3) {
    font-weight: 700;
    color: #ffffff;
  }

  img {
    width: 130px;
    height: 160px;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Total = styled.div`
  color: #ffab2d;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    color: #d8d4d4;
    font-weight: 700;
    font-family: "Inria Sans", sans-serif;
    font-size: 18px;
  }

  span:nth-child(2) {
    color: #ffab2d;
  }
`;

const RadioGroup = styled.div`
  font-family: "Inria Sans", sans-serif;
  font-size: 16px;
  margin-top: 20px;

  input[type="radio"] {
    margin: 0 3px 5px 10px;
  }
`;

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
