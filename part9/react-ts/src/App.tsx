import Header from "./Header";
import Content from "./Content";
import Total from "./Total";
import courseParts from "./courseParts";

const App = () => {
  const courseName = "Half Stack application development";

  return (
    <div>
      <Header courseName={courseName}></Header>
      <Content courseParts={courseParts}></Content>
      <Total courseParts={courseParts}></Total>
    </div>
  );
};

export default App;
