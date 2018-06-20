const React = require("react");
import ReactDOM from "react-dom";
const { compose, map } = require("ramda");

const getItem = item => <li>{item}</li>;

const getWrapper = className => items => <ul className={className}>{items}</ul>;

const render = compose(
  getWrapper("demo-wrapper"),
  map(getItem)
);

ReactDOM.render(
  render(["todo1", "todo2", "todo3", "todo4"]),
  document.getElementById("main")
);

// const store = {
//   todos: ["todo1", "todo2", "todo3", "todo4"]
// };
// // style
// import "./index.css";

// function forceRender() {
//   ReactDOM.render(render(store.todos), document.getElementById("main"));
// }
// function deleteTodoByItem(item) {
//   store.todos = store.todos.filter(todo => todo !== item);
//   forceRender();
// }

// const getItem = onDelete => classname => item => (
//   <li className={classname} key={item}>
//     {item}
//     <span className="delete" onClick={onDelete.bind(null, item)}>
//       X
//     </span>
//   </li>
// );

// const getWrapper = className => items => <ul className={className}>{items}</ul>;

// const render = compose(
//   getWrapper("demo-wrapper"),
//   map(getItem(deleteTodoByItem)("demo-todo-item"))
// );

// ReactDOM.render(render(store.todos), document.getElementById("main"));
