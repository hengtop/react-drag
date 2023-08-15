import styled from "@emotion/styled";

export const HomeWrapper = styled.div`
  height: 100vh;
  background: #fff;
`;
export const MainContainer = styled.div`
  width: 100%;
  height: calc(100% - 48px);
  display: flex;

  .left {
    width: 200px;
    background-color: #fff;

    .drag-wrapper {
      margin-top: 20px;
      background-color: #f2f3f4;
    }

    .component-item {
      padding: 5px 10px;
      border: 1px solid #bfa;
    }
  }

  .center {
    flex: 1;
    background-color: #f2f3f4;
    overflow: scroll;
  }

  .right {
    width: 288px;
    background-color: #fff;
  }
`;
