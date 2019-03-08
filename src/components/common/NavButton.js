import styled from "styled-components";

const NavButton = styled.button`
  height: 3em;
  background: white;
  color: #71c1a1;
  padding: 1em;
  line-height: 1;
  border: none;

  .active & {
    background: #71c1a1;
    color: white;
  }
`;

export default NavButton;