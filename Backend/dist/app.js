"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_1 = __importDefault(require("./test"));
const app = (0, express_1.default)();
function RequestLogger(req, res, next) {
    console.log(`Receiving ${req.method} request to ${req.path} with body ${JSON.stringify(req.body)}`);
    (0, test_1.default)();
    next();
}
app.use(RequestLogger);
function Main(req, res) {
    res.send("The server is running");
}
app.get("/", Main);
app.listen(3000, "::", () => console.log("Server is running on http://localhost:3000"));
// Happy Happy Happy
