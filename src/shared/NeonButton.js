import styled from "styled-components"


export default function NeonButton({content, margin, onClick}){

    return (
        <>
            <Button onClick={onClick} margin={margin}>{content}</Button>
        </> 
    )
}

const Button = styled.div`
font-family: 'Goldman';
text-decoration: none;
display: inline-block;
padding: 8px;
border: 4px solid #FF922D;
border-radius: 0px 8px 0px 8px;
text-shadow: 0 0 8px rgba(255, 255, 255, 0.3) #FF922D;
box-shadow: inset 0 0 20px #FF922D, 0 0 20px #FF922D;
position: relative;
margin: ${props => props.margin};


&:before{
pointer-events: none;
content: "";
position: absolute;
width: 80%;
height: 80%;
background-color: #FF922D;
left: 0;
top: 120%;

transform: perspective(64px) rotateX(40deg) scale(1, 0.35);
filter: blur(64px);
opacity: 0.7;
}

&:after {
content: "";
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: #FF922D;
box-shadow: 0 0 128px 32px #FF922D;
z-index: -1;
opacity: 0;
transition: opacity 100ms linear;
}
&:hover::after, &:focus::after{
    opacity: 1;
}


cursor: pointer;

`