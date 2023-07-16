"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Navbar_1 = require("@/Navbar");
var Searchbar_1 = require("@/Searchbar");
require("./App.css");
function App() {
    var _a = (0, react_1.useState)(0), count = _a[0], setCount = _a[1];
    return (<>
      <div>
        <Navbar_1.default />
        <Searchbar_1.default />
      </div>
    
    </>);
}
exports.default = App;
