import styled from "styled-components";

export const BackgroundCardStyled = styled.div`
  background-image: ${(props) => "url(" + props.imageUrl + ")" || "none"};
`;

export const RoundedImageStyled = styled.div`
  background: ${(props) =>
    "url(" + props.imageUrl + ") center /cover no-repeat" || "none"};
  width: 30px;
  height: 30px;
  border-radius: 20px;
  background-size: auto 30px !important;
`;

export const EventStyled = styled.div`
  grid-row-start: ${(props) => props.start};
`;
