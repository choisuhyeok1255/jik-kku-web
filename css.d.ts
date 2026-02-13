// CSS 파일을 side-effect로 import하는 경우를 위한 타입 선언
declare module "*.css";

// SVG를 React 컴포넌트로 import하기 위한 타입 선언
declare module "*.svg" {
  import React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
