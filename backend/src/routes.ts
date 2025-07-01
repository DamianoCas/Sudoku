import { GameController } from "./controller/GameController"
import { SudokuBoardController } from "./controller/SudokuBoardController"
import { UserController } from "./controller/UserController"
import { UsersGamesController } from "./controller/UsersGamesController"

export const Routes = [
//User routes    
{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, {
    method: "post",
    route: "/validateUser",
    controller: UserController,
    action: "login"
},

//Sudoku Boards routes
{
    method: "get",
    route: "/sudokuBoard/:id",
    controller: SudokuBoardController,
    action: "one"
},

//Game routes
{
    method: "post",
    route: "/game",
    controller: GameController,
    action: "save"
},

//UsersGames routes
{
    method: "post",
    route: "/usersGames",
    controller: UsersGamesController,
    action: "save"
}
]